<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DeadLetteredEmailResponse } from '../api/dashboard'
import { getDeadLetteredEmails } from '../api/dashboard'
import { humanizeDate } from '@/shared/utils/date'

const deadLettered = ref<DeadLetteredEmailResponse[]>([])
const loading = ref(true)
const error = ref('')

const deadLetteredHeaders = [
  { title: 'To', value: 'to' },
  { title: 'Subject', value: 'subject' },
  { title: 'Reason', value: 'deadLetterReason' },
  { title: 'Created At', value: 'createdAt' },
]

onMounted(async () => {
  loading.value = true
  try {
    deadLettered.value = await getDeadLetteredEmails()
  } catch {
    error.value = 'Failed to load dead-lettered emails'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <v-card class="mb-4 position-relative" elevation="2" style="min-height: 220px">
    <v-card-title>Dead-Lettered Emails</v-card-title>
    <v-card-text>
      <div style="position: relative">
        <v-alert v-if="error" type="error" class="mb-4" dense border="start" color="error">
          {{ error }}
        </v-alert>
        <v-data-table
          v-else
          :headers="deadLetteredHeaders"
          :items="deadLettered"
          density="compact"
          :items-per-page="5"
          hide-default-footer
        >
          <template #[`item.createdAt`]="{ item }">
            {{ humanizeDate(item.createdAt ?? '') }}
          </template>
        </v-data-table>
        <div v-if="loading" class="dashboard-overlay-loading">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<style src="@/assets/dashboard-overlay-loading.css"></style>
