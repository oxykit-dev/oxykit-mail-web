<script setup lang="ts">
import { ref, computed } from 'vue'
import { sendEmail } from '../api/email'
import type { AttachmentRequest } from '../api/email'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useAsyncOperation, AppAlert, formatBytes, fileToBase64 } from '@/shared'

// Size limits (in bytes)
const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_BODY_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024 // 5MB per attachment

const form = ref({
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  isHtml: true, // Quill produces HTML
  attachments: [] as AttachmentRequest[],
  scheduledFor: null as string | null,
})
const showCcBcc = ref(false)
const selectedFiles = ref<File[]>([])
const fileInputKey = ref(0) // For clearing file input

// Size validation
const bodySize = computed(() => new Blob([form.value.body]).size)
const isBodyTooLarge = computed(() => bodySize.value > MAX_BODY_SIZE)

const attachmentSizes = computed(() =>
  selectedFiles.value.map((file) => ({
    name: file.name,
    size: file.size,
    isTooLarge: file.size > MAX_ATTACHMENT_SIZE,
  })),
)

const totalAttachmentsSize = computed(() =>
  selectedFiles.value.reduce((sum, file) => sum + file.size, 0),
)

const totalSize = computed(() => bodySize.value + totalAttachmentsSize.value)
const isTotalTooLarge = computed(() => totalSize.value > MAX_TOTAL_SIZE)

const hasOversizedAttachments = computed(() => attachmentSizes.value.some((a) => a.isTooLarge))

const canSubmit = computed(
  () => !isBodyTooLarge.value && !hasOversizedAttachments.value && !isTotalTooLarge.value,
)

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  selectedFiles.value = Array.from(input.files)

  // Convert files to base64 for attachments
  try {
    form.value.attachments = await Promise.all(
      selectedFiles.value.map(async (file) => {
        const content = await fileToBase64(file)
        return {
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          content,
        }
      }),
    )
  } catch {
    sendOp.error.value = 'Failed to process file attachments'
    selectedFiles.value = []
    form.value.attachments = []
    fileInputKey.value++ // Reset file input
  }
}

// Use async operation for sending
const sendOp = useAsyncOperation<void>({
  onSuccess: () => {
    setTimeout(() => {
      emit('close')
    }, 1200)
  },
})

const emit = defineEmits(['close'])

async function handleSend() {
  // Validate sizes before sending
  if (!canSubmit.value) {
    sendOp.error.value = 'Please fix size errors before sending'
    return
  }

  await sendOp.execute(async () => {
    // Prepare scheduled time
    if (form.value.scheduledFor) {
      const dt = new Date(form.value.scheduledFor)
      form.value.scheduledFor = dt.toISOString()
    } else {
      form.value.scheduledFor = null
    }

    const result = await sendEmail(form.value)
    successMessage.value =
      result.message ||
      (result.status === 'sent'
        ? 'Email sent successfully!'
        : result.status === 'scheduled'
          ? 'Email scheduled successfully!'
          : 'Email accepted for delivery!')
  })
}

const successMessage = ref('Email accepted for delivery!')

</script>

<template>
  <transition name="fade-email-form">
    <v-card
      v-if="true"
      max-width="900"
      min-width="500"
      class="mx-auto my-12 pa-0 position-relative"
      elevation="10"
      style="border-radius: 14px; overflow: hidden; min-width: 500px"
    >
      <v-btn
        icon
        class="close-btn"
        size="x-small"
        @click="$emit('close')"
        style="
          position: absolute;
          top: 4px;
          right: 4px;
          z-index: 2;
          background: #f5f5f7;
          color: #222;
          width: 28px;
          height: 28px;
          min-width: 28px;
          min-height: 28px;
          padding: 0;
        "
      >
        <v-icon color="#222" size="18">mdi-close</v-icon>
      </v-btn>
      <v-form @submit.prevent="handleSend">
        <div class="px-6 pt-5 pb-2">
          <v-row dense>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="form.to"
                label="To"
                required
                variant="underlined"
                class="mb-1"
              />
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
              <v-btn size="small" variant="text" @click="showCcBcc = !showCcBcc" class="ml-1">
                <v-icon start>{{ showCcBcc ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                {{ showCcBcc ? 'Hide CC/BCC' : 'Show CC/BCC' }}
              </v-btn>
            </v-col>
            <template v-if="showCcBcc">
              <v-col cols="12" md="6">
                <v-text-field v-model="form.cc" label="CC" variant="underlined" class="mb-1" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.bcc" label="BCC" variant="underlined" class="mb-1" />
              </v-col>
            </template>
            <v-col cols="12">
              <v-text-field
                v-model="form.subject"
                label="Subject"
                required
                variant="underlined"
                class="mb-1"
              />
            </v-col>
            <v-col cols="12" md="6">
              <label for="scheduledFor" class="mb-1 font-weight-medium">
                Schedule for (optional)
              </label>
              <input
                id="scheduledFor"
                type="datetime-local"
                class="v-input__control v-field__input mb-1"
                style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ccc"
                v-model="form.scheduledFor"
                :min="new Date().toISOString().slice(0, 16)"
              />
            </v-col>
          </v-row>
        </div>
        <v-divider />
        <div class="px-6 pt-2 pb-2">
          <v-row dense>
            <v-col cols="12" md="8">
              <div class="d-flex align-center mb-1">
                <v-checkbox
                  v-model="form.isHtml"
                  label="HTML Body?"
                  hide-details
                  density="compact"
                  class="mr-2"
                />
              </div>
              <div v-if="!form.isHtml">
                <v-textarea
                  v-model="form.body"
                  label="Body"
                  required
                  rows="8"
                  class="mb-2 fixed-body-area"
                  style="height: 220px; min-height: 220px; max-height: 220px; resize: none"
                />
              </div>
              <div v-else>
                <label class="mb-1 font-weight-medium">Body (HTML)</label>
                <QuillEditor
                  v-model:content="form.body"
                  contentType="html"
                  theme="snow"
                  class="fixed-body-area"
                  style="
                    height: 220px;
                    min-height: 220px;
                    max-height: 220px;
                    background: var(--v-theme-surface);
                    border-radius: 8px;
                    margin-bottom: 8px;
                    overflow-y: auto;
                  "
                />
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-file-input
                :key="fileInputKey"
                label="Attachments"
                multiple
                show-size
                @change="handleFileChange"
                prepend-icon="mdi-paperclip"
                class="mb-2"
                :error="hasOversizedAttachments"
              />

              <!-- Size indicators -->
              <div class="text-caption mb-2">
                <div>
                  Body: {{ formatBytes(bodySize) }}
                  <span v-if="isBodyTooLarge" class="error-text"
                    >(max {{ formatBytes(MAX_BODY_SIZE) }})</span
                  >
                </div>
                <div v-if="selectedFiles.length > 0">
                  Attachments: {{ formatBytes(totalAttachmentsSize) }}
                </div>
                <div class="font-weight-bold" :class="{ 'error-text': isTotalTooLarge }">
                  Total: {{ formatBytes(totalSize) }} / {{ formatBytes(MAX_TOTAL_SIZE) }}
                </div>
              </div>

              <!-- Attachment size errors -->
              <div v-if="hasOversizedAttachments" class="mb-2">
                <div
                  v-for="att in attachmentSizes.filter((a) => a.isTooLarge)"
                  :key="att.name"
                  class="text-caption error-text"
                >
                  {{ att.name }}: {{ formatBytes(att.size) }} exceeds
                  {{ formatBytes(MAX_ATTACHMENT_SIZE) }}
                </div>
              </div>

              <div class="d-flex flex-column align-end mt-2">
                <v-btn
                  color="primary"
                  :loading="sendOp.loading.value"
                  :disabled="!canSubmit"
                  type="submit"
                  size="large"
                  style="min-width: 120px"
                  class="mb-2"
                >
                  <v-icon start>mdi-send</v-icon>Send
                </v-btn>
              </div>

              <AppAlert
                v-if="sendOp.success.value"
                type="success"
                :message="successMessage"
                class="mt-2"
              />
              <AppAlert
                v-if="sendOp.error.value"
                type="error"
                :message="sendOp.error.value"
                dismissible
                @dismiss="sendOp.error.value = ''"
                class="mt-2"
              />
            </v-col>
          </v-row>
        </div>
      </v-form>
    </v-card>
  </transition>
</template>

<style scoped>
.error-text {
  color: rgb(var(--v-theme-error));
}
.fixed-body-area {
  height: 220px !important;
  min-height: 220px !important;
  max-height: 220px !important;
  resize: none !important;
}
.close-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    background 0.2s,
    color 0.2s;
  border-radius: 50%;
}
.close-btn:hover {
  background: #e0e0e6 !important;
  color: #111 !important;
}
</style>

<style>
.fade-email-form-enter-active,
.fade-email-form-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-email-form-enter-from,
.fade-email-form-leave-to {
  opacity: 0;
}
</style>
