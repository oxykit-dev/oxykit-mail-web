<template>
  <apexchart type="line" :options="chartOptions" :series="apexSeries" height="220" />
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { computed } from 'vue'
import type { ApexOptions } from 'apexcharts'

const props = defineProps<{
  series: number[]
  labels: string[]
  color?: string | string[]
  title?: string
}>()

const apexSeries = computed(() => [
  {
    name: props.title ?? 'Emails',
    data: props.series,
  },
])

const chartOptions = computed((): ApexOptions => {
  const colors = Array.isArray(props.color) ? props.color : [props.color ?? '#1976d2']

  return {
    chart: {
      id: 'emails-per-day',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: props.labels,
      labels: { rotate: -45 },
    },
    tooltip: { theme: 'dark' },
    colors,
    dataLabels: { enabled: true },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    title: { text: props.title ?? '', align: 'left', style: { fontSize: '16px' } },
    grid: { padding: { left: 10, right: 10 } },
  }
})
</script>

<script lang="ts">
export default {
  components: {
    apexchart: VueApexCharts,
  },
}
</script>
