import { ref, type Ref } from 'vue'

/**
 * Options for configuring async operation behavior
 */
export interface AsyncOperationOptions<T> {
  /** Callback invoked on successful operation */
  onSuccess?: (data: T) => void
  /** Callback invoked on operation error */
  onError?: (error: unknown) => void
  /** Default error message if none provided by error object */
  errorMessage?: string
  /** Optional success message */
  successMessage?: string
  /** Auto-reset error after N milliseconds */
  autoResetError?: number
  /** Auto-reset success after N milliseconds */
  autoResetSuccess?: number
}

/**
 * Composable for managing async operation state (loading, error, success)
 *
 * Eliminates boilerplate for try/catch/finally patterns and state management.
 *
 * @example
 * ```typescript
 * const { loading, error, success, execute } = useAsyncOperation({
 *   errorMessage: 'Failed to load data',
 *   onSuccess: (data) => console.log('Success!', data)
 * })
 *
 * const items = ref([])
 * async function loadItems() {
 *   const result = await execute(() => fetchItems())
 *   if (result) items.value = result
 * }
 * ```
 */
export function useAsyncOperation<T = void>(options?: AsyncOperationOptions<T>) {
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  const data: Ref<T | null> = ref(null)

  /**
   * Execute an async operation with automatic state management
   * @param operation - The async function to execute
   * @returns The result of the operation, or null if it failed
   */
  async function execute(operation: () => Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = ''
    success.value = false

    try {
      const result = await operation()
      data.value = result
      success.value = true

      // Auto-reset success state if configured
      if (options?.autoResetSuccess) {
        setTimeout(() => {
          success.value = false
        }, options.autoResetSuccess)
      }

      options?.onSuccess?.(result)
      return result
    } catch (err) {
      // Extract error message
      let message = options?.errorMessage ?? 'Operation failed'
      if (err instanceof Error) {
        message = err.message
      } else if (typeof err === 'string') {
        message = err
      }

      error.value = message

      // Auto-reset error state if configured
      if (options?.autoResetError) {
        setTimeout(() => {
          error.value = ''
        }, options.autoResetError)
      }

      options?.onError?.(err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset all state to initial values
   */
  function reset() {
    loading.value = false
    error.value = ''
    success.value = false
    data.value = null
  }

  return {
    /** Whether the operation is currently loading */
    loading,
    /** Current error message, empty string if no error */
    error,
    /** Whether the last operation succeeded */
    success,
    /** Result data from the last successful operation */
    data,
    /** Execute an async operation with automatic state management */
    execute,
    /** Reset all state */
    reset,
  }
}
