import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StateBlock } from '../components/StateBlock'
import { IconExternal } from '../components/icons/PhotologIcons'
import { useApi } from '../hooks/useApi'
import { useSeoMeta } from '../hooks/useSeoMeta'
import type { SettingsResponse } from '../types/api'

/**
 * About — biography, statement, and elsewhere links from portfolio settings.
 */
export function AboutPage() {
  const { data, error, loading } = useApi<SettingsResponse>('/api/settings')
  const s = data?.data

  useSeoMeta({
    title: s ? `About — ${s.photographerName}` : 'About — Photoblog',
    description: s?.biography || s?.tagline || 'About the photographer.',
    image: s?.profileImageUrl,
  })

  if (loading) return <StateBlock title="Loading" detail="Reading the profile…" loading />
  if (error) return <StateBlock title="Unable to load" detail={error} />
  if (!s) return <StateBlock title="Unavailable" detail="Settings have not been configured." />

  const social = s.socialLinks ?? {}

  return (
    <div className="pl-page">
      <div className="max-w-3xl mx-auto space-y-14 md:space-y-20">
        <motion.header
          className="pl-page-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pl-kicker">About</p>
          <h1 className="pl-display">{s.photographerName}</h1>
          {s.tagline && <p className="pl-lead">{s.tagline}</p>}
          {s.profileImageUrl && (
            <div className="pt-4 max-w-sm">
              <div className="aspect-[4/5] overflow-hidden bg-[var(--color-surface)]">
                <img
                  src={s.profileImageUrl}
                  alt={s.photographerName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
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
            className="space-y-4 border-t border-[var(--color-rule)] pt-12 md:pt-16"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="pl-kicker">Elsewhere</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {Object.entries(social).map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)]"
                  >
                    {label}
                    <IconExternal size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        <div className="pt-4">
          <Link to="/contact" className="pl-btn inline-flex">
            Write a note
          </Link>
        </div>
      </div>
    </div>
  )
}
