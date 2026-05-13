import { createArticleMetadata } from '@/lib/articleMetadata'

export const metadata = createArticleMetadata({
  title: 'Regex Demystified: Intro to Pattern Matching',
  description:
    'Regular expressions (regex) are a powerful tool for pattern matching and text manipulation. In this article, we will explore the fundamentals of regex, its syntax, and practical applications.',
  slug: 'regex-101',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
