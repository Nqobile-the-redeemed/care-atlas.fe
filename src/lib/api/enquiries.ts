import { apiRequest } from './client'

export type EnquirySubmission = {
  name: string
  email: string
  phone?: string
  subject: string
  enquiryType: string
  comment: string
  details: Record<string, string>
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

const WEB_SOURCE = process.env.NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE ?? 'careatlas.co.uk'

export async function sendEnquiry(payload: EnquirySubmission) {
  const formData = new FormData()

  formData.set('name', payload.name)
  formData.set('email', payload.email)
  formData.set('phone', payload.phone ?? '')
  formData.set('subject', payload.subject)
  formData.set('enquiry_type', payload.enquiryType)
  formData.set('comment', payload.comment)
  formData.set('details', JSON.stringify(payload.details))
  formData.set('consent', payload.consent ? '1' : '0')
  formData.set('form_started_at', String(payload.formStartedAt))
  formData.set('source_url', payload.sourceUrl)
  formData.set('web_source', WEB_SOURCE)
  formData.set('website', payload.website ?? '')

  if (payload.recaptchaToken) {
    formData.set('recaptcha_token', payload.recaptchaToken)
    formData.set('recaptcha_action', payload.recaptchaAction ?? 'care_atlas_enquiry')
  }

  payload.attachments.forEach(file => formData.append('attachments[]', file))

  return apiRequest<EnquiryReceipt>('/v1/web-queries', {
    method: 'POST',
    body: formData
  })
}
