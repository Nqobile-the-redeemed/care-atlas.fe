import { apiRequest } from './client'
import { appendPublicFormMeta } from './publicForm'

export type PublicTender = {
  id: string
  title: string
  buyer: string | null
  sourceReference: string | null
  category: string
  categories: string[]
  keywords?: string[]
  taxonomy?: TenderTaxonomyNode[]
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
  publicPath?: string
  canonicalUrl?: string
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

export type TenderNotificationUnsubscribeReceipt = {
  unsubscribed: boolean
  email?: string | null
  message?: string | null
}

export type TenderFilters = {
  categories: string[]
  regions: string[]
  industries?: string[]
  subcategories?: string[]
  taxonomy?: TenderTaxonomyNode[]
  cpvCodes?: Array<{ code: string; label: string; slug: string; parentSlug: string | null }>
  keywords?: string[]
  keywordGroups?: TenderKeywordGroup[]
  stages?: string[]
  procedureTypes?: string[]
  procurementTypes?: string[]
  total?: number
  ranges?: {
    value?: {
      minMinor: number | null
      maxMinor: number | null
      suggestedMaxMinor?: number | null
      stepsMinor?: number[]
      currency: string
      knownCount?: number
      unspecifiedCount?: number
    }
  }
  facets?: Partial<
    Record<
      | 'categories'
      | 'regions'
      | 'industries'
      | 'subcategories'
      | 'taxonomy'
      | 'cpvCodes'
      | 'keywords'
      | 'stages'
      | 'procedureTypes'
      | 'procurementTypes'
      | 'framework'
      | 'dynamicMarket'
      | 'smeSuitable',
      Array<{ value: string | boolean; count: number }>
    >
  >
}

export type PublicTenderQuery = {
  keyword?: string
  category?: string | string[]
  region?: string | string[]
  industry?: string | string[]
  subcategory?: string | string[]
  taxonomy?: string | string[]
  keywords?: string | string[]
  valueMinMinor?: number
  valueMaxMinor?: number
  includeValueUnspecified?: boolean
  publishedFrom?: string
  publishedTo?: string
  deadlineFrom?: string
  deadlineTo?: string
  stage?: string | string[]
  procedureType?: string | string[]
  procurementType?: string | string[]
  framework?: boolean
  dynamicMarket?: boolean
  smeSuitable?: boolean
  page?: number
  perPage?: number
  sort?: 'deadline' | 'newest'
}

export async function getPublicTenders(filters: PublicTenderQuery) {
  const params = new URLSearchParams()

  if (filters.keyword) params.set('keyword', filters.keyword)
  appendMany(params, 'category', filters.category)
  appendMany(params, 'region', filters.region)
  appendMany(params, 'industry', filters.industry)
  appendMany(params, 'subcategory', filters.subcategory)
  appendMany(params, 'taxonomy', filters.taxonomy)
  appendMany(params, 'keywords', filters.keywords)
  appendAdvancedTenderFilters(params, filters)
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

export async function getPublicTenderFilters(filters: Omit<PublicTenderQuery, 'page' | 'perPage' | 'sort'> = {}) {
  const params = new URLSearchParams()

  if (filters.keyword) params.set('keyword', filters.keyword)
  appendMany(params, 'category', filters.category)
  appendMany(params, 'region', filters.region)
  appendMany(params, 'industry', filters.industry)
  appendMany(params, 'subcategory', filters.subcategory)
  appendMany(params, 'taxonomy', filters.taxonomy)
  appendMany(params, 'keywords', filters.keywords)
  appendAdvancedTenderFilters(params, filters)

  const suffix = params.toString()

  return apiRequest<TenderFilters>(`/v1/public/tender-filters${suffix ? `?${suffix}` : ''}`, {
    cache: 'no-store'
  })
}

function appendAdvancedTenderFilters(params: URLSearchParams, filters: PublicTenderQuery) {
  if (filters.valueMinMinor !== undefined) params.set('value_min_minor', String(filters.valueMinMinor))
  if (filters.valueMaxMinor !== undefined) params.set('value_max_minor', String(filters.valueMaxMinor))
  if (filters.includeValueUnspecified !== undefined) {
    params.set('include_value_unspecified', filters.includeValueUnspecified ? '1' : '0')
  }
  if (filters.publishedFrom) params.set('published_from', filters.publishedFrom)
  if (filters.publishedTo) params.set('published_to', filters.publishedTo)
  if (filters.deadlineFrom) params.set('deadline_from', filters.deadlineFrom)
  if (filters.deadlineTo) params.set('deadline_to', filters.deadlineTo)
  appendMany(params, 'stage', filters.stage)
  appendMany(params, 'procedure_type', filters.procedureType)
  appendMany(params, 'procurement_type', filters.procurementType)
  if (filters.framework !== undefined) params.set('framework', filters.framework ? '1' : '0')
  if (filters.dynamicMarket !== undefined) params.set('dynamic_market', filters.dynamicMarket ? '1' : '0')
  if (filters.smeSuitable !== undefined) params.set('sme_suitable', filters.smeSuitable ? '1' : '0')
}

export type TenderTaxonomyNode = {
  slug: string
  label: string
  level: 'industry' | 'service_category' | 'cpv_code'
  parentSlug: string | null
  cpvCode?: string | null
}

export type TenderKeywordGroup = {
  slug: string
  label: string
  options: string[]
}

function appendMany(params: URLSearchParams, key: string, values?: string | string[]) {
  const normalized = typeof values === 'string' ? [values] : values
  const present = normalized?.filter(Boolean) ?? []

  if (present.length === 1) {
    params.set(key, present[0])
    return
  }

  present.forEach(value => params.append(`${key}[]`, value))
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

export async function unsubscribeTenderNotifications(token: string) {
  return apiRequest<TenderNotificationUnsubscribeReceipt>(
    `/v1/public/tender-notifications/unsubscribe/${encodeURIComponent(token)}`,
    {
      cache: 'no-store'
    }
  )
}
