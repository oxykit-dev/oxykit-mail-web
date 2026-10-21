<script setup lang="ts">
import { ref } from 'vue'
import { deleteUser, type UserResponse } from '../api/users'

interface Props {
  modelValue: boolean
  deletingUser: UserResponse | null
  currentUserName: string | null | undefined
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'deleted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const deleting = ref(false)

function close() {
  emit('update:modelValue', false)
}

async function confirm() {
  if (!props.deletingUser) return

  deleting.value = true
  try {
    await deleteUser(props.deletingUser.id)
    emit('deleted')
    close()
  } catch (error) {
    console.error('Failed to delete user:', error)
    // Could emit an error event here if needed
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card>
      <v-card-title>Confirm Delete</v-card-title>
      <v-card-text>
        <template v-if="deletingUser?.userName === currentUserName">
          You cannot delete yourself.
        </template>
        <template v-else>
          Are you sure you want to delete user "{{ deletingUser?.userName }}"?
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close" :disabled="deleting">Cancel</v-btn>
        <v-btn
          v-if="deletingUser?.userName !== currentUserName"
          color="error"
          @click="confirm"
          :loading="deleting"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
