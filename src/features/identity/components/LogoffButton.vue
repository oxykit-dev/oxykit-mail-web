<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

async function handleLogoff() {
  loading.value = true
  try {
    await auth.revoke()
    router.push('/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-btn color="primary" :loading="loading" @click="handleLogoff"> Log off </v-btn>
</template>
