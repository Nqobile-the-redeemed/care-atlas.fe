import { beforeEach, describe, expect, it, vi } from 'vitest'
import { marketingAttribution } from './marketingAttribution'
import { createCookieConsentPreferences, storeCookieConsentPreferences } from './cookieConsent'

const click = '01a0f396-830f-7213-9662-000000000001'
beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.restoreAllMocks()
})
function consent(analytics = true) {
  storeCookieConsentPreferences(createCookieConsentPreferences({ analytics, functional: false, marketing: false }))
}
describe('marketing attribution', () => {
  it('does not collect without consent and clears attribution after rejection', () => {
    expect(marketingAttribution(`https://careatlas.co.uk/tenders?om_click=${click}`)).toEqual({})
    consent()
    expect(marketingAttribution(`https://careatlas.co.uk/tenders?om_click=${click}`)).toEqual({ om_click: click })
    consent(false)
    expect(marketingAttribution('https://careatlas.co.uk/contact')).toEqual({})
    expect(sessionStorage.getItem('care-atlas:marketing-click')).toBeNull()
  })
  it('carries only the click reference across pages and expires after a day', () => {
    consent()
    marketingAttribution(`https://careatlas.co.uk/tenders?om_click=${click}&email=private@example.com`)
    expect(marketingAttribution('https://careatlas.co.uk/contact')).toEqual({ om_click: click })
    expect(sessionStorage.getItem('care-atlas:marketing-click')).not.toContain('email')
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 25 * 60 * 60 * 1000)
    expect(marketingAttribution('https://careatlas.co.uk/contact')).toEqual({})
  })
  it('ignores malformed references and tolerates unavailable storage', () => {
    consent()
    expect(marketingAttribution('https://careatlas.co.uk/tenders?om_click=bad')).toEqual({})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('disabled')
    })
    expect(() => marketingAttribution(`https://careatlas.co.uk/tenders?om_click=${click}`)).not.toThrow()
  })
})
