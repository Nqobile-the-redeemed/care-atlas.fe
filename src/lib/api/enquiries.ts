import { apiRequest } from './client'
import { appendPublicFormMeta } from './publicForm'

export type EnquirySubmission = {
  name: string
  email: string
  phone?: string
  subject: string
  enquiryType: string
  comment: string
  details: Record<string, unknown>
  consent: boolean
  formStartedAt: number
  sourceUrl: string
  website?: string
  attachments: File[]
  recaptchaToken?: string | null
  recaptchaAction?: string
}

export type EnquiryReceipt = {
  id: string
  status: string
  webSource: string
  receivedAt: string
}

export async function sendEnquiry(payload: EnquirySubmission) {
  const formData = new FormData()

  formData.set('name', payload.name)
  formData.set('email', payload.email)
  formData.set('phone', payload.phone ?? '')
  formData.set('subject', payload.subject)
  formData.set('enquiry_type', payload.enquiryType)
  formData.set('comment', payload.comment)
  formData.set('details', JSON.stringify(payload.details))
  appendPublicFormMeta(formData, payload)

  payload.attachments.forEach(file => formData.append('attachments[]', file))

  return apiRequest<EnquiryReceipt>('/v1/web-queries', {
    method: 'POST',
    body: formData
  })
}
