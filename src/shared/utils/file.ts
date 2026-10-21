/**
 * File utility functions for handling file operations
 */

/**
 * Format bytes into human-readable file size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "1.5 MB"
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536000) // "1.46 MB"
 * formatBytes(5242880) // "5 MB"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Convert a File object to base64 string
 * @param file - File to convert
 * @returns Promise that resolves to base64 string (without data URI prefix)
 * @throws Error if file reading fails
 * @example
 * const base64 = await fileToBase64(file)
 * // Use in API: { filename: file.name, content: base64, contentType: file.type }
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URI prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new Error('Failed to convert file to base64'))
        return
      }
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Validate file type against allowed types
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types or file extensions
 * @returns true if file type is allowed
 * @example
 * validateFileType(file, ['image/jpeg', 'image/png', '.pdf'])
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    return file.type === type
  })
}

/**
 * Validate file size against maximum
 * @param file - File to validate
 * @param maxSizeBytes - Maximum size in bytes
 * @returns true if file size is within limit
 * @example
 * validateFileSize(file, 5 * 1024 * 1024) // Max 5MB
 */
export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes
}

/**
 * Calculate total size of multiple files
 * @param files - Array of files
 * @returns Total size in bytes
 * @example
 * const total = getTotalFileSize([file1, file2, file3])
 * console.log(formatBytes(total))
 */
export function getTotalFileSize(files: File[]): number {
  return files.reduce((total, file) => total + file.size, 0)
}
