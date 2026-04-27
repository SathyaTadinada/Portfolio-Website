import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FreezeTag: An Open-Source, Self-Hosted Image Management App',
  description:
    "FreezeTag is a free, open-source, self-hosted image management platform I built as my undergraduate capstone. Here's what it is, how it works, and what I learned building it.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
