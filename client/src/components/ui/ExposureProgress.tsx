import { useEffect, useState } from 'react'

/**
 * Exposure progress — Photolog original.
 * Thin ink line under the masthead tracks document scroll depth (like a light meter).
 */
export function ExposureProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setP(max > 0 ? Math.min(1, el.scrollTop / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pl-exposure" aria-hidden>
      <div className="pl-exposure__fill" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}
