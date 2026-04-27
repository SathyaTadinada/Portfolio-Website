import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
  MailIcon,
} from '@/components/SocialIcons'

import {
  GraduationCap,
  BriefcaseIcon as Briefcase,
  DownloadIcon,
} from 'lucide-react'

import logoUniversityOfUtah from '@/images/logos/university-of-utah.svg'
import logoCanyons from '@/images/logos/canyons.svg'
import logoSIE from '@/images/logos/sie.svg'
import logoSPS from '@/images/logos/sps.svg'
import image1 from '@/images/photos/capitol.jpg'
import image2 from '@/images/photos/bell-canyon.jpg'
import image3 from '@/images/photos/crocodile.jpg'
import image4 from '@/images/photos/santa-barbara-beach.jpg'
import image5 from '@/images/photos/tulip-festival.jpg'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function Article({ post: post }: { post: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/blog/${post.slug}`}>{post.title}</Card.Title>
      <Card.Eyebrow as="time" dateTime={post.date} decorate>
        {formatDate(post.date)}
      </Card.Eyebrow>
      <Card.Description>{post.description}</Card.Description>
      <Card.Cta>Read post</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link
      className="group -m-1 p-1"
      {...props}
      target="_blank"
      rel="noreferrer"
    >
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

// function Newsletter() {
//   return (
//     <form
//       action="/thank-you"
//       className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
//     >
//       <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
//         <MailIcon_Newsletter className="h-6 w-6 flex-none" />
//         <span className="ml-3">Stay up to date</span>
//       </h2>
//       <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
//         Get notified when I publish something new, and unsubscribe at any time.
//       </p>
//       <div className="mt-6 flex">
//         <input
//           type="email"
//           placeholder="Email address"
//           aria-label="Email address"
//           required
//           className="min-w-0 flex-auto appearance-none rounded-md border
//           border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md
//           shadow-zinc-800/5 placeholder:text-zinc-400
//           focus:border-blue-500 focus:outline-none focus:ring-4
//           focus:ring-blue-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15]
//           dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-400
//           dark:focus:ring-blue-400/10"
//         />
//         <Button type="submit" className="ml-4 flex-none">
//           Join
//         </Button>
//       </div>
//     </form>
//   )
// }

interface Role {
  organization: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Role({ role }: { role: Role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime

  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Organization</dt>
        <dd className="flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.organization}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="text-xs text-zinc-400 sm:ml-auto dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">–</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="w-full text-xs text-zinc-500 dark:text-zinc-400">
          {role.title}
        </dd>
      </dl>
    </li>
  )
}

function Resume(options: { className?: string }) {
  // adds shading to icons
  // const SECTION_ICON = 'h-6 w-6 flex-none stroke-zinc-400 dark:stroke-zinc-500'
  // const SECTION_ICON = "h-6 w-6 flex-none fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
  const SECTION_ICON = 'h-6 w-6 flex-none text-zinc-400 dark:text-zinc-500'

  if (options.className === 'Education') {
    let educationHistory: Array<Role> = [
      {
        organization: 'University of Utah',
        title:
          'BS in Computer Science and Applied Mathematics, Minor in Psychology',
        logo: logoUniversityOfUtah,
        start: '2022',
        end: {
          label: 'Present',
          dateTime: new Date().getFullYear().toString(),
        },
      },
    ]
    return (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <GraduationCap
            className={SECTION_ICON}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="ml-3">Education</span>
        </h2>
        <ol className="mt-6 space-y-4">
          {educationHistory.map((role, roleIndex) => (
            <Role key={roleIndex} role={role} />
          ))}
        </ol>
      </div>
    )
  } else {
    let workExperience: Array<Role> = [
      {
        organization: 'Select Portfolio Servicing',
        title: 'Software Engineering Intern',
        logo: logoSPS,
        start: {
          label: 'May 2025',
          dateTime: '2025-05',
        },
        end: {
          label: 'Aug 2025',
          dateTime: '2025-08',
        },
      },
      {
        organization: 'Success in Education',
        title: 'Tech Track Summer Camp Mentor',
        logo: logoSIE,
        start: {
          label: 'July 2024',
          dateTime: '2024-07',
        },
        end: {
          label: 'Aug 2024',
          dateTime: '2024-08',
        },
      },
      {
        organization: 'PeDEL Lab',
        title: 'Undergraduate Researcher',
        logo: logoUniversityOfUtah,
        start: {
          label: 'Feb 2022',
          dateTime: '2022-02',
        },
        end: {
          label: 'Aug 2022',
          dateTime: '2022-08',
        },
      },
      {
        organization: 'Canyons School District',
        title: 'IT Summer Intern',
        logo: logoCanyons,
        start: {
          label: 'May 2021',
          dateTime: '2021-05',
        },
        end: {
          label: 'Aug 2021',
          dateTime: '2021-08',
        },
      },
    ]
    return (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <Briefcase
            className={SECTION_ICON}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <span className="ml-3">Work</span>
        </h2>

        <ol className="mt-6 space-y-4">
          {workExperience.map((role, roleIndex) => (
            <Role key={roleIndex} role={role} />
          ))}
        </ol>
        <Button
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          variant="secondary"
          className="group mt-6 w-full"
        >
          Download Resume
          <DownloadIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
        </Button>
      </div>
    )
  }
}

function Photos() {
  const rotations = [
    'rotate-2',
    '-rotate-2',
    'rotate-2',
    'rotate-2',
    '-rotate-2',
  ]

  return (
    <div className="mt-16 sm:mt-20">
      {/* mobile: swipe horizontally; desktop: no horizontal scrolling */}
      <div className="no-scrollbar -my-4 w-full overflow-x-auto py-4 [-webkit-overflow-scrolling:touch] sm:overflow-x-hidden">
        <div className="flex snap-x snap-mandatory justify-start gap-5 px-4 sm:justify-center sm:gap-8 sm:px-0">
          {[image1, image2, image3, image4, image5].map((image, i) => (
            <div
              key={image.src}
              className={clsx(
                'relative aspect-9/10 w-44 flex-none snap-center overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
                rotations[i % rotations.length],
              )}
            >
              <Image
                src={image}
                alt=""
                sizes="(min-width: 640px) 18rem, 11rem"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 3)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Hey, I&rsquo;m Sathya! <span className="wave-emoji">👋</span>
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            An avid software developer and college student based in Salt Lake
            City. I am excited to contribute to the tech industry and make a
            positive impact through my work.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://linkedin.com/in/sathya-tadinada/"
              aria-label="Connect on LinkedIn"
              rel="noreferrer"
              icon={LinkedInIcon}
            />
            <SocialLink
              href="https://github.com/SathyaTadinada/"
              aria-label="View on GitHub"
              rel="noreferrer"
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://x.com/SathyaTadinada/"
              aria-label="Follow on X"
              rel="noreferrer"
              icon={XIcon}
            />
            <SocialLink
              href="https://instagram.com/sathya.tadinada/"
              aria-label="Follow on Instagram"
              rel="noreferrer"
              icon={InstagramIcon}
            />
            <SocialLink
              href="https://mastodon.social/@tadinada"
              aria-label="Follow on Mastodon"
              rel="me noreferrer"
              icon={MastodonIcon}
            />
            <SocialLink
              href="mailto:sathya@tadinada.com"
              aria-label="Send an email"
              rel="noreferrer"
              icon={MailIcon}
            />
          </div>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} post={article} />
            ))}
          </div>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            {/* <Newsletter /> */}
            <Resume className="Education" />
            <Resume className="Work" />
          </div>
        </div>
      </Container>
    </>
  )
}
