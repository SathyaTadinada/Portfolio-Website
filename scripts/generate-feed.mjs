import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local' })

import fs from 'node:fs/promises'
import path from 'node:path'

import { compile } from '@mdx-js/mdx'
import { load } from 'cheerio'
import glob from 'fast-glob'
import { Feed } from 'feed'
import { parseExpressionAt } from 'acorn'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import * as runtime from 'react/jsx-runtime'

const localAssetExtensions = new Set([
  '.gif',
  '.jpg',
  '.jpeg',
  '.png',
  '.svg',
  '.webp',
])

/**
 * Extracts the object literal text for: export const article = { ... }
 * using brace matching that respects quotes.
 */
function extractExportedObjectLiteral(source, exportName) {
  const marker = `export const ${exportName}`
  const start = source.indexOf(marker)
  if (start === -1) return null

  const eq = source.indexOf('=', start)
  if (eq === -1) return null

  const braceStart = source.indexOf('{', eq)
  if (braceStart === -1) return null

  let i = braceStart
  let depth = 0
  let inSingle = false
  let inDouble = false
  let inTemplate = false
  let escaped = false

  for (; i < source.length; i++) {
    const c = source[i]

    if (escaped) {
      escaped = false
      continue
    }

    if (c === '\\') {
      escaped = true
      continue
    }

    // toggle quote states
    if (!inDouble && !inTemplate && c === "'") inSingle = !inSingle
    else if (!inSingle && !inTemplate && c === '"') inDouble = !inDouble
    else if (!inSingle && !inDouble && c === '`') inTemplate = !inTemplate

    if (inSingle || inDouble || inTemplate) continue

    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        // include closing brace
        return source.slice(braceStart, i + 1)
      }
    }
  }

  return null
}

/**
 * Safely converts a parsed ObjectExpression into a plain JS object,
 * allowing only strings/numbers/booleans/null and arrays of those.
 */
function astValueToJs(node) {
  switch (node.type) {
    case 'Literal':
      return node.value
    case 'ArrayExpression':
      return node.elements.map((el) => (el ? astValueToJs(el) : null))
    // If you ever add something like tags: SOME_CONST, we won’t execute it.
    default:
      return undefined
  }
}

function objectExpressionToJs(objExpr) {
  if (!objExpr || objExpr.type !== 'ObjectExpression') return null
  const out = {}
  for (const prop of objExpr.properties) {
    if (prop.type !== 'Property') continue
    const key =
      prop.key.type === 'Identifier'
        ? prop.key.name
        : prop.key.type === 'Literal'
          ? String(prop.key.value)
          : null
    if (!key) continue

    const v = astValueToJs(prop.value)
    if (v !== undefined) out[key] = v
  }
  return out
}

function extractArticleMeta(source) {
  const objLiteral = extractExportedObjectLiteral(source, 'article')
  if (!objLiteral) return null

  // Parse only the object literal snippet (not the full MDX file).
  // Wrap in parentheses so it's definitely an expression.
  const expr = parseExpressionAt(`(${objLiteral})`, 0, {
    ecmaVersion: 'latest',
  })
  const meta = objectExpressionToJs(expr)
  return meta
}

function extractMdxBodyForRss(source) {
  // A simple rule that matches your MDX structure:
  // content starts after `export default ...` and a blank line.
  const idx = source.indexOf('export default')
  if (idx === -1) return ''

  const after = source.slice(idx)
  // Find the first blank line after export default line
  const blank = after.search(/\n\s*\n/)
  if (blank === -1) return ''

  return after.slice(blank).trim()
}

function withoutTrailingSlash(url) {
  return url.replace(/\/+$/, '')
}

function toAbsoluteUrl(siteUrl, href) {
  if (typeof href !== 'string' || href.length === 0) return href
  if (/^[a-z][a-z\d+.-]*:/i.test(href)) return href

  return new URL(href, `${withoutTrailingSlash(siteUrl)}/`).toString()
}

function publicBlogAssetUrl(siteUrl, slug, filename) {
  return `${withoutTrailingSlash(siteUrl)}/blog/${encodeURIComponent(slug)}/${encodeURIComponent(filename)}`
}

function extractLocalAssetImports(source) {
  const imports = new Map()
  const importPattern =
    /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"](\.[^'"]+)['"]/g

  for (const match of source.matchAll(importPattern)) {
    const [, identifier, relativePath] = match
    const ext = path.extname(relativePath).toLowerCase()
    if (localAssetExtensions.has(ext)) {
      imports.set(identifier, relativePath)
    }
  }

  return imports
}

async function copyBlogAsset({ blogDir, relativePath, siteUrl, slug }) {
  const sourcePath = path.resolve(blogDir, relativePath)
  const filename = path.basename(sourcePath)
  const outputPath = path.join(process.cwd(), 'public', 'blog', slug, filename)

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.copyFile(sourcePath, outputPath)

  return publicBlogAssetUrl(siteUrl, slug, filename)
}

async function buildMdxScope({ source, mdxPath, siteUrl, slug }) {
  const blogDir = path.dirname(mdxPath)
  const imports = extractLocalAssetImports(source)
  const scope = {}

  for (const [identifier, relativePath] of imports) {
    scope[identifier] = await copyBlogAsset({
      blogDir,
      relativePath,
      siteUrl,
      slug,
    })
  }

  return scope
}

function componentNamesInMdx(body) {
  const names = new Set()
  const componentPattern = /<([A-Z][A-Za-z0-9_]*)\b/g

  for (const match of body.matchAll(componentPattern)) {
    names.add(match[1])
  }

  return names
}

function nodeToString(node) {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToString).join('')
  return ''
}

function createRssComponents({ siteUrl }) {
  function Image({ src, alt = '', caption, title }) {
    const imageSrc =
      typeof src === 'object' && src && 'src' in src ? src.src : src

    const image = React.createElement('img', {
      src: toAbsoluteUrl(siteUrl, imageSrc),
      alt,
      title,
    })

    if (!caption) return image

    return React.createElement(
      'figure',
      null,
      image,
      React.createElement('figcaption', null, caption),
    )
  }

  function YouTube({ id }) {
    const href = `https://www.youtube.com/watch?v=${id}`
    const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`

    return React.createElement(
      'figure',
      null,
      React.createElement(
        'a',
        { href },
        React.createElement('img', {
          src: thumbnail,
          alt: 'YouTube video thumbnail',
        }),
      ),
      React.createElement(
        'figcaption',
        null,
        React.createElement('a', { href }, 'Watch on YouTube'),
      ),
    )
  }

  function PDF({ src, title = 'PDF document' }) {
    const href = toAbsoluteUrl(siteUrl, src)

    return React.createElement(
      'p',
      null,
      React.createElement('a', { href }, title),
    )
  }

  function Typst({ children, code, src, caption }) {
    if (src) {
      const href = toAbsoluteUrl(siteUrl, src)

      return React.createElement(
        'p',
        null,
        React.createElement('a', { href }, caption || 'Open Typst source'),
      )
    }

    return React.createElement(
      'figure',
      null,
      React.createElement(
        'pre',
        null,
        React.createElement('code', null, code ?? nodeToString(children)),
      ),
      caption ? React.createElement('figcaption', null, caption) : null,
    )
  }

  function UnsupportedComponent({ children }) {
    return children ? React.createElement(React.Fragment, null, children) : null
  }

  return {
    Image,
    img: Image,
    PDF,
    Typst,
    YouTube,
    UnsupportedComponent,
  }
}

function cleanFeedHtml(html, siteUrl) {
  const $ = load(html, { decodeEntities: false }, false)

  $('link[rel="preload"]').remove()

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href')
    $(element).attr('href', toAbsoluteUrl(siteUrl, href))
  })

  $('img[src]').each((_, element) => {
    const src = $(element).attr('src')
    $(element).attr('src', toAbsoluteUrl(siteUrl, src))
  })

  return $.root().html()?.trim() ?? ''
}

async function mdxBodyToHtml({ body, source, mdxPath, siteUrl, slug }) {
  if (!body) return ''

  const scope = await buildMdxScope({ source, mdxPath, siteUrl, slug })
  const compiled = await compile(body, {
    development: false,
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
  })

  const scopeKeys = Object.keys(scope)
  const createMdxModule = new Function(
    'runtime',
    ...scopeKeys,
    String(compiled),
  )
  const { default: MDXContent } = createMdxModule(
    runtime,
    ...scopeKeys.map((key) => scope[key]),
  )

  const rssComponents = createRssComponents({ siteUrl })
  const components = {
    Image: rssComponents.Image,
    img: rssComponents.img,
    PDF: rssComponents.PDF,
    Typst: rssComponents.Typst,
    YouTube: rssComponents.YouTube,
  }

  for (const name of componentNamesInMdx(body)) {
    components[name] ??= rssComponents.UnsupportedComponent
  }

  const html = renderToStaticMarkup(
    React.createElement(MDXContent, { components }),
  )

  return cleanFeedHtml(html, siteUrl)
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    console.log(
      '[generate-feed] Skipping feed generation: NEXT_PUBLIC_SITE_URL is not set.',
    )
    return
  }

  const author = {
    name: 'Sathya Tadinada',
    email: 'sathya@tadinada.com',
  }

  const feed = new Feed({
    title: author.name,
    description:
      'This is my personal blog! I write about things I find interesting.',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  const blogDir = path.join(process.cwd(), 'src/app/blog')
  const postFiles = await glob('*/page.mdx', { cwd: blogDir, absolute: true })

  for (const mdxPath of postFiles) {
    const source = await fs.readFile(mdxPath, 'utf8')
    const meta = extractArticleMeta(source)
    if (!meta) continue

    const slug = path.basename(path.dirname(mdxPath))
    const publicUrl = `${siteUrl}/blog/${slug}`

    const body = extractMdxBodyForRss(source)
    const content = await mdxBodyToHtml({
      body,
      source,
      mdxPath,
      siteUrl,
      slug,
    })

    // Required fields
    const title = typeof meta.title === 'string' ? meta.title : slug
    const dateStr = typeof meta.date === 'string' ? meta.date : null
    if (!dateStr) continue

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      description:
        typeof meta.description === 'string' ? meta.description : undefined,
      content: content || undefined,
      author: [author],
      contributor: [author],
      date: new Date(dateStr),
    })
  }

  const outPath = path.join(process.cwd(), 'public', 'feed.xml')
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, feed.rss2(), 'utf8')
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
