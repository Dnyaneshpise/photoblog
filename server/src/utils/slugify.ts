/**
 * Turns free text into a URL-safe slug.
 * Why: Collections and categories need stable, readable path segments.
 * What: Lowercases, strips accents-ish punctuation, collapses runs of hyphens.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
