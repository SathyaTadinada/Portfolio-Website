'use client'

import { useState } from 'react'
import { ClipboardIcon, CheckIcon } from 'lucide-react'

export default function CopyButton({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copied ? undefined : copy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      title={copied ? 'Copied!' : 'Copy code'}
      className="absolute top-2 right-2 rounded-md rounded-tr-2xl border border-zinc-700 p-1.5 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-100 sm:opacity-100 md:opacity-0 md:group-hover:opacity-100"
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <ClipboardIcon className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
