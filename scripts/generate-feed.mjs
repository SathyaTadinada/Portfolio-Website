import dotenv from 'dotenv'
dotenv.config()      
dotenv.config({ path: '.env.local' })


import fs from 'node:fs/promises'
import path from 'node:path'

import glob from 'fast-glob'
import { Feed } from 'feed'
import { parseExpressionAt } from 'acorn'

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

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
  const expr = parseExpressionAt(`(${objLiteral})`, 0, { ecmaVersion: 'latest' })
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

function mdxBodyToBasicHtml(body) {
  if (!body) return ''

  // Very lightweight conversion:
  // - split on blank lines into paragraphs
  // - escape HTML
  // You can upgrade this later to a real MD/MDX-to-HTML renderer if you want.
  return body
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('\n')
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    console.log(
      '[generate-feed] Skipping feed generation: NEXT_PUBLIC_SITE_URL is not set.'
    )
    return
  }

  const author = {
    name: 'Sathya Tadinada',
    email: 'sathya@tadinada.com',
  }

  const feed = new Feed({
    title: author.name,
    description: 'This is my personal blog! I write about things I find interesting.',
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
    const content = mdxBodyToBasicHtml(body)

    // Required fields
    const title = typeof meta.title === 'string' ? meta.title : slug
    const dateStr = typeof meta.date === 'string' ? meta.date : null
    if (!dateStr) continue

    feed.addItem({
      title,
      id: publicUrl,
      link: publicUrl,
      description: typeof meta.description === 'string' ? meta.description : undefined,
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
