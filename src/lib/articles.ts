import glob from 'fast-glob'
import path from 'path'

interface Article {
  title: string
  description: string
  author: string
  date: string
  tags?: string[]
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

export async function getAllArticles() {
  const blogDir = path.join(process.cwd(), 'src/app/blog');

  const articleFilenames = await glob('*/page.mdx', { cwd: blogDir });

  const articles = await Promise.all(articleFilenames.map(importArticle));

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}

// export async function getAllArticles() {
//   let articleFilenames = await glob('*/page.mdx', {
//     cwd: './src/app/blog',
//   })

//   let articles = await Promise.all(articleFilenames.map(importArticle))

//   return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
// }
