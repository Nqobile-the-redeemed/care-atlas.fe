import { beforeEach, expect, it, vi } from 'vitest'
import { recordTrackingEvent } from './recordTrackingEvent'
import { apiRequest } from './api/client'
import { marketingAttribution } from './marketingAttribution'
vi.mock('./api/client', () => ({ apiRequest: vi.fn(async () => ({})) }))
vi.mock('./marketingAttribution', () => ({ marketingAttribution: vi.fn(() => ({})) }))
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('NEXT_PUBLIC_FIRST_PARTY_ANALYTICS_ENABLED', 'true')
})
it('sends only consented click observations without page URLs or contact details', () => {
  vi.mocked(marketingAttribution).mockReturnValue({ om_click: '01a0f396-830f-7213-9662-000000000001' })
  recordTrackingEvent('booking_started')
  const args = vi.mocked(apiRequest).mock.calls[0]
  expect(JSON.parse(String(args[1]?.body))).toEqual({
    name: 'booking_started',
    click_id: '01a0f396-830f-7213-9662-000000000001',
    web_source: 'careatlas.co.uk'
  })
})
it('does not send without consented attribution or when collection is disabled', () => {
  vi.mocked(marketingAttribution).mockReturnValue({})
  recordTrackingEvent('landing_view')
  vi.stubEnv('NEXT_PUBLIC_FIRST_PARTY_ANALYTICS_ENABLED', 'false')
  recordTrackingEvent('tender_view')
  expect(apiRequest).not.toHaveBeenCalled()
})
it('does not interrupt booking when analytics is unavailable', async () => {
  vi.mocked(marketingAttribution).mockReturnValue({ om_click: '01a0f396-830f-7213-9662-000000000001' })
  vi.mocked(apiRequest).mockRejectedValueOnce(new Error('offline'))
  expect(() => recordTrackingEvent('booking_started')).not.toThrow()
  await Promise.resolve()
})

it('records a non-campaign visit before its event', async () => {
  vi.mocked(marketingAttribution).mockReturnValue({ visit_id: '01a0f396-830f-7213-9662-000000000002' })
  vi.mocked(apiRequest).mockResolvedValue({ success: true, message: 'ok', data: {} })
  recordTrackingEvent('landing_view')
  await Promise.resolve()
  await Promise.resolve()
  expect(vi.mocked(apiRequest).mock.calls[0][0]).toBe('/v1/public/analytics/visits')
  expect(vi.mocked(apiRequest).mock.calls[1][0]).toBe('/v1/public/analytics/events')
  expect(JSON.parse(String(vi.mocked(apiRequest).mock.calls[1][1]?.body))).toMatchObject({
    name: 'landing_view',
    visit_id: '01a0f396-830f-7213-9662-000000000002'
  })
})
