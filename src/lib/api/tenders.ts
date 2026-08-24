import { apiRequest } from './client'

export type PublicTender = {
  id: string
  title: string
  buyer: string | null
  sourceReference: string | null
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

export type TenderLeadKind = 'enquiry' | 'booking'

export type TenderLeadPayload = {
  name: string
  email: string
  phone: string
  company?: string
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
}

export type TenderLeadReceipt = {
  id: string
  status: string
  webQueryId: string
  receivedAt: string
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

export async function sendTenderLead(tenderId: string, kind: TenderLeadKind, payload: TenderLeadPayload) {
  const formData = new FormData()
  const endpoint =
    kind === 'booking' ? `/v1/public/tenders/${tenderId}/bookings` : `/v1/public/tenders/${tenderId}/service-enquiries`

  formData.set('name', payload.name)
  formData.set('email', payload.email)
  formData.set('phone', payload.phone)
  formData.set('company', payload.company ?? '')
  formData.set('address', JSON.stringify(payload.address))
  formData.set('message', payload.message)
  formData.set('consent', payload.consent ? '1' : '0')
  formData.set('form_started_at', String(payload.formStartedAt))
  formData.set('source_url', payload.sourceUrl)
  formData.set('web_source', WEB_SOURCE)
  formData.set('website', payload.website ?? '')
  formData.set('details', JSON.stringify({ page: 'public tender board', lead_kind: kind }))

  return apiRequest<TenderLeadReceipt>(endpoint, {
    method: 'POST',
    body: formData
  })
}
