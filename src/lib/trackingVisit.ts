import { readCookieConsentPreferences } from './cookieConsent'

const key = 'care-atlas:analytics-visit'
const idleLimit = 30 * 60 * 1000
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** A consented browser session, not a persistent person identifier. */
export function trackingVisitId(): string | undefined {
  if (typeof window === 'undefined') return
  try {
    if (
      process.env.NEXT_PUBLIC_FIRST_PARTY_ANALYTICS_ENABLED !== 'true' ||
      !readCookieConsentPreferences()?.analytics
    ) {
      window.sessionStorage.removeItem(key)
      return
    }
    const saved = JSON.parse(window.sessionStorage.getItem(key) ?? 'null') as { id?: string; seen?: number } | null
    const id =
      saved?.id &&
      uuid.test(saved.id) &&
      typeof saved.seen === 'number' &&
      Date.now() - saved.seen < idleLimit &&
      saved.seen <= Date.now()
        ? saved.id
        : window.crypto.randomUUID()
    window.sessionStorage.setItem(key, JSON.stringify({ id, seen: Date.now() }))
    return id
  } catch {
    return
  }
}

export function visitSource(): string {
  const tagged = new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase()
  if (tagged && ['facebook', 'instagram', 'whatsapp', 'sms', 'email', 'search', 'referral'].includes(tagged))
    return tagged
  if (tagged) return 'other'
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname
    if (host === window.location.hostname) return 'direct'
    for (const [domain, source] of [
      ['facebook.com', 'facebook'],
      ['instagram.com', 'instagram'],
      ['google.com', 'search'],
      ['bing.com', 'search']
    ]) {
      if (host === domain || host.endsWith(`.${domain}`)) return source
    }
    return 'referral'
  } catch {
    return 'other'
  }
}
