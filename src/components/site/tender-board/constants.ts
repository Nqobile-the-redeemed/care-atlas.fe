import type { TenderBoardForm } from './types'

export const inputClass =
  'min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-hidden transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

export const emptyTenderBoardForm: TenderBoardForm = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  preferredContactMethod: 'email',
  preferredSlot: '',
  tenderPreferenceNotes: '',
  company: '',
  line1: '',
  line2: '',
  city: '',
  county: '',
  postcode: '',
  country: 'United Kingdom',
  message: '',
  consent: false,
  website: ''
}
