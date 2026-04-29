'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/lib/formatDate'
import type { ArticleWithSlug } from '@/lib/articles'
import { getArticleSeries } from '@/lib/series'

interface YearLink {
  year: string
  count: number
}

const YEAR_ACTIVE_OFFSET = 112
const YEAR_SCROLL_OFFSET = 88
const YEAR_ACTIVATION_TOLERANCE = 2

function normalizeTags(input?: string | null) {
  if (!input) return []
  return input.split(',').filter(Boolean).map(decodeURIComponent)
}

function getArticleYear(article: ArticleWithSlug) {
  return article.date.slice(0, 4)
}

function getYearId(year: string) {
  return `posts-${year}`
}

function groupArticlesByYear(articles: ArticleWithSlug[]) {
  let groups = new Map<string, ArticleWithSlug[]>()

  for (let article of articles) {
    let year = getArticleYear(article)
    groups.set(year, [...(groups.get(year) ?? []), article])
  }

  return Array.from(groups, ([year, groupedArticles]) => ({
    year,
    articles: groupedArticles,
  }))
}

function getYearLinks(articles: ArticleWithSlug[]) {
  let counts = new Map<string, number>()

  for (let article of articles) {
    let year = getArticleYear(article)
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }

  return Array.from(counts, ([year, count]) => ({ year, count })).sort(
    (a, z) => Number(z.year) - Number(a.year),
  )
}

function hrefFor(tag: string, selected: string[]) {
  const next = selected.includes(tag)
    ? selected.filter((t) => t !== tag)
    : [...selected, tag]
  if (next.length === 0) return '/blog'
  return `/blog?tags=${next.map(encodeURIComponent).join(',')}`
}

function TagChip({ tag, selected }: { tag: string; selected: string[] }) {
  const isActive = tag !== 'All' && selected.includes(tag)
  const href = tag === 'All' ? '/blog' : hrefFor(tag, selected)

  return (
    <Link
      href={href}
      prefetch={false}
      rel="nofollow"
      className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-zinc-300 transition dark:ring-zinc-700 ${
        isActive
          ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {tag}
    </Link>
  )
}

function Article({ article: post }: { article: ArticleWithSlug }) {
  let series = getArticleSeries(post.series?.slug)

  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${post.slug}`}>{post.title}</Card.Title>
        {series && post.series && (
          <p className="relative z-10 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {series.title} · Part {post.series.part}
          </p>
        )}
        <Card.Eyebrow
          as="time"
          dateTime={post.date}
          className="md:hidden"
          decorate
        >
          {formatDate(post.date)}
        </Card.Eyebrow>
        <Card.Description>{post.description}</Card.Description>

        {!!post.tags?.length && (
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {post.tags
              .slice()
              .sort()
              .map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700/40 dark:text-zinc-300"
                >
                  {t}
                </span>
              ))}
          </div>
        )}

        <Card.Cta>Read post</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={post.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(post.date)}
      </Card.Eyebrow>
    </article>
  )
}

function EmptyPostsMessage({
  selected,
  hasArchivedArticles,
}: {
  selected: string[]
  hasArchivedArticles: boolean
}) {
  if (selected.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        {hasArchivedArticles
          ? 'No current posts are available. Archived posts are below.'
          : 'No posts are available yet.'}
      </p>
    )
  }

  return (
    <p className="text-zinc-500 dark:text-zinc-400">
      No posts match{' '}
      {[...selected]
        .sort((a, b) => a.localeCompare(b))
        .map((s) => `"${s}"`)
        .join(', ')}
      .
    </p>
  )
}

function BlogYearNavigation({
  years,
  activeYear,
  onNavigate,
}: {
  years: YearLink[]
  activeYear: string
  onNavigate: (year: string) => void
}) {
  if (years.length === 0) return null

  return (
    <nav
      aria-label="Blog posts by year"
      className="sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto border-l border-zinc-200 pl-6 dark:border-zinc-800"
    >
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
        By year
      </h2>
      <ol className="space-y-1">
        {years.map(({ year, count }) => {
          let isActive = year === activeYear

          return (
            <li key={year}>
              <a
                href={`#${getYearId(year)}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(year)
                }}
                className={`flex items-baseline justify-between gap-3 rounded-md py-1.5 pr-2 text-sm leading-5 transition-colors ${
                  isActive
                    ? 'font-medium text-blue-500 dark:text-blue-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200'
                }`}
              >
                <span>{year}</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-600">
                  {count}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default function BlogClient({
  articles,
  archivedArticles = [],
}: {
  articles: ArticleWithSlug[]
  archivedArticles?: ArticleWithSlug[]
}) {
  const sp = useSearchParams()
  const selected = useMemo(() => normalizeTags(sp.get('tags')), [sp])
  const [activeYear, setActiveYear] = useState('')

  const allTags = useMemo(
    () => Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).sort(),
    [articles],
  )

  const visible = useMemo(() => {
    if (selected.length === 0) return articles
    return articles.filter((a) => selected.every((t) => a.tags?.includes(t)))
  }, [articles, selected])

  const visibleYearGroups = useMemo(
    () => groupArticlesByYear(visible),
    [visible],
  )
  const archivedYearGroups = useMemo(
    () => groupArticlesByYear(archivedArticles),
    [archivedArticles],
  )
  const yearLinks = useMemo(() => getYearLinks(visible), [visible])

  useEffect(() => {
    if (yearLinks.length === 0) {
      setActiveYear('')
      return
    }

    let frame: number | null = null

    let updateActiveYear = () => {
      let targets = Array.from(
        document.querySelectorAll<HTMLElement>('[data-blog-year-target]'),
      ).filter((target) => target.offsetParent !== null)

      if (targets.length === 0) {
        setActiveYear(yearLinks[0].year)
        return
      }

      let scrollPosition =
        window.scrollY + YEAR_ACTIVE_OFFSET + YEAR_ACTIVATION_TOLERANCE
      let nextActiveYear = targets[0].dataset.blogYear ?? yearLinks[0].year

      for (let target of targets) {
        if (
          target.getBoundingClientRect().top + window.scrollY <=
          scrollPosition
        ) {
          nextActiveYear = target.dataset.blogYear ?? nextActiveYear
        } else {
          break
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        nextActiveYear =
          targets[targets.length - 1]?.dataset.blogYear ?? nextActiveYear
      }

      setActiveYear((currentActiveYear) =>
        currentActiveYear === nextActiveYear
          ? currentActiveYear
          : nextActiveYear,
      )
    }

    let scheduleUpdate = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        updateActiveYear()
      })
    }

    updateActiveYear()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)

      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [yearLinks])

  let scrollToYear = (year: string) => {
    let id = getYearId(year)
    let prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let target = document.getElementById(id)
    if (!target) return

    window.history.pushState(null, '', `#${id}`)
    setActiveYear(year)
    window.scrollTo({
      top: Math.max(
        0,
        target.getBoundingClientRect().top +
          window.scrollY -
          YEAR_SCROLL_OFFSET,
      ),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <SimpleLayout
      title="Writing on technology, life, and more."
      intro="All of my thoughts on tech news, programming, life events, announcements, and other things, collected in chronological order."
      gapClass="mt-12 sm:mt-8"
    >
      <div
        className={`mx-auto grid grid-cols-1 gap-y-12 xl:justify-center ${
          yearLinks.length > 0
            ? 'max-w-5xl xl:grid-cols-[minmax(0,48rem)_12rem] xl:gap-x-12'
            : 'max-w-3xl'
        }`}
      >
        <div className="min-w-0">
          {allTags.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <TagChip tag="All" selected={selected} />
              {allTags.map((t) => (
                <TagChip key={t} tag={t} selected={selected} />
              ))}
            </div>
          )}

          <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
            <div className="flex max-w-3xl flex-col space-y-12 sm:space-y-16">
              {visibleYearGroups.map((group) => (
                <div
                  key={group.year}
                  id={getYearId(group.year)}
                  data-blog-year={group.year}
                  data-blog-year-target
                  className="scroll-mt-28"
                >
                  <div className="flex flex-col space-y-12 sm:space-y-16">
                    {group.articles.map((article) => (
                      <Article key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              ))}

              {visible.length === 0 && (
                <EmptyPostsMessage
                  selected={selected}
                  hasArchivedArticles={archivedArticles.length > 0}
                />
              )}
            </div>
          </div>

          {archivedArticles.length > 0 && (
            <details className="group/archived mt-16 sm:mt-20">
              <summary className="flex cursor-pointer list-none items-center gap-2 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium text-zinc-400 transition group-hover/archived:text-zinc-600 dark:text-zinc-500 dark:group-hover/archived:text-zinc-300">
                  Archived ({archivedArticles.length})
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform group-open/archived:rotate-180 dark:text-zinc-500" />
              </summary>
              <div className="mt-10 md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
                <div className="flex max-w-3xl flex-col space-y-12 opacity-60 sm:space-y-16">
                  {archivedYearGroups.map((group) => (
                    <div key={group.year}>
                      <div className="flex flex-col space-y-12 sm:space-y-16">
                        {group.articles.map((article) => (
                          <Article key={article.slug} article={article} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          )}
        </div>

        {yearLinks.length > 0 && (
          <aside className="hidden xl:block">
            <BlogYearNavigation
              years={yearLinks}
              activeYear={activeYear}
              onNavigate={scrollToYear}
            />
          </aside>
        )}
      </div>
    </SimpleLayout>
  )
}
