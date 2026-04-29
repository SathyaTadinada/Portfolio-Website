import glob from 'fast-glob'
import path from 'path'

import { type ArticleSeriesRef } from '@/lib/series'

export interface Article {
  title: string
  description: string
  author: string
  date: string
  readingMinutes?: number
  series?: ArticleSeriesRef
  tags?: string[]
  archived?: boolean
}

export interface ArticleWithSlug extends Article {
  slug: string
}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(`../app/blog/${articleFilename}`)) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

async function getAllArticlesIncludingArchived() {
  const blogDir = path.join(process.cwd(), 'src/app/blog')
  const articleFilenames = await glob('*/page.mdx', { cwd: blogDir })
  const articles = await Promise.all(articleFilenames.map(importArticle))
  return articles.sort((a, z) => {
    let dateOrder = +new Date(z.date) - +new Date(a.date)
    if (dateOrder !== 0) return dateOrder

    // order series reverse chronologically (higher part numbers first)
    if (
      a.series &&
      z.series &&
      a.series.slug === z.series.slug
    ) {
      return z.series.part - a.series.part
    }

    return a.slug.localeCompare(z.slug)
  })
}

export async function getAllArticles() {
  const articles = await getAllArticlesIncludingArchived()
  return articles.filter((article) => !article.archived)
}

export async function getArchivedArticles() {
  const articles = await getAllArticlesIncludingArchived()
  return articles.filter((article) => article.archived)
}

// export async function getAllArticles() {
//   let articleFilenames = await glob('*/page.mdx', {
//     cwd: './src/app/blog',
//   })

//   let articles = await Promise.all(articleFilenames.map(importArticle))

//   return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
// }
