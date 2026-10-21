<template>
  <v-app-bar color="primary" dark class="navbar-bg-image">
    <v-toolbar-title class="font-weight-bold">OxyKit Mail</v-toolbar-title>
    <template v-if="auth.isLoggedIn">
      <v-btn variant="text" to="/dashboard" router>Dashboard</v-btn>
      <v-btn v-if="auth.user?.roles?.includes('Admin')" variant="text" to="/users" router>
        User Management
      </v-btn>
      <v-spacer />
      <v-menu location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="32">
              <template v-if="auth.user?.userName">
                <img
                  v-if="avatarExists"
                  :src="avatarUrl"
                  alt="Avatar"
                  @error="onAvatarError"
                  style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%"
                />
                <span v-else class="initials-avatar">
                  {{ getInitials(auth.user?.userName || '') }}
                </span>
              </template>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goTo('/profile')">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goTo('/apikeys')">
            <v-list-item-title>API Keys</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <LogoffButton />
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <v-btn
      icon
      @click="toggleDark"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      class="ms-2"
    >
      <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogoffButton } from '@/features/identity'
import { useAuthStore } from '@/features/identity'
import { useDarkModeToggle } from '@/shared/composables/useDarkModeToggle'
import { useAvatar } from '@/features/users'

const auth = useAuthStore()
const router = useRouter()
const { isDark, toggleDark } = useDarkModeToggle()
const { avatarUrl, avatarExists, onAvatarError, getInitials } = useAvatar()

function goTo(route: string) {
  router.push(route)
}
</script>

<style scoped>
.navbar-bg-image {
  position: relative;
  overflow: hidden;
}
.navbar-bg-image::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('/navbar.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.35;
}
.navbar-bg-image::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--v-theme-background, #121212);
  opacity: 0.5;
  pointer-events: none;
}
.navbar-bg-image > * {
  position: relative;
  z-index: 2;
}
.initials-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: #1976d2;
  border-radius: 50%;
  text-transform: uppercase;
}
</style>
