// API keys — aligned with OxyKit.Mail /apikeys
import { api } from '@/api/client'

/** List/get item (no plain key). */
export interface ApiKeyResponse {
  id: string
  label: string
  createdAt: string
  lastUsedAt: string | null
  /** Present only on create / regenerate. */
  plainApiKey?: string
  userId?: string
}

export interface CreateApiKeyRequest {
  label?: string | null
}

export async function listApiKeys(): Promise<ApiKeyResponse[]> {
  const { data } = await api.get<ApiKeyResponse[]>('/apikeys')
  return data ?? []
}

export async function createApiKey(req: CreateApiKeyRequest): Promise<ApiKeyResponse> {
  const { data } = await api.post<ApiKeyResponse>('/apikeys', { label: req.label })
  return data
}

export async function deleteApiKey(id: string): Promise<void> {
  await api.delete(`/apikeys/${id}`)
}

export async function regenerateApiKey(id: string): Promise<ApiKeyResponse> {
  const { data } = await api.post<ApiKeyResponse>(`/apikeys/${id}/regenerate`)
  return data
}
