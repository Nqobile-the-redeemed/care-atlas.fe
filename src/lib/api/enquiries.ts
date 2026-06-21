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
  formData.set('enquiryType', payload.enquiryType)
  formData.set('comment', payload.comment)
  formData.set('details', JSON.stringify(payload.details))
  formData.set('consent', payload.consent ? '1' : '0')
  formData.set('formStartedAt', String(payload.formStartedAt))
  formData.set('sourceUrl', payload.sourceUrl)
  formData.set('webSource', WEB_SOURCE)
  formData.set('website', payload.website ?? '')

  payload.attachments.forEach(file => formData.append('attachments[]', file))

  return apiRequest<EnquiryReceipt>('/v1/web-queries', {
    method: 'POST',
    body: formData
  })
}
