<script setup lang="ts">
/**
 * Loading overlay component that displays a centered spinner
 *
 * Typically used within a positioned parent (position: relative)
 * to overlay loading state on top of content.
 *
 * @example
 * ```vue
 * <div style="position: relative">
 *   <YourContent />
 *   <LoadingOverlay :loading="isLoading" />
 * </div>
 * ```
 */
defineProps<{
  /** Whether to show the loading overlay */
  loading: boolean
  /** Size of the progress spinner */
  size?: number | string
  /** Color of the spinner */
  color?: string
  /** Background opacity (0-1) */
  opacity?: number
}>()
</script>

<template>
  <transition name="fade">
    <div
      v-if="loading"
      class="loading-overlay"
      :style="{ backgroundColor: `rgba(255, 255, 255, ${opacity ?? 0.8})` }"
    >
      <v-progress-circular indeterminate :color="color ?? 'primary'" :size="size ?? 48" />
    </div>
  </transition>
</template>

<style scoped>
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
