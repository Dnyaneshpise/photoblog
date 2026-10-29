/// <reference types="vite/client" />

/**
 * Vite client types for import.meta.env.
 * VITE_* vars are inlined at build time; only public values belong here.
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
