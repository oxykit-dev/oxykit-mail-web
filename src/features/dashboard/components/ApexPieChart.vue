<template>
  <apexchart type="pie" :options="chartOptions" :series="series" />
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'

const props = defineProps<{
  series: number[]
  labels: string[]
  colors?: string[]
}>()

const chartOptions = computed(
  (): ApexOptions => ({
    labels: props.labels,
    colors: props.colors ?? ['#1976d2'],
    legend: { show: false },
    dataLabels: { enabled: true },
  }),
)
</script>

<script lang="ts">
export default {
  components: {
    apexchart: VueApexCharts,
  },
}
</script>
