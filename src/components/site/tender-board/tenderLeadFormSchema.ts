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
  company: Yup.string().ensure().default(''),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('A message is required').default(''),
  consent: Yup.boolean()
    .oneOf([true], 'You must give your consent to proceed')
    .required('Consent is required')
    .default(false),
  website: Yup.string().ensure().default('')
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
