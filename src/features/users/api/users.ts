// User Management API
import { api } from '@/api/client'

export interface UserResponse {
  id: string
  userName: string
  email: string
  roles?: string[]
}

export interface CreateUserRequest {
  userName: string
  email: string
  password: string
}

export interface UpdateUserRequest {
  userName?: string
  email?: string
  password?: string
}

export async function listUsers(): Promise<UserResponse[]> {
  const resp = await api.get<UserResponse[]>('/users')
  return resp.data
}

export async function createUser(data: CreateUserRequest): Promise<UserResponse> {
  const resp = await api.post<UserResponse>('/users', data)
  return resp.data
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
  const resp = await api.put<UserResponse>(`/users/${id}`, data)
  return resp.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}

// Avatar endpoints
export async function uploadUserAvatar(id: string, file: File): Promise<string> {
  if (!file) throw new Error('No file provided')
  const formData = new FormData()
  formData.append('avatar', file)
  const resp = await api.post<string>(`/users/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return resp.data
}

export async function downloadUserAvatar(id: string): Promise<Blob> {
  const resp = await api.get(`/users/${id}/avatar`, { responseType: 'blob' })
  return resp.data
}

export async function deleteUserAvatar(id: string): Promise<void> {
  await api.delete(`/users/${id}/avatar`)
}
