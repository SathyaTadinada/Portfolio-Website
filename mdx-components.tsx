import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import NextImage, { type ImageProps } from 'next/image'

import { Callout } from '@/components/Callout'
import CodeBlock from '@/components/CodeBlock'
import Typst from '@/components/Typst'
import YouTube from '@/components/YouTube'

type ImgProps = ComponentPropsWithoutRef<'img'> & { src: string }
type CaptionedImageProps = ImageProps & { caption?: ReactNode }

function CaptionedImage({ caption, className, ...props }: CaptionedImageProps) {
  let image = (
    <NextImage
      {...props}
      alt={props.alt ?? ''}
      className={`rounded-3xl ${className ?? ''}`}
    />
  )

  if (!caption) return image

  return (
    <figure>
      {image}
      <figcaption className="mt-3 text-center text-sm text-zinc-500 italic dark:text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  )
}

const components = {
  Callout,
  Typst,
  YouTube,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <CodeBlock {...props} />,

  wrapper: (props: ComponentPropsWithoutRef<'article'>) => (
    <article data-mdx className="max-w-none" {...props} />
  ),

  Image: CaptionedImage,

  img: ({ src, alt = '', width, height, className, ...rest }: ImgProps) => (
    <NextImage
      src={src}
      alt={alt}
      width={width ? Number(width) : 800}
      height={height ? Number(height) : 600}
      {...rest}
      className={`rounded-3xl ${className ?? ''}`}
    />
  ),
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
