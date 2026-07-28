import { apiRequest } from './client'

export type WhatsappIntent = {
  verified: boolean
  intent: string
  webSource: string
  expiresIn: number
}

export type WhatsappIntentPayload = {
  intent: string
  sourceUrl: string
  formStartedAt: number
  website?: string
  recaptchaToken?: string | null
  recaptchaAction?: string
}

const WEB_SOURCE = process.env.NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE ?? 'careatlas.co.uk'

export async function verifyCareAtlasWhatsappIntent(payload: WhatsappIntentPayload) {
  const formData = new FormData()

  formData.set('intent', payload.intent)
  formData.set('form_started_at', String(payload.formStartedAt))
  formData.set('source_url', payload.sourceUrl)
  formData.set('web_source', WEB_SOURCE)
  formData.set('website', payload.website ?? '')

  if (payload.recaptchaToken) {
    formData.set('recaptcha_token', payload.recaptchaToken)
    formData.set('recaptcha_action', payload.recaptchaAction ?? 'care_atlas_whatsapp')
  }

  return apiRequest<WhatsappIntent>('/v1/whatsapp-intents', {
    method: 'POST',
    body: formData
  })
}
