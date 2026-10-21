<script setup lang="ts">
/**
 * Reusable dialog/modal wrapper component
 *
 * Reduces boilerplate for v-dialog with consistent actions and loading states.
 *
 * @example
 * ```vue
 * <AppDialog
 *   v-model="showDialog"
 *   title="Edit User"
 *   :loading="saving"
 *   @confirm="handleSave"
 *   @cancel="handleCancel"
 * >
 *   <YourFormContent />
 * </AppDialog>
 * ```
 */
defineProps<{
  /** Controls dialog visibility (v-model) */
  modelValue: boolean
  /** Dialog title */
  title: string
  /** Maximum width of dialog */
  maxWidth?: string | number
  /** Whether action buttons should show loading state */
  loading?: boolean
  /** Text for confirm button */
  confirmText?: string
  /** Text for cancel button */
  cancelText?: string
  /** Hide the cancel button */
  hideCancel?: boolean
  /** Disable the confirm button */
  disableConfirm?: boolean
  /** Make dialog persistent (no close on backdrop click) */
  persistent?: boolean
}>()

const emit = defineEmits<{
  /** Emitted to update v-model */
  'update:modelValue': [value: boolean]
  /** Emitted when confirm button is clicked */
  confirm: []
  /** Emitted when cancel button is clicked */
  cancel: []
}>()

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :max-width="maxWidth ?? 500"
    :persistent="persistent"
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="!hideCancel" text @click="handleCancel" :disabled="loading">
          {{ cancelText ?? 'Cancel' }}
        </v-btn>
        <v-btn
          color="primary"
          @click="emit('confirm')"
          :loading="loading"
          :disabled="disableConfirm"
        >
          {{ confirmText ?? 'OK' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
