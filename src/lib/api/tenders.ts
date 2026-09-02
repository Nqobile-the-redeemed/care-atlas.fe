import { apiRequest } from './client'

export type PublicTender = {
  id: string
  title: string
  buyer: string | null
  sourceReference: string | null
  sourceKey?: string | null
  sourceName?: string | null
  category: string
  categories: string[]
  region: string
  regions: string[]
  summary: string
  value: { minMinor: number | null; maxMinor: number | null; currency: string }
  publishedAt: string | null
  submissionDeadline: string | null
  daysRemaining: number | null
  contractStartDate: string | null
  contractEndDate: string | null
  states: string[]
  indicativePricing: {
    upfrontFeeMinor: number
    successFeeMinor: number | null
    currency: string
    reviewed: boolean
  }
  locked: boolean
  lastSeenAt: string | null
}

export type PublicTenderLot = {
  id: string
  sourceLotId: string | null
  title: string
  description: string | null
  valueMinor: number | null
  currency: string
  regions: string[]
  categories: string[]
  submissionDeadline: string | null
  isRelevant: boolean
}

export type PublicTenderDetail = PublicTender & {
  description: string | null
  buyerType: string | null
  stage: string | null
  procedureType: string | null
  procurementType: string | null
  clarificationDeadline: string | null
  deliveryLocations: string[]
  cpvCodes: string[]
  isFramework: boolean
  isDynamicMarket: boolean
  smeSuitable: boolean | null
  vcseSuitable: boolean | null
  sourceNoticeUrl: string | null
  responsePortalUrl: string | null
  sourceUpdatedAt: string | null
  lots?: PublicTenderLot[]
  pricingCaveat?: string
}

export type TenderLeadKind = 'enquiry' | 'booking'

export type TenderLeadPayload = {
  name: string
  email: string
  phone: string
  whatsapp?: string
  company?: string
  preferredContactMethod?: 'email' | 'phone' | 'whatsapp'
  preferredSlot?: string
  tenderPreferences?: {
    regions?: string[]
    categories?: string[]
    channels?: string[]
    notes?: string
  }
  address: {
    line1: string
    line2?: string
    city: string
    county?: string
    postcode: string
    country?: string
  }
  message: string
  consent: boolean
  formStartedAt: number
  sourceUrl: string
  website?: string
  recaptchaToken?: string | null
  recaptchaAction?: string
  password?: string
  passwordConfirmation?: string
}

export type TenderLeadReceipt = {
  id: string
  status: string
  webQueryId: string
  receivedAt: string
  verificationRequired?: boolean
  email?: string
  submissionType?: TenderLeadKind
}

export type TenderFilters = {
  categories: string[]
  regions: string[]
}

export type TenderOnboardingVerification = {
  submission: {
    id: string
    type: TenderLeadKind
    verifiedAt: string
  }
  auth: {
    token: string
    tokenExpiresAt: number
  }
  profileComplete: boolean
}

export type TenderNotificationPreferencePayload = {
  optedIn: boolean
  isActive?: boolean
  consentSource?: string
  regions: string[]
  categories: string[]
  tenderTypes: string[]
}

const WEB_SOURCE = process.env.NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE ?? 'careatlas.co.uk'

export async function getPublicTenders(filters: { keyword?: string; category?: string; region?: string }) {
  const params = new URLSearchParams()

  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.category) params.set('category', filters.category)
  if (filters.region) params.set('region', filters.region)

  const suffix = params.toString()

  return apiRequest<PublicTender[]>(`/v1/public/tenders${suffix ? `?${suffix}` : ''}`, {
    cache: 'no-store'
  })
}

export async function getPublicTender(tenderId: string) {
  return apiRequest<PublicTenderDetail>(`/v1/public/tenders/${tenderId}`, {
    cache: 'no-store'
  })
}

export async function getPublicTenderFilters() {
  return apiRequest<TenderFilters>('/v1/public/tender-filters', {
    cache: 'no-store'
  })
}

export async function sendTenderLead(tenderId: string, kind: TenderLeadKind, payload: TenderLeadPayload) {
  const formData = new FormData()
  const endpoint =
    kind === 'booking' ? `/v1/public/tenders/${tenderId}/bookings` : `/v1/public/tenders/${tenderId}/service-enquiries`

  formData.set('name', payload.name)
  formData.set('email', payload.email)
  formData.set('phone', payload.phone)
  formData.set('whatsapp', payload.whatsapp ?? '')
  formData.set('company', payload.company ?? '')
  formData.set('preferred_contact_method', payload.preferredContactMethod ?? '')
  formData.set('preferred_slot_at', payload.preferredSlot ?? '')
  formData.set('tender_preferences', JSON.stringify(payload.tenderPreferences ?? {}))
  formData.set('address', JSON.stringify(payload.address))
  formData.set('message', payload.message)
  formData.set('consent', payload.consent ? '1' : '0')
  formData.set('form_started_at', String(payload.formStartedAt))
  formData.set('source_url', payload.sourceUrl)
  formData.set('web_source', WEB_SOURCE)
  formData.set('website', payload.website ?? '')
  formData.set('details', JSON.stringify({ page: 'public tender board', lead_kind: kind }))

  if (payload.password) {
    formData.set('password', payload.password)
  }
  if (payload.passwordConfirmation) {
    formData.set('password_confirmation', payload.passwordConfirmation)
  }

  if (payload.recaptchaToken) {
    formData.set('recaptcha_token', payload.recaptchaToken)
    formData.set('recaptcha_action', payload.recaptchaAction ?? `care_atlas_tender_${kind}`)
  }

  return apiRequest<TenderLeadReceipt>(endpoint, {
    method: 'POST',
    body: formData
  })
}

export async function verifyTenderOnboardingOtp(payload: {
  email: string
  otpCode: string
  submissionType: TenderLeadKind
  submissionId: string
}) {
  return apiRequest<TenderOnboardingVerification>('/v1/public/tender-onboarding/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function resendTenderOnboardingOtp(email: string) {
  return apiRequest<null>('/v1/public/tender-onboarding/otp/resend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
}

export async function saveTenderNotificationPreferences(token: string, payload: TenderNotificationPreferencePayload) {
  return apiRequest('/v1/user/tender-notifications', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
}
