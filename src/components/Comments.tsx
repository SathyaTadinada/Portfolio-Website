'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Comments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
            repoId="R_kgDOLbK7qA"
            category="General"
            categoryId="DIC_kwDOLbK7qM4C7xTb"
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
