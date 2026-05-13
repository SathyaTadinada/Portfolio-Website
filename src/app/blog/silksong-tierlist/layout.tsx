import { createArticleMetadata } from '@/lib/articleMetadata'

export const metadata = createArticleMetadata({
  title: 'Ranking the Music in Hollow Knight: Silksong',
  description:
    'A tier list of the music in Hollow Knight: Silksong, ranked from S to F.',
  slug: 'silksong-tierlist',
  // image: '/blog/silksong-tierlist/cover.png',
  // imageAlt: 'Cover image for the Silksong tier list article.',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
