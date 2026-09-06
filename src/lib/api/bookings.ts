import { apiRequest } from './client'
import { WEB_SOURCE } from './publicForm'

export type BookingEventType = {
  id: string
  slug: string
  name: string
  description: string | null
  durationMinutes: number
  bufferBeforeMinutes: number
  bufferAfterMinutes: number
  minimumNoticeMinutes: number
  maxDaysAhead: number
  locationType: string
  isActive: boolean
}

export type BookingSlot = {
  startAt: string
  endAt: string
  label: string
  date: string
  timezone: string
  consultantUserId?: number | null
  consultant?: {
    id: number
    email: string
    name: string
  } | null
}

export type BookingAvailability = {
  eventType: BookingEventType
  timezone: string
  slots: BookingSlot[]
}

export type PublicBooking = {
  id: string
  bookingReference: string
  status: string
  customer: {
    name: string
    email: string
    phone: string | null
    companyName: string | null
  }
  eventType: Pick<BookingEventType, 'id' | 'slug' | 'name' | 'durationMinutes'>
  startAt: string
  endAt: string
  timezone: string
  locationType: string
  googleMeetUrl: string | null
  googleSyncError: string | null
  intake: Record<string, string>
  verificationRequired?: boolean
  submissionType?: 'booking'
  handoff?: {
    id: string
    code: string
    url: string | null
    expiresAt: string | null
  }
}

export type BookingPayload = {
  eventTypeSlug: string
  startAt: string
  endAt: string
  timezone: string
  consultantUserId?: number | null
  customer: {
    name: string
    email: string
    phone?: string
    companyName?: string
    password?: string
    passwordConfirmation?: string
  }
  intake: {
    serviceInterest?: string
    currentStage?: string
    message?: string
    regions?: string[]
    counties?: string[]
  }
  consent: boolean
  formStartedAt: number
  sourceUrl: string
  website?: string
  recaptchaToken?: string | null
  recaptchaAction?: string
}

export async function getBookingEventTypes() {
  return apiRequest<BookingEventType[]>('/v1/public/booking-event-types', {
    cache: 'no-store'
  })
}

export async function getBookingAvailability(filters: {
  eventTypeSlug: string
  from?: string
  to?: string
  timezone?: string
}) {
  const params = new URLSearchParams()
  params.set('event_type_slug', filters.eventTypeSlug)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.timezone) params.set('timezone', filters.timezone)

  return apiRequest<BookingAvailability>(`/v1/public/bookings/availability?${params.toString()}`, {
    cache: 'no-store'
  })
}

export async function createPublicBooking(payload: BookingPayload) {
  return apiRequest<PublicBooking>('/v1/public/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type_slug: payload.eventTypeSlug,
      start_at: payload.startAt,
      end_at: payload.endAt,
      consultant_user_id: payload.consultantUserId ?? null,
      timezone: payload.timezone,
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone,
        company_name: payload.customer.companyName,
        password: payload.customer.password,
        password_confirmation: payload.customer.passwordConfirmation
      },
      intake: payload.intake,
      consent: payload.consent,
      form_started_at: payload.formStartedAt,
      source_url: payload.sourceUrl,
      web_source: WEB_SOURCE,
      website: payload.website ?? '',
      recaptcha_token: payload.recaptchaToken,
      recaptcha_action: payload.recaptchaAction
    })
  })
}
