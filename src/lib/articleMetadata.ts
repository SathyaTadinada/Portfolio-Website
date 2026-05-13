import type { Metadata } from 'next'

interface ArticleMetadataOptions {
  title: string
  description: string
  slug: string
  image?: string
  imageAlt?: string
}

export function createArticleMetadata({
  title,
  description,
  slug,
  image,
  imageAlt,
}: ArticleMetadataOptions): Metadata {
  const url = `/blog/${slug}`
  const images = image
    ? [
        {
          url: image,
          alt: imageAlt ?? title,
        },
      ]
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      images,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  }
}
