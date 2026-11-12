import { analyticsAllowed, consentChangeEvent } from './marketingConsent'

const visitorKey = 'om:activity-visitor:v1'
const sessionKey = 'om:activity-session:v1'
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
let queue = Promise.resolve()
let stopped = false
export const activitySessionEvent = 'om:activity-session'
const attempts = new Map<string, { visitId: string; id: string }>()
export type ActivityContext = { visitId: string; token: string; visitorId: string; seen: number }
export type ActivityOptions = { attemptId?: string; procurementId?: string; control?: string; engagedSeconds?: number }

export function activityContext(): ActivityContext | undefined {
  if (
    typeof window === 'undefined' ||
    process.env.NEXT_PUBLIC_ACTIVITY_ANALYTICS_ENABLED !== 'true' ||
    !analyticsAllowed()
  )
    return
  try {
    const now = Date.now()
    const stored = JSON.parse(localStorage.getItem(visitorKey) || 'null')
    const visitorId = stored && uuid.test(stored.id) && stored.expires > now ? stored.id : crypto.randomUUID()
    localStorage.setItem(visitorKey, JSON.stringify({ id: visitorId, expires: now + 30 * 86400000 }))
    const saved = JSON.parse(sessionStorage.getItem(sessionKey) || 'null')
    const valid =
      saved && uuid.test(saved.visitId) && uuid.test(saved.token) && saved.seen <= now && now - saved.seen < 1800000
    const context = {
      visitId: valid ? saved.visitId : crypto.randomUUID(),
      token: valid ? saved.token : crypto.randomUUID(),
      visitorId,
      seen: now
    }
    sessionStorage.setItem(sessionKey, JSON.stringify(context))
    if (!valid) queueMicrotask(() => window.dispatchEvent(new Event(activitySessionEvent)))
    return context
  } catch {
    return
  }
}

export function activityPage(path = window.location.pathname): string {
  if (path.includes('/sign-in')) return 'login'
  if (path.includes('/sign-up')) return 'signup'
  if (/\/tenders\/?$/.test(path)) return 'tenders'
  if (/\/tenders\//.test(path)) return 'tender'
  for (const page of [
    'booking',
    'signup',
    'login',
    'settings',
    'billing',
    'pricing',
    'dashboard',
    'services',
    'contact'
  ]) {
    if (path.includes('/' + page) || (page === 'signup' && path.includes('/register'))) return page
  }
  return path === '/' ? 'home' : 'other'
}

function website() {
  return 'careatlas.co.uk'
}
function api(path: string) {
  return (process.env.NEXT_PUBLIC_ACTIVITY_API_BASE_URL || 'https://api.orbitmirai.com/v1').replace(/\/$/, '') + path
}
function source(): string {
  const allowed = ['facebook', 'instagram', 'whatsapp', 'sms', 'email', 'search', 'referral', 'direct']
  const tagged = new URLSearchParams(location.search).get('utm_source')?.toLowerCase()
  if (tagged) return allowed.includes(tagged) ? tagged : 'other'
  if (!document.referrer) return 'direct'
  try {
    const host = new URL(document.referrer).hostname
    if (host === location.hostname) return 'direct'
    for (const [domain, channel] of [
      ['facebook.com', 'facebook'],
      ['instagram.com', 'instagram'],
      ['google.com', 'search'],
      ['bing.com', 'search']
    ]) {
      if (host === domain || host.endsWith('.' + domain)) return channel
    }
    return 'referral'
  } catch {
    return 'other'
  }
}

export function recordActivity(name: string, options: ActivityOptions = {}) {
  const context = activityContext()
  if (!context || stopped) return
  let attemptId = options.attemptId
  if (attemptId) {
    const saved = attempts.get(attemptId)
    if (!saved || saved.visitId !== context.visitId)
      attempts.set(attemptId, { visitId: context.visitId, id: saved ? crypto.randomUUID() : attemptId })
    attemptId = attempts.get(attemptId)?.id
  }
  const click = new URLSearchParams(location.search).get('om_click')
  const payload = {
    event_id: name === 'session_started' ? context.visitId : crypto.randomUUID(),
    visit_id: context.visitId,
    visitor_id: context.visitorId,
    session_token: context.token,
    web_source: website(),
    source: source(),
    page: activityPage(),
    name,
    consent: true,
    consent_version: '1',
    device_class: window.matchMedia('(max-width: 767px)').matches
      ? 'mobile'
      : window.matchMedia('(max-width: 1023px)').matches
        ? 'tablet'
        : 'desktop',
    ...(click && uuid.test(click) ? { click_id: click } : {}),
    ...(options.control ? { control: options.control } : {}),
    ...(attemptId ? { attempt_id: attemptId } : {}),
    ...(options.procurementId && uuid.test(options.procurementId) ? { procurement_id: options.procurementId } : {}),
    ...(options.engagedSeconds !== undefined ? { engaged_seconds: options.engagedSeconds } : {})
  }
  queue = queue
    .then(async () => {
      if (stopped || !analyticsAllowed()) return
      const response = await fetch(api('/public/analytics/activity'), {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
      if (response.status === 409) sessionStorage.removeItem(sessionKey)
    })
    .catch(() => {})
}

export function clearActivitySession() {
  attempts.clear()
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(sessionKey)
    localStorage.removeItem(visitorKey)
  } catch {}
}

export function eraseActivity() {
  if (typeof window === 'undefined') return
  stopped = true
  try {
    const context = JSON.parse(sessionStorage.getItem(sessionKey) || 'null')
    if (context && uuid.test(context.visitId) && uuid.test(context.token)) {
      void fetch(api('/public/analytics/forget'), {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          visit_id: context.visitId,
          session_token: context.token,
          web_source: website(),
          all_sessions: true
        })
      }).catch(() => {})
    }
  } catch {
  } finally {
    clearActivitySession()
  }
}

export function flushActivity() {
  return queue
}

export function foregroundSeconds(
  visible: boolean,
  focused: boolean,
  interactedAt: number,
  tickAt: number,
  now: number
) {
  return visible && focused && now - interactedAt < 60000
    ? Math.max(0, Math.min(30, Math.floor((now - tickAt) / 1000)))
    : 0
}

export function startActivity() {
  let interactedAt = Date.now()
  let tickAt = Date.now()
  const interact = () => {
    interactedAt = Date.now()
  }
  const visibility = () => {
    tickAt = Date.now()
  }
  const click = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return
    const link = event.target.closest('a[href]') as HTMLAnchorElement | null
    if (!link) return
    try {
      const url = new URL(link.href, location.origin)
      if (!['careatlas.co.uk', 'www.careatlas.co.uk', 'app.orbitmirai.com', location.hostname].includes(url.hostname))
        return
      const control = activityPage(url.pathname)
      if (['signup', 'booking', 'pricing', 'settings', 'billing', 'contact'].includes(control)) {
        recordActivity('cta_clicked', { control })
        if (control === 'signup') recordActivity('signup_started', { control })
      }
    } catch {}
  }
  const consent = () => {
    if (analyticsAllowed()) {
      stopped = false
      recordActivity('page_viewed')
    } else eraseActivity()
  }
  window.addEventListener('pointerdown', interact, { passive: true })
  window.addEventListener('keydown', interact)
  document.addEventListener('click', click)
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('focus', visibility)
  window.addEventListener('blur', visibility)
  window.addEventListener(consentChangeEvent, consent)
  const timer = window.setInterval(() => {
    const now = Date.now()
    const seconds = foregroundSeconds(
      document.visibilityState === 'visible',
      document.hasFocus(),
      interactedAt,
      tickAt,
      now
    )
    tickAt = now
    if (seconds) recordActivity('engagement', { engagedSeconds: seconds })
  }, 15000)
  return () => {
    clearInterval(timer)
    window.removeEventListener('pointerdown', interact)
    window.removeEventListener('keydown', interact)
    document.removeEventListener('click', click)
    document.removeEventListener('visibilitychange', visibility)
    window.removeEventListener('focus', visibility)
    window.removeEventListener('blur', visibility)
    window.removeEventListener(consentChangeEvent, consent)
  }
}
