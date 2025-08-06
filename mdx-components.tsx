import type { MDXComponents } from 'mdx/types'
import CodeBlock from '@/components/CodeBlock'
import YouTube from '@/components/YouTube'
import NextImage, { type ImageProps } from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

type ImgProps = ComponentPropsWithoutRef<'img'> & { src: string }

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    YouTube,
    ...components,

    pre: (props) => <CodeBlock {...props} />,

    // Typography only for MDX content
    wrapper: ({ children }) => (
      <article
        data-mdx
        className="max-w-none"
      >
        {children}
      </article>
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
  }
}
