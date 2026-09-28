'use client'

import { OPEN_COOKIE_PREFERENCES_EVENT } from '@/lib/cookieConsent'

export function CookieSettingsButton() {
  return (
    <button
      type='button'
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT))}
      className='transition hover:text-white'
    >
      Cookie settings
    </button>
  )
}
