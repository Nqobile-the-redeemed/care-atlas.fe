import { beforeEach, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { CookieConsent } from './CookieConsent'
import { readCookieConsentPreferences } from '@/lib/cookieConsent'
import { analyticsAllowed } from '@/lib/marketingConsent'

beforeEach(() => localStorage.clear())

it('includes activity tracking consent in the existing accept all cookie action', async () => {
  render(<CookieConsent />)
  fireEvent.click(await screen.findByRole('button', { name: 'Accept all' }))
  expect(readCookieConsentPreferences()).toMatchObject({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true
  })
  expect(analyticsAllowed()).toBe(true)
  expect(screen.queryByRole('complementary', { name: 'Cookie notice' })).not.toBeInTheDocument()
})

it('keeps tracking disabled when optional cookies are rejected', async () => {
  render(<CookieConsent />)
  fireEvent.click(await screen.findByRole('button', { name: 'Reject non-essential' }))
  expect(analyticsAllowed()).toBe(false)
  expect(readCookieConsentPreferences()).toMatchObject({ analytics: false, marketing: false })
})

it('still supports analytics consent without advertising consent', async () => {
  render(<CookieConsent />)
  fireEvent.click(await screen.findByRole('button', { name: 'Manage preferences' }))
  fireEvent.click(screen.getByRole('checkbox', { name: /Analytics cookies/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }))
  expect(readCookieConsentPreferences()).toMatchObject({ analytics: true, marketing: false })
})
