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

function DashedDivider({ padding }: { padding: number }) {
  if (padding === 0) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1">
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
      </ul>
    )
  } else if (padding === 4) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-4"></div>
        <div></div>
      </ul>
    )
  } else if (padding === 6) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-6"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-6"></div>
        <div></div>
      </ul>
    )
  } else if (padding === 8) {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-8"></div>
        <div></div>
      </ul>
    )
  } else {
    return (
      <ul className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4">
        <div></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
        <div className="border-dashed border-t border-zinc-100 dark:border-zinc-700/40 mt-12"></div>
        <div></div>
      </ul>
    )
  }
}

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

function ChevronRightIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" {...props}>
      <path
        d="m 7.425 4.05 l 6.75 6.75 l -6.75 6.75"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
    </svg>
  )
}

const primaryContact = [
  {
    name: 'Email',
    description:
      'This is the best way to reach me, I check my email every day and respond promptly.',
    link: { href: 'mailto:sathya@tadinada.com', label: 'sathya@tadinada.com', hover: 'Send email' },
    logo: logoMail,
  },
  {
    name: 'LinkedIn',
    description:
      'Connect with me on LinkedIn, where I share my professional updates.',
    link: { href: 'https://linkedin.com/in/sathya-tadinada/', label: 'sathya-tadinada', hover: 'Visit LinkedIn' },
    logo: logoLinkedIn,
  },
]

const otherProfiles = [
  {
    name: 'GitHub',
    description:
      "I'm an active open-source contributor and developer, check out my projects on GitHub.",
    link: { href: 'https://github.com/SathyaTadinada', label: 'SathyaTadinada', hover: 'Visit GitHub' },
    logo: logoGithub,
  },
  {
    name: 'X',
    description:
      'Follow me here for my latest thoughts and updates, I tend to post here more frequently.',
    link: { href: 'https://x.com/@SathyaTadinada', label: '@SathyaTadinada', hover: 'Visit X' },
    logo: logoX,
  },
  {
    name: 'Instagram',
    description:
      'Check out my profile for pictures of my travels and hobbies.',
    link: { href: 'https://instagram.com/sathya.tadinada/', label: '@sathya.tadinada', hover: 'Visit Instagram' },
    logo: logoInstagram,
  },
  {
    name: 'Mastodon',
    description:
      'I cross-post all my thoughts here, follow for all my latest updates.',
    link: { href: 'https://mastodon.social/@tadinada', label: '@tadinada', hover: 'Visit Mastodon' },
    logo: logoMastodon,
  },
]

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Let’s stay in touch!',
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
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={contact.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link href={contact.link.href} target='_blank' rel='noreferrer'>{contact.name}</Card.Link>
                </h2>
                <Card.Description>{contact.description}</Card.Description>
                <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <ChevronRightIcon className="block group-hover:hidden h-7 w-7 flex-auto" />
                  <LinkIcon className="hidden group-hover:block h-7 w-7 flex-auto" />

                  <span className="block group-hover:hidden ml-2">{contact.link.label}</span>
                  <span className="hidden group-hover:block ml-2">{contact.link.hover}</span>
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
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                  <Image
                    src={contact.logo}
                    alt=""
                    className="h-8 w-8"
                    unoptimized
                  />
                </div>
                <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                  <Card.Link href={contact.link.href} target='_blank' rel='noreferrer'>{contact.name}</Card.Link>
                </h2>
                <Card.Description>{contact.description}</Card.Description>
                <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
                  <ChevronRightIcon className="block group-hover:hidden h-7 w-7 flex-auto" />
                  <LinkIcon className="hidden group-hover:block h-7 w-7 flex-auto" />

                  <span className="block group-hover:hidden ml-2">{contact.link.label}</span>
                  <span className="hidden group-hover:block ml-2">{contact.link.hover}</span>
                </p>
              </Card>
            ))}
          </ul>
        </ul>
      </div>
    </SimpleLayout>
  )
}
