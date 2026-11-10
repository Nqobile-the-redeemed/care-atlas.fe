'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { readCookieConsentPreferences } from '@/lib/cookieConsent'

type Props = { tagManagerScript: string | null; metaScript: string; clarityScript: string | null }

export default function ConsentScripts({ tagManagerScript, metaScript, clarityScript }: Props) {
  const [choice, setChoice] = useState({ analytics: false, marketing: false })
  const previous = useRef(choice)
  useEffect(() => {
    const update = () => {
      const stored = readCookieConsentPreferences()
      const next = { analytics: stored?.analytics ?? false, marketing: stored?.marketing ?? false }
      const revoked = (previous.current.analytics && !next.analytics) || (previous.current.marketing && !next.marketing)
      previous.current = next
      setChoice(next)
      if (revoked) {
        const provider = window as Window & {
          fbq?: (...args: unknown[]) => void
          clarity?: (...args: unknown[]) => void
        }
        if (!next.marketing) provider.fbq?.('consent', 'revoke')
        provider.clarity?.('consentv2', {
          analytics_Storage: next.analytics ? 'granted' : 'denied',
          ad_Storage: next.marketing ? 'granted' : 'denied'
        })
        // Unload SDKs already resident in this document; the new page loads only permitted scripts.
        window.location.reload()
      }
    }
    update()
    window.addEventListener('care-atlas:cookie-consent-changed', update)
    return () => window.removeEventListener('care-atlas:cookie-consent-changed', update)
  }, [])
  return (
    <>
      {choice.analytics && choice.marketing && tagManagerScript && (
        <Script
          id='google-tag-manager'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{ __html: tagManagerScript }}
        />
      )}
      {choice.marketing && (
        <Script id='meta-pixel' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: metaScript }} />
      )}
      {choice.analytics && clarityScript && (
        <Script
          id='microsoft-clarity'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{ __html: clarityScript }}
        />
      )}
    </>
  )
}
