'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/lib/formatDate'
import type { ArticleWithSlug } from '@/lib/articles'

function normalizeTags(input?: string | null) {
  if (!input) return []
  return input.split(',').filter(Boolean).map(decodeURIComponent)
}

function hrefFor(tag: string, selected: string[]) {
  const next = selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
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
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${post.slug}`}>{post.title}</Card.Title>
        <Card.Eyebrow as="time" dateTime={post.date} className="md:hidden" decorate>
          {formatDate(post.date)}
        </Card.Eyebrow>
        <Card.Description>{post.description}</Card.Description>

        {!!post.tags?.length && (
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {post.tags.slice().sort().map(t => (
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
      <Card.Eyebrow as="time" dateTime={post.date} className="mt-1 hidden md:block">
        {formatDate(post.date)}
      </Card.Eyebrow>
    </article>
  )
}

export default function BlogClient({ articles }: { articles: ArticleWithSlug[] }) {
  const sp = useSearchParams()
  const selected = useMemo(() => normalizeTags(sp.get('tags')), [sp])

  const allTags = useMemo(
    () => Array.from(new Set(articles.flatMap(a => a.tags ?? []))).sort(),
    [articles],
  )

  const visible = useMemo(() => {
    if (selected.length === 0) return articles
    return articles.filter(a => selected.every(t => a.tags?.includes(t)))
  }, [articles, selected])

  return (
    <SimpleLayout
      title="Writing on technology, life, and more."
      intro="All of my thoughts on tech news, programming, life events, announcements, and other things, collected in chronological order."
      gapClass="mt-12 sm:mt-8"
    >
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <TagChip tag="All" selected={selected} />
          {allTags.map(t => (
            <TagChip key={t} tag={t} selected={selected} />
          ))}
        </div>
      )}

      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-12 sm:space-y-16">
          {visible.map(article => (
            <Article key={article.slug} article={article} />
          ))}

          {visible.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts match{' '}
              {[...selected]
                .sort((a, b) => a.localeCompare(b))
                .map(s => `"${s}"`)
                .join(', ')}
              .
            </p>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}
