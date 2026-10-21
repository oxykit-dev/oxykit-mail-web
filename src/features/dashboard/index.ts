// Dashboard Feature Module
// Public API for the Dashboard bounded context (analytics, stats, charts, real-time updates)

// API
export * from './api/dashboard'

// Composables
export * from './composables/useDashboardSignalR'

// Views
export { default as DashboardView } from './views/DashboardView.vue'

// Components (exported for external use)
export { default as DashboardStats } from './components/DashboardStats.vue'
export { default as DashboardEmailsPerDayChart } from './components/DashboardEmailsPerDayChart.vue'
export { default as DashboardLatestEmails } from './components/DashboardLatestEmails.vue'
export { default as DashboardFailures } from './components/DashboardFailures.vue'
export { default as DashboardTopRecipients } from './components/DashboardTopRecipients.vue'
export { default as DeadLetteredEmails } from './components/DeadLetteredEmails.vue'
