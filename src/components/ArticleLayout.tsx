'use client'

import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Archive, ArrowLeft, ArrowUp } from 'lucide-react'

import { AppContext } from '@/app/providers'
import { Comments } from '@/components/Comments'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { TableOfContents } from '@/components/TableOfContents'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { getArticleSeries, getArticleSeriesPost } from '@/lib/series'

const articleIconButtonClassName =
  'group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition hover:shadow-lg dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20'

function getScrollButtonInset() {
  return 32
}

function ScrollToTopButton({ className }: { className?: string }) {
  let [hasMounted, setHasMounted] = useState(false)
  let [isVisible, setIsVisible] = useState(false)
  let [bottomOffset, setBottomOffset] = useState(32)

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

    setHasMounted(true)
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

  if (!hasMounted) return null

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

function ArchivedArticleNotice() {
  return (
    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex gap-3">
        <Archive className="mt-0.5 h-4 w-4 flex-none text-amber-600 dark:text-amber-300" />
        <div>
          <p className="font-medium">Archived post</p>
          <p className="mt-1 text-amber-900/80 dark:text-amber-100/75">
            This post is preserved for reference and may reflect older writing,
            APIs, or project details.
          </p>
        </div>
      </div>
    </div>
  )
}

function ArticleTags({ tags }: { tags?: string[] }) {
  if (!tags?.length) return null

  return (
    <div className="mt-5 flex flex-wrap gap-2" aria-label="Article tags">
      {tags
        .slice()
        .sort((a, b) => a.localeCompare(b))
        .map((tag) => (
          <Link
            key={tag}
            href={`/blog?tags=${encodeURIComponent(tag)}`}
            className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            {tag}
          </Link>
        ))}
    </div>
  )
}

function ArticleSeriesNavigation({ article }: { article: ArticleWithSlug }) {
  let series = getArticleSeries(article.series?.slug)
  if (!series || !article.series) return null

  let currentPost = getArticleSeriesPost(series, article.series.part)
  let currentIndex = series.posts.findIndex(
    (post) => post.part === article.series?.part,
  )
  let previousPost = currentIndex > 0 ? series.posts[currentIndex - 1] : null
  let nextPost =
    currentIndex >= 0 && currentIndex < series.posts.length - 1
      ? series.posts[currentIndex + 1]
      : null

  return (
    <section className="mt-8 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700/60">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
            Series
          </p>
          <h2 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {series.title}
          </h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Part {article.series.part} of {series.posts.length}
        </p>
      </div>

      <ol className="mt-4 space-y-2">
        {series.posts.map((post) => {
          let isCurrent = post.part === article.series?.part

          return (
            <li key={post.href} className="flex gap-3 text-sm">
              <span
                className={clsx(
                  'mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-medium',
                  isCurrent
                    ? 'bg-blue-500 text-white dark:bg-blue-400 dark:text-zinc-950'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
                )}
              >
                {post.part}
              </span>
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="font-medium text-zinc-900 dark:text-zinc-100"
                >
                  {post.title}
                </span>
              ) : (
                <Link
                  href={post.href}
                  className="text-zinc-600 transition hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400"
                >
                  {post.title}
                </Link>
              )}
            </li>
          )
        })}
      </ol>

      {(previousPost || nextPost) && (
        <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 text-sm sm:flex-row sm:justify-between dark:border-zinc-800">
          {previousPost ? (
            <Link
              href={previousPost.href}
              className="font-medium text-blue-500 transition hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Previous: {previousPost.title}
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link
              href={nextPost.href}
              className="font-medium text-blue-500 transition hover:text-blue-600 sm:text-right dark:text-blue-400 dark:hover:text-blue-300"
            >
              Next: {nextPost.title}
            </Link>
          )}
        </div>
      )}

      {!currentPost && (
        <p className="mt-4 text-sm text-amber-600 dark:text-amber-300">
          This post references a series part that is not listed in the series
          registry.
        </p>
      )}
    </section>
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
                'mb-8 xl:absolute xl:-top-1.5 xl:-left-14 xl:mt-0 xl:mb-0',
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
              <ArticleTags tags={article.tags} />
              <time
                dateTime={article.date}
                className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
              >
                <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                <span className="ml-3">{formatDate(article.date)}</span>
                {article.readingMinutes && (
                  <>
                    <span
                      className="mx-3 text-zinc-300 dark:text-zinc-600"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                    <span>{article.readingMinutes} min read</span>
                  </>
                )}
              </time>
            </header>
            {article.archived && <ArchivedArticleNotice />}
            <ArticleSeriesNavigation article={article} />
            <TableOfContents className="mt-8 xl:hidden" variant="mobile" />
            <Prose data-article-content>{children}</Prose>
          </article>
          {!article.archived && <Comments />}
        </div>

        <aside className="hidden xl:block">
          <TableOfContents className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-3" />
        </aside>
      </div>
      <ScrollToTopButton className="fixed right-8 z-40 sm:right-16 lg:right-24 xl:right-[calc((100vw-76rem)/2+2rem)]" />
    </Container>
  )
}
