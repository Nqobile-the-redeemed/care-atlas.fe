export type PublicFormSecurityPayload = {
  consent: boolean
  formStartedAt: number
  sourceUrl: string
  website?: string
  recaptchaToken?: string | null
  recaptchaAction?: string
}

export type PublicAccountPayload = {
  password?: string
  passwordConfirmation?: string
}

export const WEB_SOURCE = process.env.NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE ?? 'careatlas.co.uk'

export function appendPublicFormMeta(formData: FormData, payload: PublicFormSecurityPayload) {
  formData.set('consent', payload.consent ? '1' : '0')
  formData.set('form_started_at', String(payload.formStartedAt))
  formData.set('source_url', payload.sourceUrl)
  formData.set('web_source', WEB_SOURCE)
  formData.set('website', payload.website ?? '')

  if (payload.recaptchaToken) {
    formData.set('recaptcha_token', payload.recaptchaToken)
    formData.set('recaptcha_action', payload.recaptchaAction ?? 'care_atlas_form')
  }
}

export function appendPublicAccountFields(formData: FormData, payload: PublicAccountPayload) {
  formData.set('password', payload.password ?? '')
  formData.set('password_confirmation', payload.passwordConfirmation ?? '')
}
