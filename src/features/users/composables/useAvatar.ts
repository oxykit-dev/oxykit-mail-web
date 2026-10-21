import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/features/identity'
import { API_BASE_URL } from '@/api/client'

const avatarExists = ref(true)

export function useAvatar() {
  const auth = useAuthStore()
  const getAvatarUserId = () => auth.userId || (auth.user?.userName ?? '')
  const avatarUrl = computed(() => `${API_BASE_URL}/users/${getAvatarUserId()}/avatar`)

  // If user changes, reset avatarExists
  watch(
    () => getAvatarUserId(),
    () => {
      avatarExists.value = true
    },
  )

  function onAvatarError() {
    avatarExists.value = false
  }

  function getInitials(emailOrUserName: string): string {
    if (!emailOrUserName) return ''
    let local = emailOrUserName
    if (emailOrUserName.includes('@')) {
      const split = emailOrUserName.split('@')
      local = split[0] ?? ''
    }
    const parts = local.split('.')
    if (parts.length === 0) return ''
    if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase()
    const first = parts[0]?.[0] ?? ''
    const last = parts[1]?.[0] ?? ''
    return (first + last).toUpperCase()
  }

  return {
    avatarUrl,
    avatarExists,
    onAvatarError,
    getAvatarUserId,
    getInitials,
  }
}
