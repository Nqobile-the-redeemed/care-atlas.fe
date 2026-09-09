import { apiRequest } from './client'
import { appendPublicFormMeta } from './publicForm'

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

export type TenderPagination = {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  nextPageUrl: string | null
  previousPageUrl: string | null
  dataLastUpdated: string | null
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
    counties?: string[]
    notes?: string
  }
  address?: {
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
}

export type TenderLeadReceipt = {
  id: string
  status: string
  webQueryId: string
  receivedAt: string
  verificationRequired?: boolean
  email?: string
  submissionType?: TenderLeadKind
  handoff?: {
    id: string
    code: string
    url: string | null
    expiresAt: string | null
  }
}

export type TenderFilters = {
  categories: string[]
  regions: string[]
  industries?: string[]
  subcategories?: string[]
  sources?: string[]
}

export type PublicTenderQuery = {
  keyword?: string
  category?: string
  region?: string
  page?: number
  perPage?: number
  sort?: 'deadline' | 'newest'
}

export async function getPublicTenders(filters: PublicTenderQuery) {
  const params = new URLSearchParams()

  if (filters.keyword) params.set('keyword', filters.keyword)
  if (filters.category) params.set('category', filters.category)
  if (filters.region) params.set('region', filters.region)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (filters.perPage) params.set('per_page', String(filters.perPage))
  if (filters.sort) params.set('sort', filters.sort)

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
  if (payload.address) {
    formData.set('address', JSON.stringify(payload.address))
  }
  formData.set('message', payload.message)
  formData.set('details', JSON.stringify({ page: 'public tender board', lead_kind: kind }))
  appendPublicFormMeta(formData, {
    ...payload,
    recaptchaAction: payload.recaptchaAction ?? `care_atlas_tender_${kind}`
  })

  return apiRequest<TenderLeadReceipt>(endpoint, {
    method: 'POST',
    body: formData
  })
}
