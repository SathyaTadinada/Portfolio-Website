import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rewriting the cosmOS kernel in Rust',
  description:
    'When we released the first version of cosmOS last year, it was written in Go. Go is a wonderful programming language, but it’s been a while since I’ve seen an article on the front page of Hacker News about rewriting some important tool in Go and I see articles on there about rewriting things in Rust every single week.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
