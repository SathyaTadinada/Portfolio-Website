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

export const articleSeries = [
  {
    slug: 'cs-3100',
    title: 'CS 3100: Theory of Computation',
    posts: [
      {
        part: 1,
        title: 'Regular Languages',
        href: '/blog/cs-3100-regular-languages',
      },
      {
        part: 2,
        title: 'Context-Free Languages and Pushdown Automata',
        href: '/blog/cs-3100-context-free-languages',
      },
      {
        part: 3,
        title: 'Turing Machines and Decidability',
        href: '/blog/cs-3100-turing-machines',
      },
    ],
  },
  {
    slug: 'regex-toolkit',
    title: 'Regex Toolkit',
    posts: [
      {
        part: 1,
        title: 'Pattern Basics',
        href: '/blog/series-sample-regex-basics',
      },
      {
        part: 2,
        title: 'Debugging Patterns',
        href: '/blog/series-sample-regex-debugging',
      },
    ],
  },
] satisfies ArticleSeries[]

export function getArticleSeries(slug?: string) {
  if (!slug) return undefined

  return articleSeries.find((series) => series.slug === slug)
}

export function getArticleSeriesPost(series: ArticleSeries, part?: number) {
  return series.posts.find((post) => post.part === part)
}
