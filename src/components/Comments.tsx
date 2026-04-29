'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const productionSiteUrl = 'https://tadinada.com'
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

function isLocalSiteUrl(url: string) {
  try {
    let hostname = new URL(url).hostname
    return (
      hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
    )
  } catch {
    return true
  }
}

const publicSiteUrl =
  configuredSiteUrl && !isLocalSiteUrl(configuredSiteUrl)
    ? configuredSiteUrl
    : productionSiteUrl

export function Comments() {
  const pathname = usePathname()
  const canonicalUrl = `${publicSiteUrl}${pathname}`
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let backlinkMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="giscus:backlink"]',
    )

    if (!backlinkMeta) {
      backlinkMeta = document.createElement('meta')
      backlinkMeta.name = 'giscus:backlink'
      document.head.append(backlinkMeta)
    }

    backlinkMeta.content = canonicalUrl
    setMounted(true)
  }, [canonicalUrl])

  return (
    <section
      aria-labelledby="comments"
      className="mt-16 border-t border-zinc-100 pt-10 dark:border-zinc-700/40"
    >
      <h2
        id="comments"
        data-toc-heading
        className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100"
      >
        Comments
      </h2>
      <div className="mt-6">
        {mounted && (
          <Giscus
            repo="SathyaTadinada/Portfolio-Website"
            repoId="R_kgDOSPiEHw"
            category="General"
            categoryId="DIC_kwDOSPiEH84C78Ji"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={
              resolvedTheme === 'dark' ? 'catppuccin_mocha' : 'catppuccin_latte'
            }
            lang="en"
            loading="lazy"
          />
        )}
      </div>
    </section>
  )
}
