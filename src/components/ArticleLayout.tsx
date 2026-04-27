'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { ArrowLeft, ArrowUp } from 'lucide-react'

import { AppContext } from '@/app/providers'
import { Comments } from '@/components/Comments'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { TableOfContents } from '@/components/TableOfContents'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

const articleIconButtonClassName =
  'group flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition hover:shadow-lg dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20'

function getScrollButtonInset() {
  return window.matchMedia('(min-width: 640px)').matches ? 32 : 16
}

function ScrollToTopButton({ className }: { className?: string }) {
  let [isVisible, setIsVisible] = useState(false)
  let [bottomOffset, setBottomOffset] = useState(16)

  useEffect(() => {
    let frame: number | null = null

    let updateButtonPosition = () => {
      let inset = getScrollButtonInset()
      let footerTop =
        document.querySelector('footer')?.getBoundingClientRect().top ??
        Infinity
      let nextBottomOffset = Math.max(
        inset,
        window.innerHeight - footerTop + inset,
      )

      setIsVisible(window.scrollY > 240)
      setBottomOffset((currentBottomOffset) =>
        currentBottomOffset === nextBottomOffset
          ? currentBottomOffset
          : nextBottomOffset,
      )
    }

    let scheduleUpdate = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        updateButtonPosition()
      })
    }

    updateButtonPosition()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)

      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      title="Scroll back to top"
      disabled={!isVisible}
      onClick={() => {
        let prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches

        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search,
        )
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        })
      }}
      className={clsx(
        articleIconButtonClassName,
        'duration-200',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
      style={{ bottom: `${bottomOffset}px` }}
    >
      <ArrowUp className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
    </button>
  )
}

export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-10 xl:grid-cols-[minmax(0,42rem)_14rem] xl:justify-center xl:gap-x-12">
        <div className="relative mx-auto w-full max-w-2xl min-w-0 xl:mx-0">
          {previousPathname && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back to blogs"
              className={clsx(
                articleIconButtonClassName,
                'mb-8 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:-left-14 xl:mt-0',
              )}
            >
              <ArrowLeft className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
            </button>
          )}
          <article>
            <header className="flex flex-col">
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                {article.title}
              </h1>
              <time
                dateTime={article.date}
                className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.date)}</span>
              </time>
            </header>
            <TableOfContents className="mt-8 xl:hidden" variant="mobile" />
            <Prose data-article-content>{children}</Prose>
          </article>
          <Comments />
        </div>

        <aside className="hidden xl:block">
          <TableOfContents className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-3" />
        </aside>
      </div>
      <ScrollToTopButton className="fixed right-4 z-40 sm:right-8 xl:right-[max(2rem,calc((100vw-80rem)/2+4rem))]" />
    </Container>
  )
}
