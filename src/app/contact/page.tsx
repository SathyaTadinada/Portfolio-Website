import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function SpeakingSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({
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
      <Card.Link href={href} target='_blank'></Card.Link>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
  )
}

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Let’s stay in touch!',
}

export default function Speaking() {
  return (
    <SimpleLayout
      title="Let’s stay in touch!"
      intro="Whether you have a question, want to work with me, or just want to say hi, I’ll try my best to get back to you!"
    >
      <div className="space-y-20">
        <SpeakingSection title="Primary Contact Methods">
          <Appearance
            href="mailto:sathya@tadinada.com"
            title="sathya@tadinada.com"
            description="This is the best way to reach me, I check my email every day."
            event="Email"
            cta="Send email"
          />
          <Appearance
            href="https://linkedin.com/in/sathya-tadinada/"
            title="sathya-tadinada"
            description="Connect with me on LinkedIn, where I share my professional updates."
            event="LinkedIn"
            cta="Visit LinkedIn"
          />
        </SpeakingSection>
        <SpeakingSection title="Other Profiles">
          <Appearance
            href="https://github.com/SathyaTadinada/"
            title="SathyaTadinada"
            description="I'm an active open-source contributor and developer, check out my projects on GitHub."
            event="GitHub"
            cta="Visit GitHub"
          />
          <Appearance
            href="https://x.com/SathyaTadinada/"
            title="@SathyaTadinada"
            description="Follow me here for my latest thoughts and updates."
            event="X / Twitter"
            cta="Visit X / Twitter"
          />
          <Appearance
            href="https://instagram.com/sathya.tadinada/"
            title="@sathya.tadinada"
            description="Check out my Instagram for photos of my travels and hobbies."
            event="Instagram"
            cta="Visit Instagram"
          />
          <Appearance
            href="https://mastodon.social/@tadinada/"
            title="@tadinada"
            description="I cross-post all my thoughts to Mastodon, check out my profile for all my latest updates."
            event="Mastodon"
            cta="Visit Mastodon"
          />
        </SpeakingSection>
      </div>
    </SimpleLayout>
  )
}
