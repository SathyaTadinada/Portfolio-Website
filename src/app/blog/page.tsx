import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles, ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
}

function normalizeTags(input?: string) {
  if (!input) return []
  return input
    .split(',')
    .filter(Boolean)
    .map(decodeURIComponent)
}

function hrefFor(tag: string, selected: string[]) {
  const next = selected.includes(tag)
    ? selected.filter((t) => t !== tag)
    : [...selected, tag]

  if (next.length === 0) return '/blog'     // "all" = clear filter

  const csv = next.map(encodeURIComponent).join(',')
  return `/blog?tags=${csv}`
}

function TagChip({
  tag,
  selected,
}: {
  tag: string
  selected: string[]
}) {
  const isActive = tag !== 'All' && selected.includes(tag)
  const href = tag === 'All' ? '/blog' : hrefFor(tag, selected)

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-zinc-300 dark:ring-zinc-700 transition
        ${isActive
          ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'}`}
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

        {post.tags?.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice().sort().map((t) => (
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

export default async function ArticlesIndex({
  searchParams,
}: {
  searchParams: { tags?: string }
}) {
  const selected = normalizeTags(searchParams.tags)

  const articles = await getAllArticles()

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags ?? []))).sort()

  // keep only posts that contain all selected tags
  const visible =
    selected.length === 0
      ? articles
      : articles.filter((a) => selected.every((t) => a.tags?.includes(t)))

  return (
    <SimpleLayout
      title="Writing on technology, life, and more."
      intro="All of my thoughts on tech news, programming, life events, announcements, and other things, collected in chronological order."
      gapClass="mt-12 sm:mt-8"
    >
      {/* filter bar */}
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
          {visible.map((article) => (
            <Article key={article.slug} article={article} />
          ))}

          {visible.length === 0 && (
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts match {selected.map((s) => `"${s}"`).join(', ')}.
            </p>
          )}
        </div>
      </div>
    </SimpleLayout>
  )
}
