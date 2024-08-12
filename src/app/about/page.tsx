import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  MastodonIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/portrait.jpg'
import { Card } from '@/components/Card'
import logoAnimaginary from '@/images/logos/animaginary.svg'
import logoCosmos from '@/images/logos/cosmos.svg'
import logoHelioStream from '@/images/logos/helio-stream.svg'
import logoOpenShuttle from '@/images/logos/open-shuttle.svg'
import logoPlanetaria from '@/images/logos/planetaria.svg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-blue-500 dark:text-zinc-200 dark:hover:text-blue-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-blue-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

function DashedDivider({padding}: {padding: number}) {
  if (padding === 4) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
        <div></div>
      </ul>
    )
  } else if (padding === 8) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
        <div></div>
      </ul>
    )
  } else {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
        <div></div>
      </ul>
    )
  }
}

const languages = [
  {
    name: 'Java',
    description:
      'Creating technology to empower civilians to explore space on their own terms.',
    link: { href: 'https://java.com/', label: 'java.com' },
    logo: logoPlanetaria,
  },
  {
    name: 'Python',
    description:
      'High performance web animation library, hand-written in optimized WASM.',
    link: { href: 'https://python.org/', label: 'python.org' },
    logo: logoAnimaginary,
  },
  {
    name: 'Rust',
    description:
      'Real-time video streaming library, optimized for interstellar transmission.',
    link: { href: 'https://www.rust-lang.org/', label: 'rust-lang.org' },
    logo: logoHelioStream,
  },
  {
    name: 'JavaScript',
    description:
      'The operating system that powers our Planetaria space shuttles.',
    link: { href: 'https://www.javascript.com/', label: 'javascript.com' },
    logo: logoCosmos,
  },
  {
    name: 'C++',
    description:
      'The schematics for the first rocket I designed that successfully made it to orbit.',
    link: { href: 'https://cplusplus.com/', label: 'cplusplus.com' },
    logo: logoOpenShuttle,
  },
]

const frameworks = [
  {
    name: 'PyTorch',
    description:
      'Creating technology to empower civilians to explore space on their own terms.',
    link: { href: 'https://java.com/', label: 'java.com' },
    logo: logoPlanetaria,
  },
  {
    name: 'Next.js',
    description:
      'High performance web animation library, hand-written in optimized WASM.',
    link: { href: 'https://python.org/', label: 'python.org' },
    logo: logoAnimaginary,
  },
  {
    name: 'Flutter',
    description:
      'Real-time video streaming library, optimized for interstellar transmission.',
    link: { href: 'https://www.rust-lang.org/', label: 'rust-lang.org' },
    logo: logoHelioStream,
  },
]

// const tools = [
//   {
//     name: 'JetBrains IDEs',
//     description:
//       'Creating technology to empower civilians to explore space on their own terms.',
//     link: { href: 'https://java.com/', label: 'java.com' },
//     logo: logoPlanetaria,
//   },
//   {
//     name: 'Git',
//     description:
//       'High performance web animation library, hand-written in optimized WASM.',
//     link: { href: 'https://python.org/', label: 'python.org' },
//     logo: logoAnimaginary,
//   },
//   {
//     name: 'Flutter',
//     description:
//       'Real-time video streaming library, optimized for interstellar transmission.',
//     link: { href: 'https://www.rust-lang.org/', label: 'rust-lang.org' },
//     logo: logoHelioStream,
//   },
// ]

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

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Sathya Tadinada. I live in Salt Lake City, where I shape tomorrow’s potential.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt="Sathya Tadinada Portrait"
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Sathya Tadinada.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              My journey in computer science started all the way back in middle school, 
              when I first interacted with computers and realized their potential and 
              usefulness as a vessel for creativity and problem-solving, along with 
              providing a personal platform to solve any problems I came across in my
              day-to-day life. As such, I was very intrigued by the realm of software 
              development - as a professional parallel to my personal interests.
            </p>
            <p>
              In high school and college, I was introduced to the world of theoretical 
              computer science (including the mathematical underpinnings of computation),
              which further solidified my interest in the field. I was particularly
              fascinated by the idea of using computers to solve complex problems and
              create new technologies that could leave a positive impact on the world.
              As a result of this, I’ve been very interested in pursuing any
              opportunities that allow me to study mathematics and theoretical computer science - 
              along with the practical applications of these fields in software development.
            </p>
            <p>
              Today, I’m the founder of Planetaria, where we’re working on
              civilian space suits and manned shuttle kits you can assemble at
              home so that the next generation of kids really <em>can</em> make
              it to orbit — from the comfort of their own backyards.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            {/* <SocialLink href="https://github.com/SathyaTadinada/" icon={GitHubIcon} className="mt-4">
              Follow on GitHub
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/sathya-tadinada/" icon={LinkedInIcon} className="mt-4">
              Follow on LinkedIn
            </SocialLink> */}
            <SocialLink href="https://x.com/SathyaTadinada/" icon={XIcon} className="mt-4">
              Follow on X
            </SocialLink>
            <SocialLink href="https://instagram.com/sathya.tadinada/" icon={InstagramIcon} className="mt-4">
              Follow on Instagram
            </SocialLink>
            <SocialLink href="https://mastodon.social/@tadinada/" icon={MastodonIcon} className="mt-4">
              Follow on Mastodon
            </SocialLink>
          </ul>
          <DashedDivider padding={4}/>
          <SocialLink href="mailto:sathya@tadinada.com" icon={MailIcon}
            className=" border-zinc-100 pt-4 dark:border-zinc-700/40">
            sathya@tadinada.com
          </SocialLink>
        </div>
      </div>
      <div className="border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div> {/* full-page divider line */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Languages and Frameworks
        </h2>
        <div className="mt-6 space-y-8">
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            I’ve worked with a lot of different technologies over the years, but
            these are the ones that I’m most excited about right now.
          </p>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-1 lg:grid-cols-5"
          >
            {languages.map((language) => (
              <Card as="li" key={language.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={language.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link href={language.link.href}>{language.name}</Card.Link>
                </h2>
                <Card.Description>{language.description}</Card.Description>
                <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <LinkIcon className="h-6 w-6 flex-none" />
                  <span className="ml-2">{language.link.label}</span>
                </p>
              </Card>
            ))}
          </ul>

          <DashedDivider padding={8}/>

          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-1 lg:grid-cols-5"
          >
            {frameworks.map((framework) => (
              <Card as="li" key={framework.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={framework.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link href={framework.link.href}>{framework.name}</Card.Link>
                </h2>
                <Card.Description>{framework.description}</Card.Description>
                <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <LinkIcon className="h-6 w-6 flex-none" />
                  <span className="ml-2">{framework.link.label}</span>
                </p>
              </Card>
            ))}
          </ul>

          {/* <DashedDivider padding={8}/>

          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-1 lg:grid-cols-5"
          >
            {tools.map((tool) => (
              <Card as="li" key={tool.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={tool.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link href={tool.link.href}>{tool.name}</Card.Link>
                </h2>
                <Card.Description>{tool.description}</Card.Description>
                <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <LinkIcon className="h-6 w-6 flex-none" />
                  <span className="ml-2">{tool.link.label}</span>
                </p>
              </Card>
            ))}
          </ul> */}
        </div>

      </div>
    </Container>
  )
}
