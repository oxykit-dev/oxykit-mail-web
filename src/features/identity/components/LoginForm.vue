<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { AuthCard, useFormValidation, AppAlert } from '@/shared'

const auth = useAuthStore()
const { formRef, rules, validate } = useFormValidation()
const form = ref({ identifier: '', password: '' })

async function handleLogin(e?: Event) {
  if (e) e.preventDefault()

  const isValid = await validate()
  if (!isValid) return

  await auth.login(form.value)
}
</script>

<template>
  <AuthCard title="Sign in" :elevation="4">
    <v-form :ref="formRef" @submit.prevent="handleLogin">
      <AppAlert v-if="auth.loginError" type="error" :message="auth.loginError" />

      <v-text-field
        v-model="form.identifier"
        label="Username or Email"
        :rules="[rules.required('Username or Email')]"
        required
        class="u-mb-4"
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        type="password"
        :rules="[rules.required('Password')]"
        required
        class="u-mb-4"
      />
      <v-btn color="primary" variant="flat" :loading="auth.isLoading" type="submit" block>
        Login
      </v-btn>
    </v-form>
  </AuthCard>
</template>

<style scoped>
/* Local overrides kept minimal; most layout is provided by shared styles */
.u-mb-4 {
  margin-bottom: 1.25rem;
}
</style>
