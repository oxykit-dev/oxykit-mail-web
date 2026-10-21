import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  login as apiLogin,
  getMe,
  refreshToken as apiRefreshToken,
  revokeRefreshToken as apiRevokeRefreshToken,
} from '../api/auth'
import { api } from '@/api/client'
import type { MeResponse, LoginRequest, LoginResponse } from '../api/auth'
import { UnauthorizedError } from '@/shared/errors'
import { getUserIdFromToken } from '@/shared/utils/jwt'

export const useAuthStore = defineStore('auth', () => {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId || deviceId === '') {
    deviceId = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now()
    localStorage.setItem('device_id', deviceId)
  }

  const user = ref<MeResponse | null>(null)
  const token = ref<string | null>(null)
  const refreshTokenValue = ref<string | null>(null)
  const isLoading = ref(false)
  const isLoggedIn = ref(false)
  const loginError = ref<string | null>(null)

  let refreshInFlight: Promise<boolean> | null = null

  const userId = computed(() => getUserIdFromToken(token.value))

  const isAdmin = computed(() => user.value?.roles?.includes('Admin') ?? false)

  const canSendEmail = computed(
    () =>
      user.value?.roles?.includes('Admin') === true ||
      user.value?.roles?.includes('Sender') === true,
  )

  function hasRole(...roles: string[]): boolean {
    const userRoles = user.value?.roles ?? []
    return roles.some((role) => userRoles.includes(role))
  }

  function setToken(
    newToken: string | null,
    newRefreshToken?: string | null,
    userName?: string | null,
  ) {
    token.value = newToken
    if (newToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      localStorage.setItem('auth_token', newToken)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('auth_token')
    }
    if (typeof newRefreshToken !== 'undefined') {
      refreshTokenValue.value = newRefreshToken
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken)
      } else {
        localStorage.removeItem('refresh_token')
      }
    }
    if (userName && userName !== '') {
      localStorage.setItem('auth_user', userName)
    } else if (newToken === null) {
      localStorage.removeItem('auth_user')
    }
  }

  function clearSession() {
    setToken(null, null, null)
    user.value = null
    isLoggedIn.value = false
  }

  /** Rotate access + refresh tokens. Single-flight safe for interceptor retries. */
  async function refreshSession(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight

    refreshInFlight = (async () => {
      const currentRefresh = refreshTokenValue.value
      if (!currentRefresh || !deviceId) return false

      try {
        const resp = await apiRefreshToken({
          deviceId,
          refreshToken: currentRefresh,
        })
        const storedUserName = localStorage.getItem('auth_user') || user.value?.userName || ''
        // Backend revokes the old refresh token — always store the new one.
        setToken(resp.token, resp.refreshToken, storedUserName || null)
        return !!resp.token
      } catch {
        clearSession()
        return false
      } finally {
        refreshInFlight = null
      }
    })()

    return refreshInFlight
  }

  async function login(credentials: Omit<LoginRequest, 'deviceId'>): Promise<boolean> {
    isLoading.value = true
    loginError.value = null
    try {
      const resp: LoginResponse = await apiLogin({
        identifier: credentials.identifier,
        password: credentials.password,
        deviceId: deviceId || '',
      })
      if (resp.token) {
        setToken(resp.token, resp.refreshToken, resp.userName)
        await fetchUser()
        isLoggedIn.value = true
        return true
      }
      loginError.value = 'Invalid credentials'
      clearSession()
      return false
    } catch {
      loginError.value = 'Login failed'
      clearSession()
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(allowRefresh = true) {
    isLoading.value = true
    try {
      const me = await getMe()
      user.value = me
      isLoggedIn.value = true
      if (me.userName) localStorage.setItem('auth_user', me.userName)
    } catch (e: unknown) {
      const isUnauthorized =
        e instanceof UnauthorizedError ||
        (e instanceof Error && 'statusCode' in e && (e as { statusCode?: number }).statusCode === 401)

      if (allowRefresh && isUnauthorized && refreshTokenValue.value) {
        const refreshed = await refreshSession()
        if (refreshed) {
          await fetchUser(false)
          return
        }
      }
      clearSession()
    } finally {
      isLoading.value = false
    }
  }

  async function revoke() {
    if (refreshTokenValue.value && deviceId) {
      try {
        await apiRevokeRefreshToken({ refreshToken: refreshTokenValue.value, deviceId })
      } catch {
        // still clear local session
      }
    }
    clearSession()
  }

  async function initAuth() {
    if (typeof window === 'undefined') return
    const savedToken = localStorage.getItem('auth_token')
    const savedRefreshToken = localStorage.getItem('refresh_token')
    const savedUserName = localStorage.getItem('auth_user')
    if (savedToken && savedRefreshToken && savedUserName) {
      setToken(savedToken, savedRefreshToken, savedUserName)
      await fetchUser()
    } else {
      clearSession()
    }
  }

  return {
    user,
    token,
    userId,
    isLoading,
    isLoggedIn,
    loginError,
    isAdmin,
    canSendEmail,
    hasRole,
    login,
    revoke,
    fetchUser,
    initAuth,
    refreshSession,
  }
})
