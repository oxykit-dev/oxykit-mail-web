<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { MessageLogResponse } from '../api/dashboard'
import { getLatestEmails } from '../api/dashboard'
import { humanizeDate, LoadingOverlay, AppAlert } from '@/shared'
import { useDashboardSignalR } from '../composables/useDashboardSignalR'

const emails = ref<MessageLogResponse[]>([])
const loading = ref(true)
const error = ref('')

const emailHeaders = [
  { title: 'To', value: 'to' },
  { title: 'Subject', value: 'subject' },
  { title: 'Status', value: 'status' },
  { title: 'Sent At', value: 'loggedAt' },
]

const loadData = async () => {
  loading.value = true
  try {
    emails.value = await getLatestEmails()
  } catch {
    error.value = 'Failed to load latest emails'
  } finally {
    loading.value = false
  }
}

const { sentEmails } = useDashboardSignalR()

watch(sentEmails, async (newVal) => {
  if (newVal.length > 0) {
    await loadData()
  }
})

onMounted(async () => {
  await loadData()
})
</script>
<template>
  <v-card class="mb-4" elevation="2">
    <v-card-title> Latest Sent Emails </v-card-title>
    <v-card-text>
      <div style="position: relative">
        <AppAlert v-if="error" type="error" :message="error" />
        <v-data-table
          v-else
          :headers="emailHeaders"
          :items="emails"
          density="compact"
          :items-per-page="5"
          hide-default-footer
        >
          <template #[`item.loggedAt`]="slotProps">
            {{ humanizeDate(slotProps.item.loggedAt ?? '') }}
          </template>
        </v-data-table>
        <LoadingOverlay :loading="loading" />
      </div>
    </v-card-text>
  </v-card>
</template>
