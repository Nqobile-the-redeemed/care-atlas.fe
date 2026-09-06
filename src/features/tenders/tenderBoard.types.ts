import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'
import type { PublicTender, PublicTenderDetail, TenderLeadKind } from '@/lib/api/tenders'

export type PreferredContactMethod = 'email' | 'phone' | 'whatsapp'

export type TenderBoardFilters = {
  keyword: string
  category: string
  region: string
}

export type TenderBoardSelectedTender = PublicTender | PublicTenderDetail

export type TenderBoardPanelData = {
  tender: TenderBoardSelectedTender
  initialLeadKind?: TenderLeadKind
}

export type TenderBoardForm = {
  name: string
  email: string
  phone: string
  whatsapp: string
  preferredContactMethod: PreferredContactMethod
  preferredSlot: string
  company: string
  password: string
  passwordConfirmation: string
  message: string
  consent: boolean
  website: string
}

export type TenderBoardWorkspaceState = {
  selectedTender: TenderBoardSelectedTender | null
  leadKind: TenderLeadKind
  formStartedAt: number
  form: TenderBoardForm
  detailsLoading: boolean
  detailsError: string | null
  submitting: boolean
  submitError: string | null
  notice: string | null
  eventTypes: BookingEventType[]
  selectedEventSlug: string
  slots: BookingSlot[]
  selectedSlot: BookingSlot | null
  bookingOptionsLoading: boolean
  bookingError: string | null
  handoffUrl: string | null
}

export type TenderBoardState = {
  filters: {
    draft: TenderBoardFilters
    applied: TenderBoardFilters
  }
  items: PublicTender[]
  loading: boolean
  error: string | null
  workspace: TenderBoardWorkspaceState
}
