<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getNeedsAdmin } from '../api/auth'
import CreateAdminForm from '../components/CreateAdminForm.vue'
import LoginForm from '../components/LoginForm.vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const needsAdmin = ref<boolean | null>(null)
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    const resp = await getNeedsAdmin()
    needsAdmin.value = resp.needsAdmin ?? null
  } catch {
    needsAdmin.value = false
  }
  await auth.initAuth()
})

watch(
  () => auth.isLoggedIn && needsAdmin.value === false,
  (ready) => {
    if (ready) void router.replace('/dashboard')
  },
)

function handleAdminCreated() {
  needsAdmin.value = false
}
</script>

<template>
  <main>
    <template v-if="needsAdmin === null || auth.isLoading"> Loading... </template>
    <template v-else-if="needsAdmin">
      <CreateAdminForm @admin-created="handleAdminCreated" />
    </template>
    <template v-else-if="!auth.isLoggedIn">
      <LoginForm />
    </template>
    <template v-else>
      <p class="pa-4 text-medium-emphasis">Redirecting…</p>
    </template>
  </main>
</template>
