import rehypePrism from 'rehype-prism-plus'
import nextMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],

  outputFileTracingIncludes: {
    './src/lib/articles.ts': ['./src/app/blog/**/*.mdx'],
  },

  webpack(config) {
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})

export default withMDX(nextConfig)