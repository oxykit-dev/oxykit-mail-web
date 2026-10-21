<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { uploadUserAvatar, deleteUserAvatar } from '../api/users'
import { useAuthStore } from '@/features/identity'
import { useAvatar } from '../composables/useAvatar'

const auth = useAuthStore()
const { avatarUrl, avatarExists, onAvatarError, getAvatarUserId, getInitials } = useAvatar()
const uploading = ref(false)
const uploadError = ref('')
const uploadSuccess = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  if (!auth.isAdmin) return
  fileInputRef.value?.click()
}

onMounted(() => {
  avatarExists.value = true
})

async function onClearAvatar() {
  if (!auth.isAdmin) return
  const userId = getAvatarUserId()
  if (!userId) return
  uploading.value = true
  uploadError.value = ''
  try {
    await deleteUserAvatar(userId)
    avatarExists.value = false
    uploadSuccess.value = false
  } catch {
    uploadError.value = 'Failed to clear avatar.'
  } finally {
    uploading.value = false
  }
}

async function onAvatarChange(e: Event) {
  if (!auth.isAdmin) return
  const files = (e.target as HTMLInputElement).files
  const userId = getAvatarUserId()
  if (!files || files.length === 0 || !userId) return
  const file = files[0] as File
  uploading.value = true
  uploadError.value = ''
  uploadSuccess.value = false
  try {
    await uploadUserAvatar(userId, file)
    uploadSuccess.value = true
    avatarExists.value = true
  } catch {
    uploadError.value = 'Failed to upload avatar.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <v-container class="py-8" style="max-width: 600px">
    <v-card>
      <v-card-title class="text-h5">Profile</v-card-title>
      <v-divider />
      <v-card-text>
        <div class="d-flex align-center mb-6">
          <div class="avatar-wrapper me-6">
            <v-avatar
              size="96"
              :class="{ 'avatar-clickable': auth.isAdmin }"
              @click="triggerFileInput"
              :title="auth.isAdmin ? 'Click to upload avatar' : undefined"
            >
              <template v-if="auth.user?.userName">
                <img
                  v-if="avatarExists"
                  :src="avatarUrl"
                  alt="Avatar"
                  @error="onAvatarError"
                  style="object-fit: cover; width: 100%; height: 100%; border-radius: 50%"
                />
                <span v-else class="initials-avatar">{{
                  getInitials(auth.user?.userName || '')
                }}</span>
              </template>
            </v-avatar>
            <input
              v-if="auth.isAdmin"
              ref="fileInputRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onAvatarChange"
              :disabled="uploading"
            />
            <v-btn
              v-if="auth.isAdmin"
              icon
              color="error"
              class="avatar-delete-btn"
              :disabled="uploading || !avatarExists"
              @click.stop="onClearAvatar"
              title="Clear avatar"
              size="x-small"
            >
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </div>
          <div>
            <div class="text-h6 mb-1">{{ auth.user?.userName }}</div>
            <div class="text-body-2 text-grey-darken-1">{{ auth.user?.roles?.join(', ') }}</div>
          </div>
        </div>

        <div v-if="!auth.isAdmin" class="text-body-2 text-medium-emphasis mb-2">
          Avatar changes require the Admin role.
        </div>
        <div v-if="uploadError" class="error-message mt-2">{{ uploadError }}</div>
        <div v-if="uploadSuccess" class="success-message mt-2">Avatar uploaded!</div>
        <v-divider class="my-6" />
        <div>
          <div class="text-h6 mb-2">Account Settings</div>
          <div class="text-body-2 text-grey-darken-1">
            More profile and account settings coming soon.
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.error-message {
  color: #f44336;
}
.success-message {
  color: #388e3c;
}
.initials-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 2.5rem;
  font-weight: 600;
  color: #fff;
  background: #1976d2;
  border-radius: 50%;
  text-transform: uppercase;
}
.avatar-clickable {
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.avatar-clickable:hover {
  box-shadow: 0 0 0 2px #1976d2;
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
}
.avatar-delete-btn {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 2;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  padding: 0;
  min-width: 24px;
  min-height: 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-delete-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
