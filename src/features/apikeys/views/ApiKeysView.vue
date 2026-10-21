<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  listApiKeys,
  createApiKey,
  deleteApiKey,
  regenerateApiKey,
} from '../api/apikeys'
import type { ApiKeyResponse } from '../api/apikeys'
import { humanizeDate, useAsyncOperation, AppAlert } from '@/shared'
import { useAuthStore } from '@/features/identity'

const auth = useAuthStore()
/** Create requires Admin; regenerate/delete are owner Bearer (any logged-in user with keys). */
const canCreateKeys = computed(() => auth.isAdmin)

const apiKeys = ref<ApiKeyResponse[]>([])
const newLabel = ref('')

const fetchOperation = useAsyncOperation<ApiKeyResponse[]>({
  errorMessage: 'Failed to load API keys',
})

const createOperation = useAsyncOperation<ApiKeyResponse>({
  errorMessage: 'Failed to create API key',
})

const deleteOperation = useAsyncOperation<void>({
  errorMessage: 'Failed to delete API key',
})

const regenerateOperation = useAsyncOperation<ApiKeyResponse>({
  errorMessage: 'Failed to regenerate API key',
})

async function fetchApiKeys() {
  const result = await fetchOperation.execute(() => listApiKeys())
  if (result) apiKeys.value = result
}

const newApiKey = ref('')
const showKeyDialog = ref(false)

async function handleCreateApiKey() {
  if (!newLabel.value || !canCreateKeys.value) return

  const result = await createOperation.execute(() =>
    createApiKey({ label: newLabel.value }),
  )

  if (result) {
    // Create response includes fields list omits; refresh list for consistent shape
    await fetchApiKeys()
    newApiKey.value = result.plainApiKey || ''
    showKeyDialog.value = true
    newLabel.value = ''
  }
}

async function handleDeleteApiKey(id: string) {
  const result = await deleteOperation.execute(() => deleteApiKey(id))
  if (result !== null) {
    apiKeys.value = apiKeys.value.filter((k) => k.id !== id)
  }
}

async function handleRegenerateApiKey(id: string) {
  const result = await regenerateOperation.execute(() => regenerateApiKey(id))
  if (result) {
    await fetchApiKeys()
    newApiKey.value = result.plainApiKey || ''
    showKeyDialog.value = true
  }
}

const copied = ref(false)
const copyTooltip = ref(false)

const copyApiKey = () => {
  if (typeof window !== 'undefined' && window.navigator?.clipboard && newApiKey.value) {
    void window.navigator.clipboard.writeText(newApiKey.value)
    copied.value = true
    copyTooltip.value = true
    setTimeout(() => {
      copied.value = false
      copyTooltip.value = false
    }, 1500)
  }
}

onMounted(fetchApiKeys)
</script>

<template>
  <v-card max-width="700" class="mx-auto my-8 pa-4">
    <v-card-title>API Key Management</v-card-title>
    <v-card-text>
      <AppAlert
        v-if="
          fetchOperation.error.value ||
          createOperation.error.value ||
          deleteOperation.error.value ||
          regenerateOperation.error.value
        "
        type="error"
        :message="
          fetchOperation.error.value ||
          createOperation.error.value ||
          deleteOperation.error.value ||
          regenerateOperation.error.value
        "
      />

      <AppAlert
        v-if="!canCreateKeys"
        type="info"
        message="Creating new API keys requires the Admin role. You can still regenerate or delete your existing keys."
        class="mb-4"
      />

      <v-form
        v-if="canCreateKeys"
        @submit.prevent="handleCreateApiKey"
        class="mb-4"
      >
        <v-text-field v-model="newLabel" label="New API Key Label" required class="mr-2" />
        <v-btn color="primary" :loading="createOperation.loading.value" type="submit">
          Create API Key
        </v-btn>
      </v-form>

      <v-data-table
        :headers="[
          { title: 'Label', value: 'label' },
          { title: 'Created At', value: 'createdAt' },
          { title: 'Last Used', value: 'lastUsedAt' },
          { title: 'Actions', value: 'actions', sortable: false },
        ]"
        :items="apiKeys"
        density="compact"
        :items-per-page="10"
        hide-default-footer
      >
        <template #item="{ item }">
          <tr>
            <td>{{ item.label }}</td>
            <td>
              <span :title="item.createdAt">
                {{ humanizeDate(item.createdAt) }}
              </span>
            </td>
            <td>
              <span v-if="item.lastUsedAt" :title="item.lastUsedAt">
                {{ humanizeDate(item.lastUsedAt) }}
              </span>
              <span v-else class="text-grey">Never</span>
            </td>
            <td style="white-space: nowrap">
              <div style="display: flex; gap: 12px; align-items: center">
                <v-btn
                  icon
                  color="primary"
                  density="comfortable"
                  @click="handleRegenerateApiKey(item.id)"
                  :loading="regenerateOperation.loading.value"
                  title="Regenerate"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="error"
                  density="comfortable"
                  @click="handleDeleteApiKey(item.id)"
                  :loading="deleteOperation.loading.value"
                  title="Delete"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="showKeyDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">API Key Created</v-card-title>
        <v-card-text>
          <div class="api-key-warning mb-2">
            <v-icon color="warning" class="mr-1">mdi-alert</v-icon>
            <span>This is the only time you will see this key. Copy and store it securely.</span>
          </div>
          <div class="api-key-display">
            <span>{{ newApiKey }}</span>
            <div style="display: flex; align-items: center; gap: 8px">
              <v-tooltip v-model="copyTooltip" location="top" :open-on-hover="false">
                <template #activator="{ props }">
                  <v-btn icon v-bind="props" @click="copyApiKey" title="Copy">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <span>Copied!</span>
              </v-tooltip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showKeyDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.api-key-display {
  font-size: 1.5rem;
  font-family: 'Fira Mono', 'Consolas', monospace;
  background: #f5f5f5;
  border: 2px solid #1976d2;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;
  margin: 1.5rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  word-break: break-all;
  color: #222 !important;
}
.api-key-warning {
  color: #b26a00;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
