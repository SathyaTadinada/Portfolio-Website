import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}
export const dynamic = 'force-static'

export default async function BlogPage() {
  const articles = await getAllArticles()
  return <BlogClient articles={articles} />
}