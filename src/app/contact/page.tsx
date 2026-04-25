import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

import logoGithub from '@/images/logos/github.svg'
import logoX from '@/images/logos/x.svg'
import logoInstagram from '@/images/logos/instagram.svg'
import logoMastodon from '@/images/logos/mastodon.svg'
import logoMail from '@/images/logos/mail.svg'
import logoLinkedIn from '@/images/logos/linkedin.svg'

import { Link, ChevronRight } from 'lucide-react'

function DashedDivider({ padding }: { padding: number }) {
  if (padding === 0) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
        <div className="mt-8 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
      </ul>
    )
  } else if (padding === 4) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="mt-4 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div className="mt-4 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div></div>
      </ul>
    )
  } else if (padding === 6) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="mt-6 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div className="mt-6 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div></div>
      </ul>
    )
  } else if (padding === 8) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="mt-8 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div className="mt-8 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div></div>
      </ul>
    )
  } else {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="mt-12 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div className="mt-12 border-t border-dashed border-zinc-100 dark:border-zinc-700/40"></div>
        <div></div>
      </ul>
    )
  }
}

const primaryContact = [
  {
    name: 'Email',
    description:
      'This is the best way to reach me, I check my email every day and respond promptly.',
    link: {
      href: 'mailto:sathya@tadinada.com',
      label: 'sathya@tadinada.com',
      hover: 'Send email',
    },
    logo: logoMail,
  },
  {
    name: 'LinkedIn',
    description:
      'Connect with me on LinkedIn, where I share my professional updates.',
    link: {
      href: 'https://linkedin.com/in/sathya-tadinada/',
      label: 'sathya-tadinada',
      hover: 'Visit LinkedIn',
    },
    logo: logoLinkedIn,
  },
]

const otherProfiles = [
  {
    name: 'GitHub',
    description:
      "I'm an active open-source contributor and developer, check out my projects on GitHub.",
    link: {
      href: 'https://github.com/SathyaTadinada',
      label: 'SathyaTadinada',
      hover: 'Visit GitHub',
    },
    logo: logoGithub,
  },
  {
    name: 'X',
    description:
      'Follow me here for my latest thoughts and updates, I tend to post here more frequently.',
    link: {
      href: 'https://x.com/@SathyaTadinada',
      label: '@SathyaTadinada',
      hover: 'Visit X',
    },
    logo: logoX,
  },
  {
    name: 'Instagram',
    description: 'Check out my profile for pictures of my travels and hobbies.',
    link: {
      href: 'https://instagram.com/sathya.tadinada/',
      label: '@sathya.tadinada',
      hover: 'Visit Instagram',
    },
    logo: logoInstagram,
  },
  {
    name: 'Mastodon',
    description:
      'I cross-post all my thoughts here, follow for all my latest updates.',
    link: {
      href: 'https://mastodon.social/@tadinada',
      label: '@tadinada',
      hover: 'Visit Mastodon',
    },
    logo: logoMastodon,
  },
]

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Let’s stay in touch! Whether you have a question, want to work with me, or just want to say hi, I’ll try my best to get back to you!',
}

export default function Contact() {
  return (
    <SimpleLayout
      title="Let’s stay in touch!"
      intro="Whether you have a question, want to work with me, or just want to say hi, I’ll try my best to get back to you!"
    >
      <div className="space-y-20">
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2"
        >
          <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            Primary Contact Methods
          </h3>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-1 lg:grid-cols-2"
          >
            {primaryContact.map((contact) => (
              <Card as="li" key={contact.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={contact.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link
                    href={contact.link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.name}
                  </Card.Link>
                </h2>
                <Card.Description>{contact.description}</Card.Description>
                <p className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <ChevronRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="h-4 w-4 shrink-0 translate-y-[0.5px] group-hover:hidden"
                  />
                  <Link
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="hidden h-4 w-4 shrink-0 translate-y-[0.5px] group-hover:block"
                  />

                  <span className="leading-none group-hover:hidden">
                    {contact.link.label}
                  </span>
                  <span className="hidden leading-none group-hover:block">
                    {contact.link.hover}
                  </span>
                </p>
              </Card>
            ))}
          </ul>
        </ul>

        <DashedDivider padding={6} />

        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-2"
        >
          <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            Other Profiles
          </h3>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-1 lg:grid-cols-2"
          >
            {otherProfiles.map((contact) => (
              <Card as="li" key={contact.name}>
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={contact.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link
                    href={contact.link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contact.name}
                  </Card.Link>
                </h2>
                <Card.Description>{contact.description}</Card.Description>
                <p className="relative z-10 mt-6 flex items-center gap-2 text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <ChevronRight
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="h-4 w-4 shrink-0 translate-y-[0.5px] group-hover:hidden"
                  />
                  <Link
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="hidden h-4 w-4 shrink-0 translate-y-[0.5px] group-hover:block"
                  />

                  <span className="leading-none group-hover:hidden">
                    {contact.link.label}
                  </span>
                  <span className="hidden leading-none group-hover:block">
                    {contact.link.hover}
                  </span>
                </p>
              </Card>
            ))}
          </ul>
        </ul>
      </div>
    </SimpleLayout>
  )
}
