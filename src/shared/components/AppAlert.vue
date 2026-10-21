<script setup lang="ts">
/**
 * Reusable alert component for consistent user feedback
 *
 * @example
 * ```vue
 * <AppAlert v-if="error" type="error" :message="error" dismissible />
 * <AppAlert v-if="success" type="success" message="Operation completed!" />
 * ```
 */
defineProps<{
  /** Alert type determines color and icon */
  type: 'error' | 'success' | 'warning' | 'info'
  /** Message to display */
  message: string
  /** Whether the alert can be dismissed */
  dismissible?: boolean
  /** Use compact density */
  dense?: boolean
  /** Custom title for the alert */
  title?: string
}>()

const emit = defineEmits<{
  /** Emitted when user dismisses the alert */
  dismiss: []
}>()
</script>

<template>
  <v-alert
    :type="type"
    :closable="dismissible"
    :density="dense ? 'compact' : 'default'"
    :title="title"
    class="mb-4"
    border="start"
    @click:close="emit('dismiss')"
  >
    {{ message }}
  </v-alert>
</template>
