import { Fragment } from 'react'
import type { ReactNode } from 'react'

function normalizePhrases(phrases?: string[]) {
  return Array.from(new Set(phrases?.filter(Boolean) ?? [])).sort(
    (a, b) => b.length - a.length,
  )
}

function findNextPhrase(text: string, phrases: string[]) {
  let nextIndex = -1
  let nextPhrase = ''

  for (let phrase of phrases) {
    let index = text.indexOf(phrase)
    if (
      index !== -1 &&
      (nextIndex === -1 ||
        index < nextIndex ||
        (index === nextIndex && phrase.length > nextPhrase.length))
    ) {
      nextIndex = index
      nextPhrase = phrase
    }
  }

  if (nextIndex === -1) return null

  return { index: nextIndex, phrase: nextPhrase }
}

export function FormattedArticleText({
  text,
  italicizedPhrases,
}: {
  text: string
  italicizedPhrases?: string[]
}) {
  let phrases = normalizePhrases(italicizedPhrases)
  if (phrases.length === 0) return text

  let parts: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let match = findNextPhrase(remaining, phrases)
    if (!match) {
      parts.push(remaining)
      break
    }

    if (match.index > 0) {
      parts.push(remaining.slice(0, match.index))
    }

    parts.push(<em key={key++}>{match.phrase}</em>)
    remaining = remaining.slice(match.index + match.phrase.length)
  }

  return <Fragment>{parts}</Fragment>
}
