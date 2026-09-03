import * as Yup from 'yup'

import type { TenderBoardForm } from './types'
import { emptyTenderBoardForm } from './constants'

export const TenderBoardFormYup: Yup.ObjectSchema<TenderBoardForm> = Yup.object({
  name: Yup.string().required('Full name is required').default(''),
  email: Yup.string().email('Enter a valid email address').required('Email is required').default(''),
  phone: Yup.string().required('Phone number is required').default(''),
  whatsapp: Yup.string().ensure().default(''),
  preferredContactMethod: Yup.string<'email' | 'phone' | 'whatsapp'>()
    .oneOf(['email', 'phone', 'whatsapp'], 'Invalid contact method')
    .default('email'),
  preferredSlot: Yup.string().ensure().default(''),
  tenderPreferenceNotes: Yup.string().ensure().default(''),
  company: Yup.string().ensure().default(''),
  line1: Yup.string().required('Address line 1 is required').default(''),
  line2: Yup.string().ensure().default(''),
  city: Yup.string().required('City is required').default(''),
  county: Yup.string().ensure().default(''),
  postcode: Yup.string().required('Postcode is required').default(''),
  country: Yup.string().default('United Kingdom'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('A message is required').default(''),
  consent: Yup.boolean()
    .oneOf([true], 'You must give your consent to proceed')
    .required('Consent is required')
    .default(false),
  website: Yup.string().ensure().default(''),
  password: Yup.string()
    .ensure()
    .when({
      is: (value: string | null | undefined) => (value ?? '').length > 0,
      then: schema => schema.min(8, 'Password must be at least 8 characters')
    })
    .default(''),
  passwordConfirmation: Yup.string()
    .ensure()
    .when('password', {
      is: (password: string) => (password ?? '').length > 0,
      then: schema => schema.required('Confirm your password').oneOf([Yup.ref('password')], 'Passwords must match')
    })
    .default('')
}).defined() as Yup.ObjectSchema<TenderBoardForm>

export const emptyTenderBoardFormValues: TenderBoardForm = structuredClone(emptyTenderBoardForm)

export const PREFERRED_CONTACT_OPTIONS: Array<{
  code: TenderBoardForm['preferredContactMethod']
  name: string
  value: TenderBoardForm['preferredContactMethod']
}> = [
  { code: 'email', name: 'Prefer email', value: 'email' },
  { code: 'phone', name: 'Prefer phone', value: 'phone' },
  { code: 'whatsapp', name: 'Prefer WhatsApp', value: 'whatsapp' }
]
