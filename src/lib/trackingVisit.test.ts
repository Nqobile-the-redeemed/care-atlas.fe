import { beforeEach, expect, it, vi } from 'vitest'
import { trackingVisitId, visitSource } from './trackingVisit'
import { createCookieConsentPreferences, storeCookieConsentPreferences } from './cookieConsent'
beforeEach(() => {
  vi.restoreAllMocks()
  vi.stubEnv('NEXT_PUBLIC_FIRST_PARTY_ANALYTICS_ENABLED', 'true')
  localStorage.clear()
  sessionStorage.clear()
  window.history.replaceState(null, '', '/')
})
function consent(analytics = true) {
  storeCookieConsentPreferences(createCookieConsentPreferences({ analytics, marketing: false, functional: false }))
}
it('creates only consented sessions and reuses them until 30 minutes of inactivity', () => {
  expect(trackingVisitId()).toBeUndefined()
  consent()
  const first = trackingVisitId()
  expect(first).toMatch(/^[a-f0-9-]{36}$/i)
  expect(trackingVisitId()).toBe(first)
  const now = Date.now()
  vi.spyOn(Date, 'now').mockReturnValue(now + 31 * 60 * 1000)
  expect(trackingVisitId()).not.toBe(first)
  consent(false)
  expect(trackingVisitId()).toBeUndefined()
  expect(sessionStorage.getItem('care-atlas:analytics-visit')).toBeNull()
})
it('reduces referrers and campaign tags to source categories without retaining URLs', () => {
  window.history.replaceState(null, '', '/tenders?utm_source=facebook&email=private@example.com')
  expect(visitSource()).toBe('facebook')
  window.history.replaceState(null, '', '/tenders')
  vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://l.instagram.com/example?secret=value')
  expect(visitSource()).toBe('instagram')
  consent()
  trackingVisitId()
  expect(sessionStorage.getItem('care-atlas:analytics-visit')).not.toContain('secret')
})
it('tolerates unavailable session storage', () => {
  consent()
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked')
  })
  expect(trackingVisitId()).toBeUndefined()
})
