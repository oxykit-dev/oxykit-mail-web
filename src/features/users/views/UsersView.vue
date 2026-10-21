<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserResponse } from '../api/users'
import { useAuthStore } from '@/features/identity'

import UserList from '../components/UserList.vue'
import UserEditDialog from '../components/UserEditDialog.vue'
import UserDeleteDialog from '../components/UserDeleteDialog.vue'

// Dialog state
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const editingUser = ref<UserResponse | null>(null)
const deletingUser = ref<UserResponse | null>(null)

// Component refs
const userListRef = ref<InstanceType<typeof UserList>>()

// Auth
const auth = useAuthStore()
const currentUserName = computed(() => auth.user?.userName)

// User actions
function handleEditUser(user: UserResponse) {
  editingUser.value = user
  showEditDialog.value = true
}

function handleCreateUser() {
  editingUser.value = null
  showEditDialog.value = true
}

function handleDeleteUser(user: UserResponse) {
  deletingUser.value = user
  showDeleteDialog.value = true
}

async function handleUserSaved() {
  await userListRef.value?.loadUsers()
}

async function handleUserDeleted() {
  await userListRef.value?.loadUsers()
}
</script>

<template>
  <v-card class="ma-4 pa-4">
    <v-card-title>
      User Management
      <v-spacer />
      <v-btn color="primary" @click="handleCreateUser">Create User</v-btn>
    </v-card-title>

    <UserList
      ref="userListRef"
      :current-user-name="currentUserName"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
    />

    <UserEditDialog
      v-model="showEditDialog"
      :editing-user="editingUser"
      :current-user-name="currentUserName"
      @saved="handleUserSaved"
    />

    <UserDeleteDialog
      v-model="showDeleteDialog"
      :deleting-user="deletingUser"
      :current-user-name="currentUserName"
      @deleted="handleUserDeleted"
    />
  </v-card>
</template>
