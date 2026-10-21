<script setup lang="ts">
import { toRef, computed } from 'vue'

// Props for reusability
const props = defineProps({
  data: {
    type: Array,
    required: true,
    // Array of numbers for sparkline
  },
  labels: {
    type: Array,
    default: () => [],
    // Array of strings for x-axis labels
  },
  color: {
    type: String,
    default: '#1976d2',
  },
  title: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  height: {
    type: [String, Number],
    default: 60,
  },
  lineWidth: {
    type: [String, Number],
    default: 3,
  },
  padding: {
    type: [String, Number],
    default: 8,
  },
  caption: {
    type: String,
    default: '',
  },
})

const sparklineData = computed(() => {
  // Ensure only numbers are passed to the sparkline
  const arr = Array.isArray(props.data)
    ? props.data.filter((v): v is number => typeof v === 'number' && !isNaN(v))
    : []
  return arr as number[]
})
const sparklineLabels = toRef(props, 'labels') as unknown as string[]
</script>
<template>
  <div>
    <div v-if="title" class="text-h6 mb-2">{{ title }}</div>
    <v-progress-circular v-if="loading" indeterminate color="primary" class="my-6" size="48" />
    <v-alert v-else-if="error" type="error" class="mb-4" dense border="start" color="error">
      {{ error }}
    </v-alert>
    <v-sparkline
      v-else
      :model-value="sparklineData"
      :color="color"
      :line-width="lineWidth"
      :height="height"
      :padding="padding"
      auto-draw
      :labels="sparklineLabels"
    />
    <div v-if="caption" class="text-caption mt-1">{{ caption }}</div>
  </div>
</template>
