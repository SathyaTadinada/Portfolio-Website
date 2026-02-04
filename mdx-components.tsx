import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import NextImage, { type ImageProps } from 'next/image'

import CodeBlock from '@/components/CodeBlock'
import YouTube from '@/components/YouTube'

type ImgProps = ComponentPropsWithoutRef<'img'> & { src: string }

const components = {
  YouTube,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <CodeBlock {...props} />,

  wrapper: (props: ComponentPropsWithoutRef<'article'>) => (
    <article data-mdx className="max-w-none" {...props} />
  ),

  Image: (props: ImageProps) => (
    <NextImage
      {...props}
      alt={props.alt ?? ''}
      className={`rounded-3xl ${props.className ?? ''}`}
    />
  ),

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
