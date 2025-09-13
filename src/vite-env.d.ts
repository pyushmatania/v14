/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID: string
  readonly VITE_GA_PROPERTY_ID: string
  readonly VITE_GA_CLIENT_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_PERFORMANCE_DEBUG: string
  readonly VITE_ENABLE_SENTRY: string
  readonly VITE_TMDB_API_KEY: string
  readonly VITE_TMDB_ACCESS_TOKEN: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
