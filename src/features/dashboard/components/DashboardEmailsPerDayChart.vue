<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { EmailsPerDayResponse } from '../api/dashboard'
import { getEmailsPerDay } from '../api/dashboard'
import ApexLineChart from './ApexLineChart.vue'
import { useDashboardSignalR } from '../composables/useDashboardSignalR'

const emailsPerDay = ref<EmailsPerDayResponse[]>([])
const loading = ref(true)
const error = ref('')

const getDefaultRequest = () => {
  const now = new Date()
  const since = new Date(now)
  since.setDate(now.getDate() - 6)
  return {
    since: since.toISOString(),
    timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

const loadData = async () => {
  loading.value = true
  try {
    emailsPerDay.value = await getEmailsPerDay(getDefaultRequest())
  } catch {
    error.value = 'Failed to load emails per day'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadData()
})

const { sentEmails } = useDashboardSignalR()

watch(sentEmails, async (newSent) => {
  if (newSent.length > 0) {
    await loadData()
  }
})

const data = computed(() => emailsPerDay.value.map((e) => e.emailsSent ?? 0))
const labels = computed(() =>
  emailsPerDay.value.map((e) => {
    if (!e.date) return ''
    const d = new Date(e.date)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }),
)
</script>
<template>
  <v-card class="mb-4 position-relative" elevation="2" style="min-height: 260px">
    <v-card-title> Emails Per Day </v-card-title>
    <v-card-subtitle> Last 7 days </v-card-subtitle>
    <v-card-text>
      <div style="position: relative">
        <v-alert v-if="error" type="error" class="mb-4" dense border="start" color="error">
          {{ error }}
        </v-alert>
        <ApexLineChart
          v-else
          :series="data"
          :labels="labels"
          color="#1976d2"
          style="min-height: 220px"
        />
        <div v-if="loading" class="dashboard-overlay-loading">
          <v-progress-circular indeterminate color="primary" size="48" />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<style src="@/assets/dashboard-overlay-loading.css"></style>
