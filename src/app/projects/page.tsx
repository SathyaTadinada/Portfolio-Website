import { type Metadata } from 'next'
import ProjectsClient from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I’ve made trying to put my dent in the universe.',
}

export const dynamic = 'force-static'

export default function ProjectsPage() {
  return <ProjectsClient />
}
