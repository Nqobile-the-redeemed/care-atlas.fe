import { readCookieConsentPreferences } from './cookieConsent'

export const consentChangeEvent = 'care-atlas:cookie-consent-changed'
export function analyticsAllowed() {
  return readCookieConsentPreferences()?.analytics === true
}
