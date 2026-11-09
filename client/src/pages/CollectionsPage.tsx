import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StateBlock } from '../components/StateBlock'
import { OpticalRule } from '../components/ui/OpticalRule'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { CollectionsResponse } from '../types/api'

export function CollectionsPage() {
  useDocumentTitle('Collections — Photoblog')
  const { data, error, loading } = useApi<CollectionsResponse>('/api/collections')

  if (loading) return <StateBlock title="Loading" detail="Opening collections…" loading />
  if (error) return <StateBlock title="Unable to load" detail={error} />

  const collections = data?.data ?? []

  return (
    <div className="pl-page">
      <div className="max-w-[72rem] mx-auto space-y-12 md:space-y-16">
        <motion.header
          className="max-w-2xl space-y-5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pl-kicker">Collections</p>
          <h1 className="pl-display text-[clamp(2.2rem,5vw,3.5rem)]">Bodies of work</h1>
          <p className="pl-lead max-w-lg">
            Series gathered with intent — each plate a sequence, not a folder.
          </p>
        </motion.header>

        <OpticalRule />

        {collections.length === 0 ? (
          <StateBlock title="No collections" detail="Published series will appear here." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-16">
            {collections.map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(i * 0.07, 0.28),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link to={`/collections/${collection.slug}`} className="pl-plate group">
                  <div className="pl-plate__frame aspect-[3/2]">
                    <span className="pl-plate__index">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="pl-plate__inset" aria-hidden />
                    {collection.coverPhoto ? (
                      <img
                        src={collection.coverPhoto.thumbnailUrl || collection.coverPhoto.imageUrl}
                        alt={collection.coverPhoto.altText || collection.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-tertiary)] text-sm">
                        No cover
                      </div>
                    )}
                  </div>
                  <div className="pl-plate__meta">
                    <h2 className="pl-plate__title">{collection.title}</h2>
                    {collection.description && (
                      <p className="text-[var(--color-ink-secondary)] leading-relaxed line-clamp-2 text-[0.95rem]">
                        {collection.description}
                      </p>
                    )}
                    <p className="pl-plate__count">{collection.publishedPhotoCount} photographs</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
