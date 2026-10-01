'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
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
