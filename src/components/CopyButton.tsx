'use client'

import { useState } from 'react'

export default function CopyButton({ raw }: { raw: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copied ? undefined : copy}
      aria-label="Copy code"
      className="absolute top-2 right-2 rounded-md border border-zinc-700 px-2 py-0.5 font-mono text-[11px] transition sm:opacity-100 md:opacity-0 md:group-hover:opacity-100"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
