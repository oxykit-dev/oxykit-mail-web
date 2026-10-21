<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/shared/components/layout/AppNavbar.vue'
import { useDashboardSignalR } from '@/features/dashboard'
import { ref, watch } from 'vue'
import { SendEmailForm } from '@/features/email'
import { useAuthStore } from '@/features/identity'

const { connect, disconnect } = useDashboardSignalR()
const showSendEmail = ref(false)
const auth = useAuthStore()

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) void connect()
    else void disconnect()
  },
  { immediate: true },
)
</script>

<template>
  <v-app>
    <AppNavbar />
    <RouterView />
    <template v-if="auth.canSendEmail">
      <v-btn
        color="primary"
        class="fab-send-email"
        icon
        size="large"
        style="position: fixed; bottom: 32px; right: 32px; z-index: 1000"
        @click="showSendEmail = true"
        aria-label="Send Email"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
      <v-dialog v-model="showSendEmail" max-width="1200" opacity="0.75">
        <SendEmailForm @close="showSendEmail = false" />
      </v-dialog>
    </template>
  </v-app>
</template>
