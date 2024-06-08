import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import Link from 'next/link'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-8">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Let’s stay in touch!',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Let’s stay in touch!"
      intro="Whether you have a question, want to work with me, or just want to say hi, I’ll try my best to get back to you!"
    >
      <div className="space-y-20">
        <ToolsSection title="Primary Contact Methods">
          <Tool title="Email">
            <Link href="mailto:sathya@tadinada.com">sathya@tadinada.com</Link>
          </Tool>
          <Tool title="LinkedIn">
            <Link href="https://linkedin.com/in/sathya-tadinada/">
              sathya-tadinada</Link>
          </Tool>
        </ToolsSection>
        <ToolsSection title="Social Media">
          {/* <Tool title="Sublime Text 4">
            I don’t care if it’s missing all of the fancy IDE features everyone
            else relies on, Sublime Text is still the best text editor ever
            made.
          </Tool> */}
          <Tool title="X / Twitter">
            <Link href="https://x.com/SathyaTadinada/">
              @SathyaTadinada</Link>
          </Tool>
          <Tool title="Instagram">
            <Link href="https://instagram.com/sathya.tadinada/">
              @sathya.tadinada</Link>
          </Tool>
          <Tool title="Mastodon">
            <Link href="https://mastodon.social/@tadinada/">
              @tadinada</Link>
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
