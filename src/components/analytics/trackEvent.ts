'use client'

export type AnalyticsValue = string | number | boolean
export type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const safeEventName = /^[a-z][a-z0-9_]{0,39}$/

function sanitiseParams(params: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 100) : value])
  )
}

/** Send a GA4 event without sending names, email addresses, messages, or other form content. */
export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !safeEventName.test(name) || typeof window.gtag !== 'function') return

  window.gtag('event', name, sanitiseParams(params))
}
