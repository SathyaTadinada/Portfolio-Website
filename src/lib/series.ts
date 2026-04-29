export interface ArticleSeriesRef {
  slug: string
  part: number
}

export interface ArticleSeriesPost {
  part: number
  title: string
  href: string
}

export interface ArticleSeries {
  slug: string
  title: string
  posts: ArticleSeriesPost[]
}

// To add a series, append an entry here and set `series: { slug, part }` in
// each post's `article` export. Parts are 1-indexed.

// Example:
// {
//   slug: 'series-identifier',
//   title: 'My Series Title',
//   posts: [
//     { part: 1, title: 'Part One Title', href: '/blog/my-series-part-1' },
//     { part: 2, title: 'Part Two Title', href: '/blog/my-series-part-2' },
//   ],
// },

// In the blog/ directory, you would have:
// my-series-part-1/page.mdx:
// export const article = {
//   ...,
//   series: { slug: 'series-identifier', part: 1 },
// }

// my-series-part-2/page.mdx
// export const article = {
//   ...,
//   series: { slug: 'series-identifier', part: 2 },
// }
export const articleSeries: ArticleSeries[] = []

export function getArticleSeries(slug?: string) {
  if (!slug) return undefined

  return articleSeries.find((series) => series.slug === slug)
}

export function getArticleSeriesPost(series: ArticleSeries, part?: number) {
  return series.posts.find((post) => post.part === part)
}
