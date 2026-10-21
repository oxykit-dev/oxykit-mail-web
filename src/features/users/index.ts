// Users Feature Module
// Public API for the Users bounded context (includes user management, roles, avatars, profiles)

// API - Users
export * from './api/users'

// API - Roles (part of Users aggregate)
export * from './api/roles'

// Composables
export * from './composables/useAvatar'

// Views
export { default as UsersView } from './views/UsersView.vue'
export { default as ProfileView } from './views/ProfileView.vue'

// Components (private - only exported for feature use)
// Not exported: UserList, UserEditDialog, UserDeleteDialog (internal only)
