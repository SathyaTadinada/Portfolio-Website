// Using rehype-shiki for server-side syntax highlighting
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  experimental: {
    mdxRs: true,
    // reactCompiler: true, // consider adding this.
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
})

export default withMDX(nextConfig)
