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

const primaryContact = [
  {
    name: 'Email',
    description: 'Best way to reach me.',
    link: {
      href: 'mailto:sathya@tadinada.com',
      label: 'sathya@tadinada.com',
      hover: 'Send email',
    },
    logo: logoMail,
  },
  {
    name: 'LinkedIn',
    description: 'Professional updates and networking.',
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
    description: 'Code and contributions.',
    link: {
      href: 'https://github.com/SathyaTadinada',
      label: 'SathyaTadinada',
      hover: 'Visit GitHub',
    },
    logo: logoGithub,
  },
  {
    name: 'X',
    description: 'Latest thoughts and updates.',
    link: {
      href: 'https://x.com/@SathyaTadinada',
      label: '@SathyaTadinada',
      hover: 'Visit X',
    },
    logo: logoX,
  },
  {
    name: 'Instagram',
    description: 'Travel and hobbies.',
    link: {
      href: 'https://instagram.com/sathya.tadinada/',
      label: '@sathya.tadinada',
      hover: 'Visit Instagram',
    },
    logo: logoInstagram,
  },
  {
    name: 'Mastodon',
    description: 'Cross-posted from X.',
    link: {
      href: 'https://mastodon.social/@tadinada',
      label: '@tadinada',
      hover: 'Visit Mastodon',
    },
    logo: logoMastodon,
  },
]

function ContactCard({
  contact,
}: {
  contact: (typeof primaryContact)[number]
}) {
  return (
    <Card as="li">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <Image src={contact.logo} alt="" className="h-8 w-8" unoptimized />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={contact.link.href} target="_blank" rel="noreferrer">
          {contact.name}
        </Card.Link>
      </h2>
      <Card.Description>{contact.description}</Card.Description>
      <p className="relative z-10 mt-3 flex items-center gap-2 text-sm font-medium text-zinc-400 transition group-hover:text-blue-500 dark:text-zinc-200">
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
  )
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Let's stay in touch! Whether you have a question, want to work with me, or just want to say hi, I'll try my best to get back to you!",
}

export default function Contact() {
  return (
    <SimpleLayout
      title="Let's stay in touch!"
      intro="Whether you have a question, want to work with me, or just want to say hi, I'll try my best to get back to you!"
    >
      <div className="space-y-10">
        <div>
          <h3 className="mb-6 text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            Primary Contact Methods
          </h3>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2"
          >
            {primaryContact.map((contact) => (
              <ContactCard key={contact.name} contact={contact} />
            ))}
          </ul>
        </div>

        <div className="border-t border-dashed border-zinc-100 dark:border-zinc-700/40" />

        <div>
          <h3 className="mb-6 text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
            Other Profiles
          </h3>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4"
          >
            {otherProfiles.map((contact) => (
              <ContactCard key={contact.name} contact={contact} />
            ))}
          </ul>
        </div>
      </div>
    </SimpleLayout>
  )
}
