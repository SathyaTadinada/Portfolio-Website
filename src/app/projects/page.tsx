import { type Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

import logoAnimaginary from '@/images/logos/animaginary.svg'
import logoCosmos from '@/images/logos/cosmos.svg'
import logoHelioStream from '@/images/logos/helio-stream.svg'
import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'

/* -------------------------------------------------------------------------- */
/*  Project data                                                              */
/* -------------------------------------------------------------------------- */

type Project = {
  name: string
  description: string
  link: { href: string; label: string }
  logo: any
  tags: string[]
}

const projects: Project[] = [
  {
    name: 'Portfolio Website',
    description:
      'The source code for this website, built with Next.js and Tailwind CSS.',
    link: {
      href: 'https://github.com/SathyaTadinada/Portfolio-Website',
      label: 'github.com',
    },
    logo: logoPlanetaria,
    tags: ['TypeScript', 'Next.js', 'Tailwind', 'Vercel'],
  },
  {
    name: 'Animaginary',
    description:
      'High performance web animation library, hand-written in optimized WASM.',
    link: { href: '#', label: 'github.com' },
    logo: logoAnimaginary,
    tags: ['Rust', 'WASM', 'Animation'],
  },
  {
    name: 'HelioStream',
    description:
      'Real-time video streaming library, optimized for interstellar transmission.',
    link: { href: '#', label: 'github.com' },
    logo: logoHelioStream,
    tags: ['Go', 'Streaming', 'WebRTC', 'C'],
  },
  {
    name: 'cosmOS',
    description: 'The operating system that powers our Planetaria space shuttles.',
    link: { href: '#', label: 'github.com' },
    logo: logoCosmos,
    tags: ['C', 'Kernel', 'Embedded'],
  },
  {
    name: 'OpenShuttle',
    description:
      'The schematics for the first rocket I designed that successfully made it to orbit.',
    link: { href: '#', label: 'github.com' },
    logo: logoOpenShuttle,
    tags: ['CAD', 'Aerospace'],
  },
]

/* -------------------------------------------------------------------------- */
/*  Tag-filter helpers                                                        */
/* -------------------------------------------------------------------------- */

function normalizeTags(input?: string) {
  if (!input) return []
  return input.split(',').filter(Boolean).map(decodeURIComponent)
}

function hrefFor(tag: string, selected: string[]) {
  const next = selected.includes(tag)
    ? selected.filter(t => t !== tag)
    : [...selected, tag]

  if (next.length === 0) return '/projects'
  return `/projects?tags=${next.map(encodeURIComponent).join(',')}`
}

function TagChip({ tag, selected }: { tag: string; selected: string[] }) {
  const isActive = tag !== 'All' && selected.includes(tag)
  const href = tag === 'All' ? '/projects' : hrefFor(tag, selected)

  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-zinc-300 dark:ring-zinc-700 transition
        ${
          isActive
            ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700'
        }`}
    >
      {tag}
    </Link>
  )
}

/* Icon for the external-link footer */
function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page metadata                                                              */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
}

/* -------------------------------------------------------------------------- */
/*  Page component                                                             */
/* -------------------------------------------------------------------------- */

export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>
}) {
  /* current filter → chips & project list */
  const selected = normalizeTags((await searchParams).tags)
  const allTags = Array.from(
    new Set(projects.flatMap(p => p.tags ?? [])),
  ).sort()

  const visible =
    selected.length === 0
      ? projects
      : projects.filter(p => selected.every(t => p.tags?.includes(t)))

  return (
    <SimpleLayout
      title="Things I’ve made trying to put my dent in the universe."
      intro="I’ve worked on tons of little projects over the years but these are the ones that I’m most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute!"
      gapClass="mt-12 sm:mt-8"
    >
      {/* filter bar */}
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <TagChip tag="All" selected={selected} />
          {allTags.map(tag => (
            <TagChip key={tag} tag={tag} selected={selected} />
          ))}
        </div>
      )}

      {/* project grid */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map(project => (
          <Card as="li" key={project.name}>
            {/* logo */}
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image src={project.logo} alt="" className="h-8 w-8" unoptimized />
            </div>

            {/* name */}
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href} target="_blank" rel="noreferrer">
                {project.name}
              </Card.Link>
            </h2>

            {/* description */}
            <Card.Description>{project.description}</Card.Description>

            {/* tech-stack chips */}
            {project.tags?.length > 0 && (
              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {project.tags
                  .slice()
                  .sort()
                  .map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700/40 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            )}

            {/* footer link */}
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          No projects match&nbsp;
          {[...selected]
            .sort((a, b) => a.localeCompare(b))
            .map(t => `"${t}"`)
            .join(', ')}
          .
        </p>
      )}
    </SimpleLayout>
  )
}
