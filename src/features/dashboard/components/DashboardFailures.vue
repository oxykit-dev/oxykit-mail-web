<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MessageLogResponse } from '../api/dashboard'
import { getMostRecentFailures } from '../api/dashboard'
import { humanizeDate } from '@/shared/utils/date'

const failures = ref<MessageLogResponse[]>([])
const loading = ref(true)
const error = ref('')

const failureHeaders = [
  { title: 'To', value: 'to' },
  { title: 'Subject', value: 'subject' },
  { title: 'Error', value: 'errorMessage' },
  { title: 'Logged At', value: 'loggedAt' },
]

onMounted(async () => {
  loading.value = true
  try {
    failures.value = await getMostRecentFailures()
  } catch {
    error.value = 'Failed to load failures'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <v-card class="mb-4 position-relative" elevation="2" style="min-height: 220px">
    <v-card-title> Most Recent Failures </v-card-title>
    <v-card-text>
      <div style="position: relative">
        <v-alert v-if="error" type="error" class="mb-4" dense border="start" color="error">
          {{ error }}
        </v-alert>
        <v-data-table
          v-else
          :headers="failureHeaders"
          :items="failures"
          density="compact"
          :items-per-page="5"
          hide-default-footer
        >
          <template #[`item.loggedAt`]="{ item }">
            {{ humanizeDate(item.loggedAt ?? '') }}
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
