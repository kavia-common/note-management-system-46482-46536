/**
 * Nuxt configuration for Notes App (Ocean Professional theme)
 */
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Notes - Ocean Professional',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2563EB' },
        { name: 'description', content: 'Modern notes app UI with Nuxt 3' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      // Read from env var NUXT_PUBLIC_API_BASE, default to empty (triggers mock)
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      // Respect other NUXT_PUBLIC_* variables by exposing them (kept optional)
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || '',
      frontendUrl: process.env.NUXT_PUBLIC_FRONTEND_URL || '',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || '',
      nodeEnv: process.env.NUXT_PUBLIC_NODE_ENV || '',
      telemetryDisabled: process.env.NUXT_PUBLIC_NEXT_TELEMETRY_DISABLED || '',
      enableSourceMaps: process.env.NUXT_PUBLIC_ENABLE_SOURCE_MAPS || '',
      port: process.env.NUXT_PUBLIC_PORT || '',
      trustProxy: process.env.NUXT_PUBLIC_TRUST_PROXY || '',
      logLevel: process.env.NUXT_PUBLIC_LOG_LEVEL || '',
      healthcheckPath: process.env.NUXT_PUBLIC_HEALTHCHECK_PATH || '',
      featureFlags: process.env.NUXT_PUBLIC_FEATURE_FLAGS || '',
      experimentsEnabled: process.env.NUXT_PUBLIC_EXPERIMENTS_ENABLED || '',
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
