import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import type { SettingsResponse } from '../types/api'

/**
 * About page driven entirely by portfolio settings from the API.
 * Why: Bio and statement should be editable later without redeploying the client.
 */
export function AboutPage() {
  const { data, error, loading } = useApi<SettingsResponse>('/api/settings')

  if (loading) return <StateBlock title="Loading" detail="Reading the profile…" />
  if (error) return <StateBlock title="Unable to load" detail={error} />

  const s = data?.data
  if (!s) return <StateBlock title="Unavailable" detail="Settings have not been configured." />

  const social = s.socialLinks ?? {}

  return (
    <div className="px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4">
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">About</p>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {s.photographerName}
          </h1>
          {s.tagline && (
            <p className="text-xl text-[var(--color-ink-muted)] leading-relaxed">{s.tagline}</p>
          )}
        </header>

        {s.biography && (
          <section className="space-y-3">
            <h2
              className="text-sm tracking-[0.16em] uppercase text-[var(--color-ink-subtle)]"
            >
              Biography
            </h2>
            <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed whitespace-pre-line">
              {s.biography}
            </p>
          </section>
        )}

        {s.artistStatement && (
          <section className="space-y-3">
            <h2 className="text-sm tracking-[0.16em] uppercase text-[var(--color-ink-subtle)]">
              Statement
            </h2>
            <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed whitespace-pre-line">
              {s.artistStatement}
            </p>
          </section>
        )}

        {Object.keys(social).length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm tracking-[0.16em] uppercase text-[var(--color-ink-subtle)]">
              Elsewhere
            </h2>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(social).map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm tracking-[0.12em] uppercase text-[var(--color-ink)] border-b border-[var(--color-border)] hover:border-[var(--color-ink)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
