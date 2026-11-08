import { motion } from 'framer-motion'
import { StateBlock } from '../components/StateBlock'
import { IconExternal } from '../components/icons/PhotologIcons'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { SettingsResponse } from '../types/api'

export function AboutPage() {
  useDocumentTitle('About — Photoblog')
  const { data, error, loading } = useApi<SettingsResponse>('/api/settings')

  if (loading) return <StateBlock title="Loading" detail="Reading the profile…" loading />
  if (error) return <StateBlock title="Unable to load" detail={error} />

  const s = data?.data
  if (!s) return <StateBlock title="Unavailable" detail="Settings have not been configured." />

  const social = s.socialLinks ?? {}

  return (
    <div className="pl-page">
      <div className="max-w-3xl mx-auto space-y-14 md:space-y-20">
        <motion.header
          className="space-y-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pl-kicker">About</p>
          <h1 className="pl-display text-[clamp(2.2rem,5vw,3.5rem)]">{s.photographerName}</h1>
          {s.tagline && <p className="pl-lead max-w-xl">{s.tagline}</p>}
        </motion.header>

        {s.biography && (
          <motion.section
            className="space-y-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="pl-kicker">Biography</h2>
            <p className="text-lg text-[var(--color-ink-secondary)] leading-[1.8] whitespace-pre-line">
              {s.biography}
            </p>
          </motion.section>
        )}

        {s.artistStatement && (
          <motion.section
            className="space-y-4 border-t border-[var(--color-rule)] pt-12 md:pt-16"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="pl-kicker">Statement</h2>
            <p className="text-lg text-[var(--color-ink-secondary)] leading-[1.8] whitespace-pre-line">
              {s.artistStatement}
            </p>
          </motion.section>
        )}

        {Object.keys(social).length > 0 && (
          <motion.section
            className="space-y-5 border-t border-[var(--color-rule)] pt-12 md:pt-16"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="pl-kicker">Elsewhere</h2>
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {Object.entries(social).map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    {label}
                    <IconExternal size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
    </div>
  )
}
