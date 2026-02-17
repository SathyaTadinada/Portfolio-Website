import { type Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I’ve been working on.',
}

export const dynamic = 'force-static'

export default function ProjectsPage() {
  return <ProjectsClient />
}
