'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
  indent: number
}

interface HeadingPosition {
  id: string
  top: number
}

type TableOfContentsVariant = 'desktop' | 'mobile'

const CONTENT_SELECTOR = '[data-article-content]'
const HEADING_SELECTOR = `${CONTENT_SELECTOR} h1, ${CONTENT_SELECTOR} h2, ${CONTENT_SELECTOR} h3, ${CONTENT_SELECTOR} h4, ${CONTENT_SELECTOR} h5, ${CONTENT_SELECTOR} h6`
const ACTIVE_HEADING_OFFSET = 112
const HEADING_SCROLL_OFFSET = 88
const ACTIVATION_TOLERANCE = 2

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getUniqueId(base: string, usedIds: Map<string, number>) {
  let count = usedIds.get(base) ?? 0
  usedIds.set(base, count + 1)

  return count === 0 ? base : `${base}-${count + 1}`
}

function getHeadingText(element: HTMLElement) {
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim()
}

function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth') {
  let target = document.getElementById(id)
  if (!target) return

  let prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  window.scrollTo({
    top: Math.max(
      0,
      target.getBoundingClientRect().top +
        window.scrollY -
        HEADING_SCROLL_OFFSET,
    ),
    behavior: prefersReducedMotion ? 'auto' : behavior,
  })
}

function TocLinks({
  headings,
  activeId,
  variant,
  onNavigate,
}: {
  headings: Heading[]
  activeId: string
  variant: TableOfContentsVariant
  onNavigate: (id: string) => void
}) {
  return (
    <ol className={clsx(variant === 'desktop' ? 'space-y-1' : 'space-y-0.5')}>
      {headings.map((heading) => {
        let isActive = heading.id === activeId

        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault()
                onNavigate(heading.id)
              }}
              className={clsx(
                'block rounded-md py-1.5 pr-2 text-sm leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900',
                isActive
                  ? 'font-medium text-blue-500 dark:text-blue-400'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200',
                variant === 'mobile' && 'py-2',
              )}
              style={{ paddingLeft: `${heading.indent * 0.75}rem` }}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

export function TableOfContents({
  className,
  variant = 'desktop',
}: {
  className?: string
  variant?: TableOfContentsVariant
}) {
  let [headings, setHeadings] = useState<Heading[]>([])
  let [activeId, setActiveId] = useState('')
  let navRef = useRef<HTMLElement>(null)
  let handledInitialHash = useRef(false)

  useEffect(() => {
    let headingElements = Array.from(
      document.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
    ).filter((element) => getHeadingText(element).length > 0)

    if (headingElements.length === 0) {
      setHeadings([])
      setActiveId('')
      return
    }

    let usedIds = new Map<string, number>()
    let extractedHeadings = headingElements.map((element, index) => {
      let text = getHeadingText(element)
      let level = Number(element.tagName.slice(1))
      let baseId = slugify(element.id || text) || `section-${index + 1}`
      let id = getUniqueId(baseId, usedIds)

      if (element.id !== id) {
        element.id = id
      }

      return { id, text, level }
    })

    let minLevel = Math.min(
      ...extractedHeadings.map((heading) => heading.level),
    )
    let tocHeadings = extractedHeadings.map((heading) => ({
      ...heading,
      indent: Math.max(0, heading.level - minLevel),
    }))

    setHeadings(tocHeadings)

    let headingPositions: HeadingPosition[] = []

    let updatePositions = () => {
      headingPositions = headingElements.map((element) => ({
        id: element.id,
        top: element.getBoundingClientRect().top + window.scrollY,
      }))
    }

    let updateActiveHeading = () => {
      let scrollPosition =
        window.scrollY + ACTIVE_HEADING_OFFSET + ACTIVATION_TOLERANCE
      let nextActiveId = ''

      for (let position of headingPositions) {
        if (position.top <= scrollPosition) {
          nextActiveId = position.id
        } else {
          break
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        nextActiveId = headingPositions[headingPositions.length - 1]?.id ?? ''
      }

      setActiveId((currentActiveId) =>
        currentActiveId === nextActiveId ? currentActiveId : nextActiveId,
      )
    }

    let frame: number | null = null
    let scheduleUpdate = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        updateActiveHeading()
      })
    }

    let recalculate = () => {
      updatePositions()
      updateActiveHeading()
    }

    let content = document.querySelector<HTMLElement>(CONTENT_SELECTOR)
    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== 'undefined' && content) {
      resizeObserver = new ResizeObserver(recalculate)
      resizeObserver.observe(content)
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', recalculate)
    window.addEventListener('load', recalculate)

    recalculate()

    if (!handledInitialHash.current && window.location.hash) {
      handledInitialHash.current = true
      let hash = decodeURIComponent(window.location.hash.slice(1))

      window.requestAnimationFrame(() => {
        scrollToHeading(hash, 'auto')
        recalculate()
      })
    }

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', recalculate)
      window.removeEventListener('load', recalculate)

      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  useEffect(() => {
    if (!activeId || !navRef.current) return

    let activeLink = navRef.current.querySelector<HTMLAnchorElement>(
      `a[href="#${activeId}"]`,
    )

    activeLink?.scrollIntoView({ block: 'nearest' })
  }, [activeId])

  if (headings.length === 0) return null

  let handleNavigate = (id: string) => {
    window.history.pushState(null, '', `#${id}`)
    setActiveId(id)
    scrollToHeading(id)
  }

  if (variant === 'mobile') {
    return (
      <nav ref={navRef} aria-label="Table of contents" className={className}>
        <details className="group rounded-lg border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-zinc-900 marker:hidden dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
            <span>On this page</span>
            <ChevronDown className="h-4 w-4 text-zinc-400 transition group-open:rotate-180 dark:text-zinc-500" />
          </summary>
          <div className="max-h-72 overflow-y-auto border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
            <TocLinks
              headings={headings}
              activeId={activeId}
              variant="mobile"
              onNavigate={handleNavigate}
            />
          </div>
        </details>
      </nav>
    )
  }

  return (
    <nav
      ref={navRef}
      aria-label="Table of contents"
      className={clsx(
        'border-l border-zinc-200 pl-6 dark:border-zinc-800',
        className,
      )}
    >
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
        On this page
      </h2>
      <TocLinks
        headings={headings}
        activeId={activeId}
        variant="desktop"
        onNavigate={handleNavigate}
      />
    </nav>
  )
}
