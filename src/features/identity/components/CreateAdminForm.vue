<script setup lang="ts">
import { ref } from 'vue'
import { createAdmin } from '../api/auth'
import type { CreateAdminRequest, CreateAdminResponse } from '../api/auth'
import { AuthCard, useFormValidation, useAsyncOperation, AppAlert } from '@/shared'

const emit = defineEmits(['admin-created'])

const { formRef, rules, validate } = useFormValidation()
const { loading, error, execute } = useAsyncOperation<CreateAdminResponse>({
  errorMessage: 'Failed to create admin',
})

const form = ref<CreateAdminRequest>({ userName: '', email: '', password: '' })

async function handleValidateClick(e?: Event) {
  if (e) e.preventDefault()

  const isValid = await validate()
  if (!isValid) return

  // 200 → { success: true }; validation/setup failures throw via API interceptor
  const resp = await execute(() => createAdmin(form.value))
  if (resp) {
    emit('admin-created')
  }
}
</script>

<template>
  <AuthCard title="Set up admin account">
    <v-form :ref="formRef" @submit.prevent="handleValidateClick">
      <AppAlert v-if="error" type="error" :message="error" class="mb-4" />

      <v-text-field
        v-model="form.userName"
        label="Username"
        :rules="[rules.required('Username')]"
        required
        class="u-mb-4"
        color="primary"
      />
      <v-text-field
        v-model="form.email"
        label="Email"
        :rules="[rules.email]"
        required
        class="u-mb-4"
        color="primary"
      />
      <v-text-field
        v-model="form.password"
        label="Password"
        :rules="[rules.password]"
        type="password"
        required
        class="u-mb-4"
        color="primary"
      />
      <v-btn color="primary" :loading="loading" type="submit" block> Create Admin </v-btn>
    </v-form>
  </AuthCard>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1.25rem;
}
</style>
