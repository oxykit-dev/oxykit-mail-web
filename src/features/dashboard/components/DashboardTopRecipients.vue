<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TopRecipientResponse } from '../api/dashboard'
import { getTopRecipients } from '../api/dashboard'

const topRecipients = ref<TopRecipientResponse[]>([])
const loading = ref(true)
const error = ref('')

const topRecipientsHeaders = [
  { title: 'Recipient', value: 'recipient' },
  { title: 'Emails Received', value: 'emailsReceived' },
]

onMounted(async () => {
  loading.value = true
  try {
    topRecipients.value = await getTopRecipients()
  } catch {
    error.value = 'Failed to load top recipients'
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <v-card class="mb-4 position-relative" elevation="2" style="min-height: 220px">
    <v-card-title>Top Recipients</v-card-title>
    <v-card-text>
      <div style="position: relative">
        <v-alert v-if="error" type="error" class="mb-4" dense border="start" color="error">
          {{ error }}
        </v-alert>
        <v-data-table
          v-else
          :headers="topRecipientsHeaders"
          :items="topRecipients"
          density="compact"
          :items-per-page="5"
          hide-default-footer
        />
        <div v-if="loading" class="dashboard-overlay-loading">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<style src="@/assets/dashboard-overlay-loading.css"></style>
