import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Timestamps Are Hard: Unix Time, Time Zones, and UI Bugs',
  description:
    'Dates look simple until you ship them. This post covers the most common timestamp bugs (seconds vs ms, UTC vs local time), and a small set of patterns that keep your UI correct and consistent.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
