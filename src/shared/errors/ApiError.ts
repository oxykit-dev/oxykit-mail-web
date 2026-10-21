/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Error thrown when user is not authenticated (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * Error thrown when user lacks permissions (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403)
    this.name = 'ForbiddenError'
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

/**
 * Error thrown when resource is not found (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, 404)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Error thrown for validation failures (400, 422)
 */
export class ValidationError extends ApiError {
  constructor(
    message = 'Validation Failed',
    public errors?: Record<string, string[]>,
  ) {
    super(message, 400)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Error thrown when request payload is too large (413)
 */
export class PayloadTooLargeError extends ApiError {
  constructor(
    message = 'Request size exceeds maximum allowed',
    public maxSize?: number,
  ) {
    super(message, 413)
    this.name = 'PayloadTooLargeError'
    Object.setPrototypeOf(this, PayloadTooLargeError.prototype)
  }
}

/**
 * Error thrown when input contains dangerous content (400)
 */
export class InvalidInputError extends ApiError {
  constructor(message = 'Request contains invalid or dangerous content') {
    super(message, 400)
    this.name = 'InvalidInputError'
    Object.setPrototypeOf(this, InvalidInputError.prototype)
  }
}
