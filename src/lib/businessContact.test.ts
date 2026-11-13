import { expect, it } from 'vitest'
import { businessNumber, businessPhone, businessWhatsappUrl } from './businessContact'
import { site } from '@/data/site'

it('uses the same business number for site contact details and WhatsApp', () => {
  expect(site.phone).toBe(businessPhone)
  expect(site.phone.replace(/\D/g, '')).toBe(businessNumber)
  expect(businessWhatsappUrl()).toBe(`https://wa.me/${businessNumber}`)
})

it('encodes message text without changing the recipient', () => {
  const url = new URL(businessWhatsappUrl('Hello Care Atlas & enquiries'))
  expect(url.pathname).toBe(`/${businessNumber}`)
  expect(url.searchParams.get('text')).toBe('Hello Care Atlas & enquiries')
})
