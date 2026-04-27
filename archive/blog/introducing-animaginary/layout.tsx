import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Introducing Animaginary: High performance web animations',
  description:
    'When you’re building a website for a company as ambitious as Planetaria, you need to make an impression. I wanted people to visit our website and see animations that looked more realistic than reality itself.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
