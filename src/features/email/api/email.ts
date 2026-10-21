// Email send — aligned with OxyKit.Mail /email/send (Admin, Sender)
import { api } from '@/api/client'

export interface SendEmailRequest {
  to: string
  cc: string
  bcc: string
  subject: string
  body: string
  isHtml: boolean
  attachments?: AttachmentRequest[] | null
  scheduledFor?: string | null
}

export interface AttachmentRequest {
  fileName: string
  content: string
  contentType: string
}

/** Mail delivery-acceptance statuses (do not re-send on accepted). */
export type SendEmailStatus = 'sent' | 'accepted' | 'scheduled'

export interface SendEmailResponse {
  emailId: string
  status: SendEmailStatus
  message: string
}

export async function sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
  if (!data.to || !data.subject || !data.body) {
    throw new Error('Missing required fields: to, subject, or body')
  }
  const payload: SendEmailRequest = {
    to: data.to,
    cc: data.cc ?? '',
    bcc: data.bcc ?? '',
    subject: data.subject,
    body: data.body,
    isHtml: data.isHtml ?? true,
    attachments: data.attachments ?? null,
    scheduledFor: data.scheduledFor ?? null,
  }
  const { data: resp } = await api.post<SendEmailResponse>('/email/send', payload)
  if (!resp?.emailId || !resp.status) {
    throw new Error('Mail accepted the request without a valid emailId/status')
  }
  return resp
}
