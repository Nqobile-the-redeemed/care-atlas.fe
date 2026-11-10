import { readCookieConsentPreferences } from './cookieConsent'

const key = 'care-atlas:marketing-click'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const maxAge = 24 * 60 * 60 * 1000

/** Campaign attribution is optional and follows the existing analytics consent choice. */
export function marketingAttribution(sourceUrl?: string): { om_click?: string } {
  if (typeof window === 'undefined') return {}
  try {
    if (!readCookieConsentPreferences()?.analytics) {
      window.sessionStorage.removeItem(key)
      return {}
    }
    const current = new URL(sourceUrl ?? window.location.href, window.location.origin).searchParams.get('om_click')
    if (current && uuid.test(current)) {
      window.sessionStorage.setItem(key, JSON.stringify({ click: current, capturedAt: Date.now() }))
      return { om_click: current }
    }
    const saved = JSON.parse(window.sessionStorage.getItem(key) ?? 'null') as {
      click?: string
      capturedAt?: number
    } | null
    if (
      saved?.click &&
      uuid.test(saved.click) &&
      typeof saved.capturedAt === 'number' &&
      Date.now() - saved.capturedAt < maxAge
    ) {
      return { om_click: saved.click }
    }
    window.sessionStorage.removeItem(key)
  } catch {
    /* Attribution must never block a booking, including when storage is unavailable. */
  }
  return {}
}
