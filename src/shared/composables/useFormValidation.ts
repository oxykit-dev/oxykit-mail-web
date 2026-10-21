import { ref, type Ref } from 'vue'

/**
 * Validation rule function type - returns true or error message string
 */
export type ValidationRule<T = string> = (value: T) => boolean | string

/**
 * Reusable validation rules for common form fields
 *
 * @example
 * ```typescript
 * const { formRef, rules } = useFormValidation()
 *
 * // In template:
 * <v-text-field :rules="[rules.required('Username')]" />
 * <v-text-field :rules="[rules.email]" />
 * ```
 */
export const validationRules = {
  /**
   * Field is required
   * @param fieldName - Name of the field for error message
   */
  required:
    (fieldName: string = 'Field'): ValidationRule =>
    (v: string) =>
      !!v || `${fieldName} is required`,

  /**
   * Valid email format required
   */
  email: (v: string) => {
    if (!v) return 'Email is required'
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(v) || 'Please enter a valid email address'
  },

  /**
   * Minimum length validation
   * @param length - Minimum required length
   * @param fieldName - Name of the field for error message
   */
  minLength:
    (length: number, fieldName: string = 'Field'): ValidationRule =>
    (v: string) =>
      !v || v.length >= length || `${fieldName} must be at least ${length} characters`,

  /**
   * Maximum length validation
   * @param length - Maximum allowed length
   * @param fieldName - Name of the field for error message
   */
  maxLength:
    (length: number, fieldName: string = 'Field'): ValidationRule =>
    (v: string) =>
      !v || v.length <= length || `${fieldName} must be at most ${length} characters`,

  /**
   * Password validation (min 12 chars, 4 unique chars, no common passwords)
   * Updated to meet security requirements
   */
  password: (v: string) => {
    if (!v) return 'Password is required'
    if (v.length < 12) return 'Password must be at least 12 characters'

    // Check for at least 4 unique characters
    const uniqueChars = new Set(v.split('')).size
    if (uniqueChars < 4) return 'Password must contain at least 4 unique characters'

    // Check against common passwords
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      '1234567890',
      'password1',
      'qwerty123',
      '12345678',
    ]
    if (commonPasswords.some((common) => v.toLowerCase().includes(common))) {
      return 'Password contains common patterns that are not allowed'
    }

    return true
  },

  /**
   * Strong password validation (min 12 chars, uppercase, lowercase, number, special char)
   * Updated to meet enhanced security requirements
   */
  strongPassword: (v: string) => {
    if (!v) return 'Password is required'
    if (v.length < 12) return 'Password must be at least 12 characters'

    // Check for at least 4 unique characters
    const uniqueChars = new Set(v.split('')).size
    if (uniqueChars < 4) return 'Password must contain at least 4 unique characters'

    // Character type requirements
    if (!/[a-z]/.test(v)) return 'Password must contain a lowercase letter'
    if (!/[A-Z]/.test(v)) return 'Password must contain an uppercase letter'
    if (!/[0-9]/.test(v)) return 'Password must contain a number'
    if (!/[^a-zA-Z0-9]/.test(v)) return 'Password must contain a special character'

    // Check against common passwords
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
      '1234567890',
      'password1',
      'qwerty123',
      '12345678',
    ]
    if (commonPasswords.some((common) => v.toLowerCase().includes(common))) {
      return 'Password contains common patterns that are not allowed'
    }

    return true
  },

  /**
   * Match another field value
   * @param otherValue - Ref to the value to match
   * @param fieldName - Name of the field being matched
   */
  matchField:
    (otherValue: Ref<string>, fieldName: string = 'Field'): ValidationRule =>
    (v: string) =>
      v === otherValue.value || `Must match ${fieldName}`,

  /**
   * Numeric value validation
   */
  numeric: (v: string) => {
    if (!v) return true // Allow empty if not required
    return !isNaN(Number(v)) || 'Must be a valid number'
  },

  /**
   * URL validation
   */
  url: (v: string) => {
    if (!v) return true // Allow empty if not required
    try {
      new URL(v)
      return true
    } catch {
      return 'Must be a valid URL'
    }
  },

  /**
   * Custom regex validation
   * @param pattern - Regex pattern to match
   * @param message - Error message if validation fails
   */
  pattern:
    (pattern: RegExp, message: string = 'Invalid format'): ValidationRule =>
    (v: string) =>
      !v || pattern.test(v) || message,
}

/**
 * Composable for form validation with Vuetify forms
 *
 * Provides a form ref and validation utilities for managing form state.
 *
 * @example
 * ```typescript
 * const { formRef, rules, validate, reset } = useFormValidation()
 *
 * async function handleSubmit() {
 *   const isValid = await validate()
 *   if (isValid) {
 *     // Submit form
 *   }
 * }
 *
 * // In template:
 * <v-form ref="formRef" @submit.prevent="handleSubmit">
 *   <v-text-field :rules="[rules.required('Username')]" />
 * </v-form>
 * ```
 */
export function useFormValidation() {
  const formRef = ref()

  /**
   * Validate the form
   * @returns Promise<boolean> - true if valid, false otherwise
   */
  async function validate(): Promise<boolean> {
    if (!formRef.value) return false
    const result = await formRef.value.validate()
    return result.valid ?? false
  }

  /**
   * Reset the form to initial state
   */
  function reset() {
    formRef.value?.reset()
  }

  /**
   * Reset validation state without clearing values
   */
  function resetValidation() {
    formRef.value?.resetValidation()
  }

  return {
    /** Reference to the v-form component */
    formRef,
    /** Collection of reusable validation rules */
    rules: validationRules,
    /** Validate the form */
    validate,
    /** Reset form to initial state */
    reset,
    /** Reset validation without clearing values */
    resetValidation,
  }
}
