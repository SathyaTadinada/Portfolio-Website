import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ContactSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function ContactCard({
  title,
  description,
  event,
  cta,
  href,
}: {
  title: string
  description: string
  event: string
  cta: string
  href: string
}) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Link href={href} target='_blank' rel='noreferrer'></Card.Link>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
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
        <ContactSection title="Primary Contact">
          <ContactCard
            href="mailto:sathya@tadinada.com"
            title="sathya@tadinada.com"
            description="This is the best way to reach me, I check my email every day."
            event="Email"
            cta="Send email"
          />
          <ContactCard
            href="https://linkedin.com/in/sathya-tadinada/"
            title="sathya-tadinada"
            description="Connect with me on LinkedIn, where I share my professional updates."
            event="LinkedIn"
            cta="Visit LinkedIn"
          />
        </ContactSection>
        <DashedDivider padding={8} />
        <ContactSection title="Other Profiles">
          <ContactCard
            href="https://github.com/SathyaTadinada/"
            title="SathyaTadinada"
            description="I'm an active open-source contributor and developer, check out my projects on GitHub."
            event="GitHub"
            cta="Visit GitHub"
          />
          <ContactCard
            href="https://x.com/SathyaTadinada/"
            title="@SathyaTadinada"
            description="Follow me here for my latest thoughts and updates."
            event="X"
            cta="Visit X"
          />
          <ContactCard
            href="https://instagram.com/sathya.tadinada/"
            title="@sathya.tadinada"
            description="Check out my profile for pictures of my travels and hobbies."
            event="Instagram"
            cta="Visit Instagram"
          />
          <ContactCard
            href="https://mastodon.social/@tadinada/"
            title="@tadinada"
            description="I cross-post all my thoughts here, follow for all my latest updates."
            event="Mastodon"
            cta="Visit Mastodon"
          />
        </ContactSection>
      </div>
    </SimpleLayout>
  )
}
