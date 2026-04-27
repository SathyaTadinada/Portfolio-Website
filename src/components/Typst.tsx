import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import clsx from 'clsx'

const execFileAsync = promisify(execFile)

const typstCacheDir = path.join(os.tmpdir(), 'portfolio-typst')

function isSafeProjectPath(src: string) {
  return (
    !path.isAbsolute(src) &&
    !src.split(/[\\/]+/).includes('..') &&
    src.length > 0
  )
}

function nodeToString(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(nodeToString).join('')
  return ''
}

async function compileTypstFile(inputPath: string, outputPath: string) {
  try {
    await execFileAsync('typst', ['compile', inputPath, outputPath], {
      maxBuffer: 1024 * 1024 * 8,
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      const stderr =
        'stderr' in error && typeof error.stderr === 'string'
          ? error.stderr
          : ''

      throw new Error(
        [
          'Failed to compile Typst content.',
          '',
          stderr.trim() ||
            'Make sure the `typst` CLI is installed and available on PATH.',
        ].join('\n'),
      )
    }

    throw error
  }
}

function wrapTypstSnippet(code: string, textSize: string) {
  return [
    '#set page(width: auto, height: auto, margin: 12pt, fill: white)',
    `#set text(size: ${textSize})`,
    code,
  ].join('\n')
}

async function renderTypstSvg({
  code,
  src,
  fullDocument,
  textSize,
}: {
  code?: string
  src?: string
  fullDocument?: boolean
  textSize: string
}) {
  await fs.mkdir(typstCacheDir, { recursive: true })

  if (src) {
    const normalizedSrc = src.startsWith('/') ? src.slice(1) : src
    if (!isSafeProjectPath(normalizedSrc)) {
      throw new Error(`Unsafe Typst source path: ${src}`)
    }

    const inputPath = path.join(process.cwd(), normalizedSrc)
    const hash = createHash('sha256')
      .update(`src:${normalizedSrc}`)
      .digest('hex')
      .slice(0, 16)
    const outputPath = path.join(typstCacheDir, `${hash}.svg`)

    await compileTypstFile(inputPath, outputPath)
    return fs.readFile(outputPath, 'utf8')
  }

  if (!code?.trim()) {
    throw new Error('Typst content requires either `code`, `src`, or children.')
  }

  const source = fullDocument ? code : wrapTypstSnippet(code, textSize)
  const hash = createHash('sha256')
    .update(`code:${source}`)
    .digest('hex')
    .slice(0, 16)
  const inputPath = path.join(typstCacheDir, `${hash}.typ`)
  const outputPath = path.join(typstCacheDir, `${hash}.svg`)

  await fs.writeFile(inputPath, source, 'utf8')
  await compileTypstFile(inputPath, outputPath)
  return fs.readFile(outputPath, 'utf8')
}

export default async function Typst({
  code,
  src,
  children,
  caption,
  className,
  fullDocument = false,
  textSize = '18pt',
}: {
  code?: string
  src?: string
  children?: React.ReactNode
  caption?: React.ReactNode
  className?: string
  fullDocument?: boolean
  textSize?: string
}) {
  const svg = await renderTypstSvg({
    code: code ?? nodeToString(children),
    src,
    fullDocument,
    textSize,
  })

  return (
    <figure className={clsx('not-prose my-6', className)}>
      <div
        data-typst-render
        className="overflow-x-auto rounded-xl bg-white p-4 ring-1 ring-zinc-200 dark:ring-zinc-700"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-zinc-500 italic dark:text-zinc-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
