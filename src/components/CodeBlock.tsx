import { type ReactNode, type ReactElement, isValidElement } from 'react'
import { codeToHtml } from 'shiki'
import CopyButton from './CopyButton'

function hasProps(
  node: ReactNode,
): node is ReactElement<{ className?: string; children?: ReactNode }> {
  return isValidElement(node)
}

function nodeToString(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(nodeToString).join('')
  if (hasProps(node)) return nodeToString(node.props.children)
  return ''
}

function getLang(node: ReactNode, fallback = ''): string {
  let cls = fallback
  if (hasProps(node)) cls = node.props.className ?? fallback
  const m = /language-([\w-]+)/.exec(cls)
  return m?.[1] ?? ''
}

type PreProps = React.ComponentProps<'pre'> & { children: ReactNode }

export default async function CodeBlock({
  children,
  className = '',
  ...rest
}: PreProps) {
  const raw = nodeToString(children)
  const lang = getLang(children, className)

  const code = 'const a = 1' // input code
  const html = await codeToHtml(raw, {
    lang,
    theme: 'vitesse-dark',
  })

  return (
    <pre
      {...rest}
      className="not-prose group relative my-6 rounded-3xl bg-[#282c34] px-4 pt-10 pb-4 text-xs leading-7 whitespace-pre text-zinc-50 dark:bg-[#101016]"
      data-language={lang}
    >
      {lang && (
        <span className="absolute top-2 left-4 text-[10px] tracking-wider text-zinc-400/80 lowercase select-none">
          {lang}
        </span>
      )}
      <CopyButton raw={raw} />
      <div className="overflow-x-auto">
        <code className={`${className} bg-transparent`}>
          {<div dangerouslySetInnerHTML={{ __html: html }} />}
        </code>
      </div>
    </pre>
  )
}
