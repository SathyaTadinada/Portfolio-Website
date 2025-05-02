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
import logoAirbnb from '@/images/logos/airbnb.svg'
import logoFacebook from '@/images/logos/facebook.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'
import logoStarbucks from '@/images/logos/starbucks.svg'
import logoUniversityOfUtah from '@/images/logos/university-of-utah.svg'
import logoCanyons from '@/images/logos/canyons.svg'
import logoSIE from '@/images/logos/sie.svg'
import image1 from '@/images/photos/capitol.jpg'
import image2 from '@/images/photos/bell-canyon.jpg'
import image3 from '@/images/photos/crocodile.jpg'
import image4 from '@/images/photos/santa-barbara-beach.jpg'
import image5 from '@/images/photos/tulip-festival.jpg'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function MailIcon_Newsletter(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function EducationIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="-1 -3 27 27"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M 12.096 1.2096 c -0.3061 0 -0.6085 0.0529 -0.8959 0.1549 L 0.5972 5.1937 C 0.2382 5.3261 0 5.6662 0 6.048 s 0.2382 0.722 0.5972 0.8543 l 2.1886 0.79 C 2.1659 8.6676 1.8144 9.8204 1.8144 11.0339 v 1.0622 c 0 1.0735 -0.4082 2.1811 -0.843 3.0542 c -0.2458 0.4914 -0.5255 0.9752 -0.8506 1.4213 C 0 16.7341 -0.0341 16.9458 0.0341 17.1385 s 0.2268 0.3365 0.4234 0.3856 l 2.4192 0.6048 c 0.1588 0.0416 0.3289 0.0114 0.4687 -0.0756 s 0.2382 -0.2306 0.2683 -0.3931 c 0.3251 -1.6178 0.1626 -3.0694 -0.0794 -4.1089 C 3.4134 13.0146 3.2508 12.4664 3.024 11.9638 V 11.0339 c 0 -1.1416 0.3856 -2.2189 1.0547 -3.0808 c 0.4877 -0.5858 1.1189 -1.0584 1.8598 -1.3495 l 5.9346 -2.3323 c 0.31 -0.121 0.6616 0.0302 0.7825 0.3402 s -0.0302 0.6616 -0.3402 0.7825 l -5.9346 2.3323 c -0.4687 0.1853 -0.8808 0.4687 -1.2172 0.8165 l 6.0329 2.1773 c 0.2873 0.1021 0.5897 0.1549 0.8959 0.1549 s 0.6085 -0.0529 0.8959 -0.1549 L 23.5948 6.9023 c 0.3592 -0.1285 0.5972 -0.4726 0.5972 -0.8543 s -0.2382 -0.722 -0.5972 -0.8543 L 12.9919 1.3646 C 12.7046 1.2625 12.4022 1.2096 12.096 1.2096 z M 4.8384 15.4224 c 0 1.3343 3.2508 2.7216 7.2576 2.7216 s 7.2576 -1.3873 7.2576 -2.7216 L 18.7753 9.9263 L 13.4002 11.8692 c -0.4196 0.1512 -0.8618 0.2268 -1.3042 0.2268 s -0.8884 -0.0756 -1.3042 -0.2268 L 5.4168 9.9263 L 4.8384 15.4224 z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Article({ post: post }: { post: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/blogs/${post.slug}`}>
        {post.title}
      </Card.Title>
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
    <Link className="group -m-1 p-1" {...props} target='_blank' rel='noreferrer'>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}

function Newsletter() {
  return (
    <form
      action="/thank-you"
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon_Newsletter className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex">
        <input
          type="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          className="min-w-0 flex-auto appearance-none rounded-md border
          border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md
          shadow-zinc-800/5 placeholder:text-zinc-400 
          focus:border-blue-500 focus:outline-none focus:ring-4
          focus:ring-blue-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] 
          dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-400 
          dark:focus:ring-blue-400/10"
        />
        <Button type="submit" className="ml-4 flex-none">
          Join
        </Button>
      </div>
    </form>
  )
}

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
      <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={role.logo} alt="" className="h-7 w-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Organization</dt>
        <dd className="flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {role.organization}
        </dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-zinc-400 dark:text-zinc-500"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
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
  if (options.className === 'Education') {
    let educationHistory: Array<Role> = [
      {
        organization: 'University of Utah',
        title: 'BS in Computer Science and Applied Mathematics, Minor in Psychology',
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
          <EducationIcon className="h-6 w-6 flex-none" />
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
        organization: 'Success in Education',
        title: 'Tech Track Summer Camp Mentor',
        logo: logoSIE,
        start: 'July 2024',
        end: {
          label: 'Aug 2024',
          dateTime: new Date().getFullYear().toString(),
        },
      },
      {
        organization: 'PeDEL Lab',
        title: 'Undergraduate Researcher',
        logo: logoUniversityOfUtah,
        start: 'Feb 2022',
        end: {
          label: 'Aug 2022',
          dateTime: new Date().getFullYear().toString(),
        },
      },
      {
        organization: 'Canyons School District',
        title: 'IT Summer Intern',
        logo: logoCanyons,
        start: 'May 2021',
        end: 'Aug 2021',
      },
    ]
    return (
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <BriefcaseIcon className="h-6 w-6 flex-none" />
          <span className="ml-3">Work</span>
        </h2>
        <ol className="mt-6 space-y-4">
          {workExperience.map((role, roleIndex) => (
            <Role key={roleIndex} role={role} />
          ))}
        </ol>
        <Button href="/resume.pdf" target="_blank" rel='noreferrer' variant="secondary" className="group mt-6 w-full">
          Download Resume
          <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
        </Button>
      </div>
    )
  }
}

function Photos() {
  let rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
              rotations[imageIndex % rotations.length],
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
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Hey, I&rsquo;m Sathya! <span className='wave-emoji'>👋</span>
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            An avid software developer and college student based in Salt Lake
            City. I am excited to contribute to the tech industry and make a positive impact
            through my work.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://linkedin.com/in/sathya-tadinada/"
              aria-label="Connect on LinkedIn"
              rel='noreferrer'
              icon={LinkedInIcon}
            />
            <SocialLink
              href="https://github.com/SathyaTadinada/"
              aria-label="View on GitHub"
              rel='noreferrer'
              icon={GitHubIcon}
            />
            <SocialLink
              href="https://x.com/SathyaTadinada/"
              aria-label="Follow on X"
              rel='noreferrer'
              icon={XIcon}
            />
            <SocialLink
              href="https://instagram.com/sathya.tadinada/"
              aria-label="Follow on Instagram"
              rel='noreferrer'
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
              rel='noreferrer'
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
            <Resume className='Education' />
            <Resume className='Work' />
          </div>
        </div>
      </Container>
    </>
  )
}
