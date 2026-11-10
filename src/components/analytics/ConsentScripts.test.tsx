import { render, screen, act, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import ConsentScripts from './ConsentScripts'
import GoogleAnalytics from './GoogleAnalytics'
import { createCookieConsentPreferences, storeCookieConsentPreferences } from '@/lib/cookieConsent'
vi.mock('next/script', () => ({ default: ({ id }: { id: string }) => <span data-testid={id} /> }))
vi.mock('next/navigation', () => ({ usePathname: () => '/tenders' }))
vi.mock('@/lib/recordTrackingEvent', () => ({ recordTrackingEvent: vi.fn() }))
const props = { tagManagerScript: 'gtm', metaScript: 'meta', clarityScript: 'clarity' }
beforeEach(() => {
  localStorage.clear()
  window.gtag = vi.fn()
})
afterEach(cleanup)
function choice(analytics: boolean, marketing: boolean) {
  storeCookieConsentPreferences(createCookieConsentPreferences({ analytics, marketing, functional: false }))
}
it('loads no optional trackers before a choice or after decline', () => {
  render(
    <>
      <GoogleAnalytics measurementId='G-TEST' />
      <ConsentScripts {...props} />
    </>
  )
  expect(screen.queryByTestId('google-analytics')).toBeNull()
  expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  expect(screen.queryByTestId('meta-pixel')).toBeNull()
  expect(screen.queryByTestId('microsoft-clarity')).toBeNull()
  act(() => choice(false, false))
  expect(screen.queryByTestId('google-analytics')).toBeNull()
  expect(screen.queryByTestId('meta-pixel')).toBeNull()
})
it('honours analytics-only consent without loading marketing or unknown container tags', () => {
  choice(true, false)
  render(
    <>
      <GoogleAnalytics measurementId='G-TEST' />
      <ConsentScripts {...props} />
    </>
  )
  expect(screen.getByTestId('google-analytics')).toBeInTheDocument()
  expect(screen.getByTestId('microsoft-clarity')).toBeInTheDocument()
  expect(screen.queryByTestId('meta-pixel')).toBeNull()
  expect(screen.queryByTestId('google-tag-manager')).toBeNull()
})
it('loads marketing only when explicitly selected', () => {
  choice(false, true)
  render(
    <>
      <GoogleAnalytics measurementId='G-TEST' />
      <ConsentScripts {...props} />
    </>
  )
  expect(screen.getByTestId('meta-pixel')).toBeInTheDocument()
  expect(screen.queryByTestId('google-analytics')).toBeNull()
  expect(screen.queryByTestId('microsoft-clarity')).toBeNull()
})
it('enables the container only after both relevant categories are accepted', () => {
  render(<ConsentScripts {...props} />)
  act(() => choice(true, true))
  expect(screen.getByTestId('google-tag-manager')).toBeInTheDocument()
  expect(screen.getByTestId('meta-pixel')).toBeInTheDocument()
})
