import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { config } from '@/shared/config'
import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  PayloadTooLargeError,
  InvalidInputError,
} from '@/shared/errors'

const API_BASE_URL = config.api.baseUrl

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = error.config as RetryConfig | undefined
    const skipRefresh = original?.headers?.['X-Skip-Auth-Refresh'] === '1'

    if (status === 401 && original && !original._retry && !skipRefresh) {
      original._retry = true
      try {
        const { useAuthStore } = await import('@/features/identity')
        const auth = useAuthStore()
        if (await auth.refreshSession()) {
          const token = auth.token
          if (token) {
            original.headers = original.headers ?? {}
            original.headers.Authorization = `Bearer ${token}`
          }
          return api.request(original)
        }
      } catch {
        // fall through to typed error
      }
    }

    const data = error.response?.data as {
      message?: string
      errors?: Record<string, string[]>
      errorType?: string
      maxSize?: number
    }

    if (status === 401) {
      throw new UnauthorizedError(data?.message || 'Authentication required')
    }

    if (status === 403) {
      throw new ForbiddenError(data?.message || 'Access denied')
    }

    if (status === 404) {
      throw new NotFoundError(data?.message || 'Resource not found')
    }

    if (status === 413) {
      throw new PayloadTooLargeError(
        data?.message || 'Request size exceeds maximum allowed',
        data?.maxSize,
      )
    }

    if (status === 400) {
      if (
        data?.errorType === 'InvalidInput' ||
        data?.message?.toLowerCase().includes('dangerous') ||
        data?.message?.toLowerCase().includes('invalid input')
      ) {
        throw new InvalidInputError(
          data?.message || 'Request contains invalid or dangerous content',
        )
      }
      throw new ValidationError(data?.message || 'Validation failed', data?.errors)
    }

    if (status === 422) {
      throw new ValidationError(data?.message || 'Validation failed', data?.errors)
    }

    throw new ApiError(
      data?.message || error.message || 'An unexpected error occurred',
      status,
      data,
    )
  },
)

export { API_BASE_URL }
