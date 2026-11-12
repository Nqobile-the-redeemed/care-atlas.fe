'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { readCookieConsentPreferences } from '@/lib/cookieConsent'

import { recordTrackingEvent } from '@/lib/recordTrackingEvent'
import { activityPage } from '@/lib/marketingActivity'
import { trackEvent } from './trackEvent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

type GoogleAnalyticsProps = {
  measurementId: string
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    const update = () => {
      const analytics = readCookieConsentPreferences()?.analytics ?? false
      setAllowed(analytics)
      ;(window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !analytics
      window.gtag?.('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      })
    }
    update()
    window.addEventListener('care-atlas:cookie-consent-changed', update)
    return () => window.removeEventListener('care-atlas:cookie-consent-changed', update)
  }, [measurementId])

  useEffect(() => {
    recordTrackingEvent('landing_view')
    if (!allowed || !window.gtag || !pathname) return

    window.gtag('event', 'page_view', {
      page_path: `/${activityPage()}`,
      page_location: `${window.location.origin}/${activityPage()}`,
      page_title: activityPage()
    })
  }, [pathname, allowed])

  useEffect(() => {
    const capture = () => recordTrackingEvent('landing_view')
    window.addEventListener('care-atlas:cookie-consent-changed', capture)
    return () => window.removeEventListener('care-atlas:cookie-consent-changed', capture)
  }, [])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const element = event.target.closest<HTMLElement>('button, a, [role="button"], summary')
      if (!element || element.dataset.analyticsIgnore === 'true') return
      if (element.closest('[data-analytics-ignore="true"]')) return

      trackEvent(element.dataset.analyticsEvent || 'ui_click', {
        element_type: element.tagName.toLowerCase(),
        element_id: element.dataset.analyticsControl || undefined
      })
    }

    const handleSubmit = (event: SubmitEvent) => {
      if (!(event.target instanceof HTMLFormElement)) return

      const form = event.target
      trackEvent(form.dataset.analyticsEvent || 'form_submit', {
        form_id: form.id || form.getAttribute('name') || undefined
      })
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('submit', handleSubmit)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('submit', handleSubmit)
    }
  }, [])

  if (!allowed) return null
  return (
    <Script
      id='google-analytics'
      strategy='afterInteractive'
      onReady={() => {
        if (!readCookieConsentPreferences()?.analytics) return
        window.gtag?.('event', 'page_view', {
          page_path: window.location.pathname,
          page_location: window.location.origin + window.location.pathname,
          page_title: document.title
        })
      }}
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false, page_location: window.location.origin + window.location.pathname, page_referrer: '' });
          var gaScript = document.createElement('script');
          gaScript.async = true;
          gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
          document.head.appendChild(gaScript);
        `
      }}
    />
  )
}
