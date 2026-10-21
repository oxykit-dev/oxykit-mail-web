// Role Management API (part of Users aggregate)
import { api } from '@/api/client'

export interface ListAllRolesResponse {
  roles: string[]
}

export interface AssignRoleRequest {
  userId: string
  role: string
}

export interface RemoveRoleRequest {
  userId: string
  role: string
}

export interface ListRolesResponse {
  roles: string[]
}

export async function listAllRoles(): Promise<ListAllRolesResponse> {
  const { data } = await api.get('/roles')
  return data
}

export async function assignRole(req: AssignRoleRequest): Promise<void> {
  await api.post('/users/roles/assign', req)
}

export async function removeRole(req: RemoveRoleRequest): Promise<void> {
  await api.post('/users/roles/remove', req)
}

export async function listRolesForUser(userId: string): Promise<ListRolesResponse> {
  const { data } = await api.get(`/users/roles/list/${userId}`)
  return data
}
