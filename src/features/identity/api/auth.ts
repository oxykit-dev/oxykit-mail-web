// Auth and session API — aligned with OxyKit.Mail /auth and /setup
import { api } from '@/api/client'

export interface MeResponse {
  userName: string | null
  roles: string[]
}

export interface NeedsAdminResponse {
  needsAdmin: boolean
}

export interface CreateAdminRequest {
  userName: string
  email: string
  password: string
}

export interface CreateAdminResponse {
  success: boolean
  error: string | null
}

export interface RefreshTokenRequest {
  refreshToken: string
  deviceId: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}

export interface LoginRequest {
  identifier: string
  password: string
  deviceId: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  userName: string
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>('/auth/me')
  return data
}

export async function getNeedsAdmin(): Promise<NeedsAdminResponse> {
  const { data } = await api.get<NeedsAdminResponse>('/setup/needs-admin')
  return data
}

export async function createAdmin(data: CreateAdminRequest): Promise<CreateAdminResponse> {
  const { data: resp } = await api.post<CreateAdminResponse>('/setup/create-admin', data)
  return resp
}

export async function refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  const { data: resp } = await api.post<RefreshTokenResponse>('/auth/refresh', request, {
    // Avoid interceptor refresh loops on this call
    headers: { 'X-Skip-Auth-Refresh': '1' },
  })
  return resp
}

export async function revokeRefreshToken(data: {
  refreshToken: string
  deviceId: string
}): Promise<void> {
  await api.post('/auth/revoke', data, {
    headers: { 'X-Skip-Auth-Refresh': '1' },
  })
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const { data: resp } = await api.post<LoginResponse>('/auth/login', data, {
    headers: { 'X-Skip-Auth-Refresh': '1' },
  })
  return resp
}
