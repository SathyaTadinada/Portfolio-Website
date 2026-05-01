import glob from 'fast-glob'
import path from 'path'

import { type ArticleSeriesRef } from '@/lib/series'

export type ArticleReferenceType = 'online' | 'paper' | 'book' | 'video' | 'talk'

/**
 * A single entry in a post's references section.
 *
 * To add references to a post:
 *   1. Create a `references.json` file in the post's folder.
 *   2. Add `import refs from './references.json'` at the top of `page.mdx`.
 *   3. Add `references: refs` to the `article` export object.
 *
 * Only `title` is required. `type` controls the badge color and icon:
 *   - 'online'  rose    Globe
 *   - 'paper'   blue    FileText
 *   - 'book'    violet  BookOpen
 *   - 'video'   amber   Video
 *   - 'talk'    emerald Mic2
 *   Entries without a type get a plain zinc badge and no icon.
 *
 * @example
 * [
 *   {
 *     "title": "Attention Is All You Need",
 *     "type": "paper",
 *     "authors": "Vaswani et al.",
 *     "year": 2017,
 *     "publisher": "NeurIPS",
 *     "url": "https://arxiv.org/abs/1706.03762"
 *   },
 *   {
 *     "title": "The Pragmatic Programmer",
 *     "type": "book",
 *     "authors": "Hunt & Thomas",
 *     "year": 2019,
 *     "publisher": "Addison-Wesley"
 *   }
 * ]
 */
export interface ArticleReference {
  title: string
  type?: ArticleReferenceType
  url?: string
  authors?: string
  year?: number | string
  publisher?: string
}

export interface Article {
  title: string
  description: string
  author: string
  date: string
  readingMinutes?: number
  series?: ArticleSeriesRef
  tags?: string[]
  archived?: boolean
  references?: ArticleReference[]
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
