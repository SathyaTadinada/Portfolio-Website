// import { type MDXComponents } from 'mdx/types'
// import Image, { type ImageProps } from 'next/image'

// export function useMDXComponents(components: MDXComponents) {
//   return {
//     ...components,
//     Image: (props: ImageProps) => <Image {...props} />,
//   }
// }

// import type { MDXComponents } from 'mdx/types'
// import NextImage, { type ImageProps } from 'next/image'
// import type { ComponentPropsWithoutRef } from 'react'

// type ImgProps = ComponentPropsWithoutRef<'img'> & { src: string } // narrow src

// export function useMDXComponents(components: MDXComponents): MDXComponents {
//   return {
//     ...components,

//     wrapper: ({ children }) => (
//       <article className="prose prose-zinc dark:prose-invert max-w-none">
//         {children}
//       </article>
//     ),

//     // MDX uses <Image /> explicitly
//     Image: (props: ImageProps) => (
//       <NextImage {...props} alt={props.alt ?? ''} />
//     ),

//     // MDX emits lowercase <img>
//     img: ({ src, alt = '', width, height, ...rest }: ImgProps) => (
//       <NextImage
//         src={src}                            // now guaranteed string
//         alt={alt}
//         width={width ? Number(width) : 800}  // pick sensible defaults
//         height={height ? Number(height) : 600}
//         {...rest}
//       />
//     ),
//   }
// }

import type { MDXComponents } from 'mdx/types'
import NextImage, { type ImageProps } from 'next/image'
import type { ComponentPropsWithoutRef } from 'react'

type ImgProps = ComponentPropsWithoutRef<'img'> & { src: string }

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,

    // Typography only for MDX content
    wrapper: ({ children }) => (
      <article
        data-mdx
        className="prose prose-zinc dark:prose-invert max-w-none
                   [--tw-prose-links:theme(colors.blue.500)]
                   prose-a:underline"
      >
        {children}
      </article>
    ),

    Image: (props: ImageProps) => <NextImage {...props} alt={props.alt ?? ''} />,

    img: ({ src, alt = '', width, height, ...rest }: ImgProps) => (
      <NextImage
        src={src}
        alt={alt}
        width={width ? Number(width) : 800}
        height={height ? Number(height) : 600}
        {...rest}
      />
    ),
  }
}
