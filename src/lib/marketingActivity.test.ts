import {
  activityContext,
  activityPage,
  recordActivity,
  foregroundSeconds,
  startActivity,
  flushActivity
} from './marketingActivity'
import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { storeCookieConsentPreferences, createCookieConsentPreferences } from './cookieConsent'
const mock = vi
const setConsent = (analytics: boolean) =>
  storeCookieConsentPreferences(createCookieConsentPreferences({ analytics, functional: false, marketing: false }))

let cleanup: (() => void) | undefined
let counter = 1
const previousFlag = process.env.NEXT_PUBLIC_ACTIVITY_ANALYTICS_ENABLED
beforeEach(async () => {
  process.env.NEXT_PUBLIC_ACTIVITY_ANALYTICS_ENABLED = 'true'
  localStorage.clear()
  sessionStorage.clear()
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ matches: false }) })
  Object.defineProperty(window.crypto, 'randomUUID', {
    configurable: true,
    value: () => '01a0f396-830f-7213-9662-' + String(counter++).padStart(12, '0')
  })
  global.fetch = mock.fn().mockResolvedValue({ status: 202 })
  cleanup = startActivity()
  setConsent(true)
  await flushActivity()
  mock.mocked(fetch).mockClear()
})
afterEach(() => {
  cleanup?.()
  if (previousFlag === undefined) delete process.env.NEXT_PUBLIC_ACTIVITY_ANALYTICS_ENABLED
  else process.env.NEXT_PUBLIC_ACTIVITY_ANALYTICS_ENABLED = previousFlag
})

it('records known CTA categories without reading link text or query data', async () => {
  const link = document.createElement('a')
  link.href = '/sign-up?email=private@example.test'
  link.textContent = 'Private name'
  document.body.append(link)
  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  await flushActivity()
  const bodies = mock
    .mocked(fetch)
    .mock.calls.map(call => String(call[1]?.body))
    .join(' ')
  expect(bodies).toContain('signup_started')
  expect(bodies).not.toContain('private@example.test')
  expect(bodies).not.toContain('Private name')
  link.remove()
})

it('does not collect or retain an activity identity after optional consent is refused', async () => {
  setConsent(false)
  await flushActivity()
  mock.mocked(fetch).mockClear()
  recordActivity('page_viewed')
  await flushActivity()
  expect(activityContext()).toBeUndefined()
  expect(fetch).not.toHaveBeenCalled()
  expect(localStorage.getItem('om:activity-visitor:v1')).toBeNull()
})

it('sends only categorical page and form progression data, never form contents or query strings', async () => {
  window.history.replaceState({}, '', '/contact?email=private@example.test&token=secret')
  recordActivity('inquiry_form_started', { control: 'identity' })
  await flushActivity()
  const payload = JSON.parse(String(mock.mocked(fetch).mock.calls[0][1]?.body))
  expect(payload.page).toBe('contact')
  expect(payload.control).toBe('identity')
  expect(JSON.stringify(payload)).not.toContain('private@example.test')
  expect(JSON.stringify(payload)).not.toContain('token=secret')
})

it('caps foreground estimates and ignores background, unfocused and idle tabs', () => {
  expect(foregroundSeconds(true, true, 9000, 0, 10000)).toBe(10)
  expect(foregroundSeconds(false, true, 9000, 0, 10000)).toBe(0)
  expect(foregroundSeconds(true, false, 9000, 0, 10000)).toBe(0)
  expect(foregroundSeconds(true, true, 0, 60000, 61000)).toBe(0)
  expect(foregroundSeconds(true, true, 99000, 0, 100000)).toBe(30)
  expect(activityPage('/clients/private@example.test')).toBe('other')
})

it('discards queued activity when consent is withdrawn and requests erasure instead', async () => {
  recordActivity('page_viewed')
  setConsent(false)
  await flushActivity()
  const calls = mock.mocked(fetch).mock.calls
  expect(calls.some(call => String(call[0]).endsWith('/public/analytics/forget'))).toBe(true)
  expect(calls.some(call => String(call[0]).endsWith('/public/analytics/activity'))).toBe(false)
})
