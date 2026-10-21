// Dashboard API — aligned with OxyKit.Mail /dashboard
import { api } from '@/api/client'

export interface DeadLetteredEmailResponse {
  id: string
  from: string
  to: string
  subject: string
  createdAt: string
  deadLetterReason: string
}

export interface DeliverySuccessRateResponse {
  successRate?: number | null
  totalSent?: number | null
  totalFailed?: number | null
}

export interface EmailsPerDayRequest {
  since?: string | null
  timeZoneId?: string | null
}

export interface EmailsPerDayResponse {
  date?: string | null
  emailsSent?: number | null
}

export interface EmailStatsResponse {
  totalEmailsSent?: number | null
  totalEmailsFailed?: number | null
  totalEmailsQueued?: number | null
  lastEmailSentAt?: string | null
}

export interface MessageLogResponse {
  id: string
  messageId: string
  subject: string
  to: string
  from: string
  errorMessage?: string | null
  status: string
  loggedAt: string
}

export interface TopRecipientResponse {
  recipient: string
  emailsReceived: number
}

export async function getDeadLetteredEmails(): Promise<DeadLetteredEmailResponse[]> {
  const { data } = await api.get<DeadLetteredEmailResponse[]>('/dashboard/dead-lettered-emails')
  return data ?? []
}

export async function getDeliverySuccessRate(): Promise<DeliverySuccessRateResponse> {
  const { data } = await api.get<DeliverySuccessRateResponse>('/dashboard/delivery-success-rate')
  return data ?? {}
}

export async function getEmailsPerDay(
  request: EmailsPerDayRequest,
): Promise<EmailsPerDayResponse[]> {
  const { data } = await api.get<EmailsPerDayResponse[]>('/dashboard/emails-per-day', {
    params: request,
  })
  return data ?? []
}

export async function getEmailStats(): Promise<EmailStatsResponse> {
  const { data } = await api.get<EmailStatsResponse>('/dashboard/email-stats')
  return data ?? {}
}

export async function getLatestEmails(): Promise<MessageLogResponse[]> {
  const { data } = await api.get<MessageLogResponse[]>('/dashboard/latest-emails')
  return data ?? []
}

export async function getMostRecentFailures(): Promise<MessageLogResponse[]> {
  const { data } = await api.get<MessageLogResponse[]>('/dashboard/most-recent-failures')
  return data ?? []
}

/** Admin only. */
export async function getTopRecipients(): Promise<TopRecipientResponse[]> {
  const { data } = await api.get<TopRecipientResponse[]>('/dashboard/top-recipients')
  return data ?? []
}
