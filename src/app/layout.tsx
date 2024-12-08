import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Monitoring } from 'react-scan/dist/core/monitor/params/next'

<Monitoring apiKey="3KW-3l-29aa7t-1zIFd0zye_xrv1V_N8" url="https://monitoring.react-scan.com/api/v1/ingest" />

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Sathya Tadinada',
    default:
      'Sathya Tadinada: Personal Portfolio',
  },
  description:
    'I’m Sathya Tadinada, a software developer and college student based in Salt Lake City. I’m excited to grow my skills in the tech field and make a positive impact through my work.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <meta name='theme-color'></meta>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
