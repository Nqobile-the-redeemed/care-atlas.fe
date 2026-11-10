import { apiRequest } from './api/client'
import { marketingAttribution } from './marketingAttribution'
import { visitSource } from './trackingVisit'

export type TrackingObservation = 'landing_view' | 'tender_view' | 'signup_clicked' | 'booking_started'

/** Record consented sessions and stages, without form contents or full URLs. */
export function recordTrackingEvent(name: TrackingObservation) {
  if (process.env.NEXT_PUBLIC_FIRST_PARTY_ANALYTICS_ENABLED !== 'true' || typeof window === 'undefined') return
  const { om_click: clickId, visit_id: visitId } = marketingAttribution()
  if (!clickId && !visitId) return
  const post = (path: string, body: object) =>
    apiRequest(path, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  void (async () => {
    if (visitId)
      await post('/v1/public/analytics/visits', {
        visit_id: visitId,
        web_source: 'careatlas.co.uk',
        source: visitSource(),
        click_id: clickId
      })
    await post('/v1/public/analytics/events', {
      name,
      click_id: clickId,
      visit_id: visitId,
      web_source: 'careatlas.co.uk'
    })
  })().catch(() => {
    /* Measurement failure must not interrupt browsing or booking. */
  })
}
