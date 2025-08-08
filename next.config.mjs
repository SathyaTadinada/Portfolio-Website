import rehypePrism from 'rehype-prism-plus'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  experimental: {
    mdxRs: true,
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)
