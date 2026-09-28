export const COOKIE_CONSENT_STORAGE_KEY = 'care-atlas-cookie-consent'
export const COOKIE_CONSENT_VERSION = 1
export const OPEN_COOKIE_PREFERENCES_EVENT = 'care-atlas:open-cookie-preferences'

export type CookieConsentPreferences = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  version: number
  updatedAt: string
}

export function createCookieConsentPreferences(
  preferences: Pick<CookieConsentPreferences, 'functional' | 'analytics' | 'marketing'>
): CookieConsentPreferences {
  return {
    necessary: true,
    ...preferences,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString()
  }
}

export function readCookieConsentPreferences(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (!value) return null

    const parsed = JSON.parse(value) as Partial<CookieConsentPreferences>
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null

    return createCookieConsentPreferences({
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing)
    })
  } catch {
    return null
  }
}

export function storeCookieConsentPreferences(preferences: CookieConsentPreferences) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(preferences))
  window.dispatchEvent(new CustomEvent('care-atlas:cookie-consent-changed', { detail: preferences }))
}
