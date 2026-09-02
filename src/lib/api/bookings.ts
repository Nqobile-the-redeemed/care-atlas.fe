import { apiRequest } from './client'

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
}

export type BookingPayload = {
  eventTypeSlug: string
  startAt: string
  endAt: string
  timezone: string
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
  }
  consent: boolean
  formStartedAt: number
  sourceUrl: string
  website?: string
}

const WEB_SOURCE = process.env.NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE ?? 'careatlas.co.uk'

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
  params.set('eventTypeSlug', filters.eventTypeSlug)
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
      eventTypeSlug: payload.eventTypeSlug,
      startAt: payload.startAt,
      endAt: payload.endAt,
      timezone: payload.timezone,
      customer: payload.customer,
      intake: payload.intake,
      consent: payload.consent,
      formStartedAt: payload.formStartedAt,
      sourceUrl: payload.sourceUrl,
      webSource: WEB_SOURCE,
      website: payload.website ?? ''
    })
  })
}
