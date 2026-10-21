<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listUsers, type UserResponse } from '../api/users'

interface Props {
  currentUserName: string | null | undefined
}

interface Emits {
  (e: 'edit', user: UserResponse): void
  (e: 'delete', user: UserResponse): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const users = ref<UserResponse[]>([])
const loading = ref(false)

const headers = [
  { title: 'Username', value: 'userName' },
  { title: 'Email', value: 'email' },
  { title: 'Actions', value: 'actions', sortable: false },
]

async function loadUsers() {
  loading.value = true
  try {
    users.value = await listUsers()
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

defineExpose({ loadUsers })

onMounted(loadUsers)
</script>

<template>
  <v-data-table :headers="headers" :items="users" :loading="loading" density="compact" class="mb-4">
    <template #[`item.actions`]="{ item }">
      <div class="action-btns">
        <v-btn icon size="small" density="compact" color="primary" @click="emit('edit', item)">
          <v-icon size="18">mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          density="compact"
          color="error"
          :disabled="item.userName === currentUserName"
          @click="emit('delete', item)"
        >
          <v-icon size="18">mdi-delete</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped>
.action-btns {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
