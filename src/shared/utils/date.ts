// src/utils/date.ts
export function humanizeDate(dateString: string | number | Date | undefined): string {
  if (!dateString) return ''
  let date: Date
  if (typeof dateString === 'string') {
    // Convert UTC string to local time
    const d = new Date(dateString)
    date = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  } else {
    date = new Date(dateString)
  }
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
  return date.toLocaleString()
}
