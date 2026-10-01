'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

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

  useEffect(() => {
    if (!window.gtag || !pathname) return

    window.gtag('event', 'page_view', {
      page_path: `${window.location.pathname}${window.location.search}`,
      page_location: window.location.href,
      page_title: document.title
    })
  }, [pathname])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const element = event.target.closest<HTMLElement>('button, a, [role="button"], summary')
      if (!element || element.dataset.analyticsIgnore === 'true') return
      if (element.closest('[data-analytics-ignore="true"]')) return

      trackEvent(element.dataset.analyticsEvent || 'ui_click', {
        element_type: element.tagName.toLowerCase(),
        element_id: element.id || undefined,
        element_label: element.dataset.analyticsLabel || element.getAttribute('aria-label') || undefined
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

  return (
    <Script
      id='google-analytics'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
          var gaScript = document.createElement('script');
          gaScript.async = true;
          gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
          document.head.appendChild(gaScript);
        `
      }}
    />
  )
}
