/**
 * Application configuration
 * Centralized configuration for environment variables and app settings
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL
      ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api/v1`
      : '/api/v1',
  },
  signalR: {
    hubUrl: import.meta.env.VITE_SIGNALR_HUB_URL
      ? import.meta.env.VITE_SIGNALR_HUB_URL.replace(/\/$/, '')
      : 'http://localhost:5026/hubs',
  },
  features: {
    enableSignalR: true,
    enableDarkMode: true,
  },
} as const

export type AppConfig = typeof config
