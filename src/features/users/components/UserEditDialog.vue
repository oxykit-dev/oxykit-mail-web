<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  createUser,
  updateUser,
  type UserResponse,
  type CreateUserRequest,
} from '../api/users'
import { listAllRoles, listRolesForUser, assignRole, removeRole } from '../api/roles'

interface Props {
  modelValue: boolean
  editingUser: UserResponse | null
  currentUserName: string | null | undefined
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<{ userName: string; email: string; password: string }>({
  userName: '',
  email: '',
  password: '',
})
const editingRoles = ref<string[]>([])
const saving = ref(false)
const allRoles = ref<string[]>([])
const userRoles = ref<string[]>([])
const loadingRoles = ref(false)

// Load all available roles
async function loadRoles() {
  try {
    const { roles } = await listAllRoles()
    allRoles.value = roles
  } catch (error) {
    console.error('Failed to load roles:', error)
  }
}

// Load roles for specific user
async function loadUserRoles(userId: string) {
  loadingRoles.value = true
  try {
    const { roles } = await listRolesForUser(userId)
    userRoles.value = roles
    editingRoles.value = [...roles]
  } catch (error) {
    console.error('Failed to load user roles:', error)
    userRoles.value = []
    editingRoles.value = []
  } finally {
    loadingRoles.value = false
  }
}

// Watch for editingUser changes to populate form and load roles
watch(
  () => props.editingUser,
  (user) => {
    if (user) {
      form.value = { userName: user.userName, email: user.email, password: '' }
      loadUserRoles(user.id)
    } else {
      form.value = { userName: '', email: '', password: '' }
      editingRoles.value = []
      userRoles.value = []
    }
  },
  { immediate: true },
)

// Watch for dialog opening to ensure roles are loaded
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && !props.editingUser) {
      editingRoles.value = []
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

async function save() {
  saving.value = true
  try {
    if (props.editingUser) {
      // Update existing user
      await updateUser(props.editingUser.id, {
        userName: form.value.userName,
        email: form.value.email,
        password: form.value.password || undefined,
      })
      // Update roles if changed
      const userId = props.editingUser.id
      const currentRoles = userRoles.value
      // Assign new roles
      for (const role of editingRoles.value) {
        if (!currentRoles.includes(role)) {
          await assignRole({ userId, role })
        }
      }
      // Remove unchecked roles
      for (const role of currentRoles) {
        if (!editingRoles.value.includes(role)) {
          await removeRole({ userId, role })
        }
      }
    } else {
      // Create new user
      const newUser = await createUser(form.value as CreateUserRequest)
      // Assign roles to new user
      if (newUser && editingRoles.value.length > 0) {
        for (const role of editingRoles.value) {
          await assignRole({ userId: newUser.id, role })
        }
      }
    }
    emit('saved')
    close()
  } catch (error) {
    console.error('Failed to save user:', error)
    // Could emit an error event here if needed
  } finally {
    saving.value = false
  }
}

onMounted(loadRoles)
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card>
      <v-card-title>{{ editingUser ? 'Edit User' : 'Create User' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.userName" label="Username" required />
        <v-text-field v-model="form.email" label="Email" required />
        <v-text-field
          v-model="form.password"
          label="Password"
          type="password"
          :required="!editingUser"
        />
        <div v-if="allRoles.length" class="mt-2">
          <div class="mb-1 font-weight-medium">Roles</div>
          <v-checkbox
            v-for="role in allRoles"
            :key="role"
            :label="role"
            v-model="editingRoles"
            :value="role"
            density="compact"
            hide-details
            :disabled="editingUser && editingUser.userName === currentUserName"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close" :disabled="saving">Cancel</v-btn>
        <v-btn color="primary" @click="save" :loading="saving">
          {{ editingUser ? 'Save' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
