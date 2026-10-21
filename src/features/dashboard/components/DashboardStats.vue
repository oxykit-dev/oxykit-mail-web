<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getEmailStats, getDeliverySuccessRate } from '../api/dashboard'
import ApexPieChart from './ApexPieChart.vue'
import { humanizeDate, LoadingOverlay, AppAlert } from '@/shared'
import { useDashboardSignalR } from '../composables/useDashboardSignalR'

const stats = ref()
const delivery = ref()
const apexSeries = ref([0, 0])
const apexLabels = ['Delivered', 'Failed']
const apexColors = ['#43a047', '#e53935']
const hasPieData = ref(true)
const loading = ref(true)
const error = ref('')

const { sentEmails, queuedEmails } = useDashboardSignalR()

const loadData = async () => {
  loading.value = true
  try {
    stats.value = await getEmailStats()
    delivery.value = await getDeliverySuccessRate()
    const sent = delivery.value?.totalSent ?? 0
    const failed = delivery.value?.totalFailed ?? 0
    if (sent === 0 && failed === 0) {
      hasPieData.value = false
    } else {
      hasPieData.value = true
    }
    apexSeries.value = [sent, failed]
  } catch {
    error.value = 'Failed to load stats'
  } finally {
    loading.value = false
  }
}

watch([sentEmails, queuedEmails], async ([sent, queued]) => {
  if (sent.length > 0 || queued.length > 0) {
    await loadData()
  }
})

onMounted(async () => {
  await loadData()
})
</script>
<template>
  <v-card class="mb-4 position-relative" elevation="2" style="min-height: 260px">
    <v-card-title> Email Stats </v-card-title>
    <v-card-text>
      <div style="position: relative">
        <AppAlert v-if="error" type="error" :message="error" />
        <v-row v-else>
          <v-col cols="12" md="6">
            <template v-if="hasPieData">
              <div style="width: 100%; display: flex; align-items: center; justify-content: center">
                <ApexPieChart
                  :series="apexSeries"
                  :labels="apexLabels"
                  :colors="apexColors"
                  width="100%"
                  style="max-width: 340px; min-width: 180px; width: 100%"
                />
              </div>
            </template>
            <v-alert v-else type="info" class="mt-4" border="start" color="info" dense>
              No delivery data to display.
            </v-alert>
          </v-col>
          <v-col cols="12" md="6">
            <div>Total Sent: {{ stats?.totalEmailsSent ?? 0 }}</div>
            <div>Total Failed: {{ stats?.totalEmailsFailed ?? 0 }}</div>
            <div>Total Queued: {{ stats?.totalEmailsQueued ?? 0 }}</div>
            <div>
              Last Sent:
              <span
                v-if="
                  stats?.lastEmailSentAt && new Date(stats.lastEmailSentAt).getFullYear() > 2000
                "
              >
                {{ humanizeDate(stats.lastEmailSentAt) }}
              </span>
              <span v-else> Never </span>
            </div>
            <div>Delivery Success Rate: {{ delivery?.successRate ?? 0 }}%</div>
            <div>Delivered: {{ delivery?.totalSent ?? 0 }}</div>
            <div>Failed: {{ delivery?.totalFailed ?? 0 }}</div>
          </v-col>
        </v-row>
        <LoadingOverlay :loading="loading" />
      </div>
    </v-card-text>
  </v-card>
</template>
