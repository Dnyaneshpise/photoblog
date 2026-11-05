import { useState } from 'react'

type ShareButtonProps = {
  title: string
  url?: string
}

/**
 * Copies the current (or given) URL for sharing a photograph or page.
 */
export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const href = url || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url: href })
        return
      }
      await navigator.clipboard.writeText(href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        await navigator.clipboard.writeText(href)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore
      }
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] border-b border-transparent hover:border-[var(--color-border)]"
    >
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}
