'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  createCookieConsentPreferences,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readCookieConsentPreferences,
  storeCookieConsentPreferences,
  type CookieConsentPreferences
} from '@/lib/cookieConsent'

import { SiteIcon } from './SiteIcon'

type OptionalPreferences = Pick<CookieConsentPreferences, 'functional' | 'analytics' | 'marketing'>

const defaultPreferences: OptionalPreferences = {
  functional: false,
  analytics: false,
  marketing: false
}

const preferenceRows = [
  {
    key: 'functional' as const,
    title: 'Functional cookies',
    description: 'Remember useful choices and enable optional website features.'
  },
  {
    key: 'analytics' as const,
    title: 'Analytics cookies',
    description: 'Help us understand which pages and tender tools are useful.'
  },
  {
    key: 'marketing' as const,
    title: 'Marketing cookies',
    description: 'Allow campaign measurement when Care Atlas enables a marketing provider.'
  }
]

export function CookieConsent() {
  const [ready, setReady] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<OptionalPreferences>(defaultPreferences)

  useEffect(() => {
    const stored = readCookieConsentPreferences()
    if (stored) {
      setPreferences({
        functional: stored.functional,
        analytics: stored.analytics,
        marketing: stored.marketing
      })
    } else {
      setShowBanner(true)
    }
    setReady(true)

    const openPreferences = () => {
      const current = readCookieConsentPreferences()
      if (current) {
        setPreferences({
          functional: current.functional,
          analytics: current.analytics,
          marketing: current.marketing
        })
      }
      setShowPreferences(true)
      setShowBanner(false)
    }

    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, openPreferences)
  }, [])

  function save(next: OptionalPreferences) {
    storeCookieConsentPreferences(createCookieConsentPreferences(next))
    setPreferences(next)
    setShowBanner(false)
    setShowPreferences(false)
  }

  if (!ready) return null

  return (
    <>
      {showBanner && (
        <aside
          aria-label='Cookie notice'
          className='fixed right-4 bottom-4 left-4 z-[80] mx-auto max-w-5xl rounded-lg border border-gray-200 bg-white p-5 shadow-2xl sm:p-6'
        >
          <div className='grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center'>
            <div>
              <h2 className='text-lg font-semibold text-gray-950'>Your cookie choices</h2>
              <p className='mt-2 max-w-3xl text-sm leading-6 text-gray-600'>
                We use essential cookies to keep Care Atlas secure and working. With your permission, we also use
                optional cookies to understand performance and improve your experience.{' '}
                <Link href='/cookies' className='text-brand-700 font-semibold hover:underline'>
                  Read our Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className='grid gap-2 sm:grid-cols-3'>
              <button
                type='button'
                onClick={() => save(defaultPreferences)}
                className='focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
              >
                Reject non-essential
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowBanner(false)
                  setShowPreferences(true)
                }}
                className='focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
              >
                Manage preferences
              </button>
              <button
                type='button'
                onClick={() => save({ functional: true, analytics: true, marketing: true })}
                className='bg-brand-700 hover:bg-brand-800 focus:ring-brand-500/20 rounded-lg px-4 py-2.5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
              >
                Accept all
              </button>
            </div>
          </div>
        </aside>
      )}

      {showPreferences && (
        <div
          className='fixed inset-0 z-[90] flex items-end justify-center bg-gray-950/55 p-0 sm:items-center sm:p-4'
          role='presentation'
          onMouseDown={event => {
            if (event.target === event.currentTarget) setShowPreferences(false)
          }}
        >
          <section
            role='dialog'
            aria-modal='true'
            aria-labelledby='cookie-preferences-title'
            className='max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-white p-5 shadow-2xl sm:rounded-lg sm:p-6'
          >
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 id='cookie-preferences-title' className='text-xl font-semibold text-gray-950'>
                  Cookie preferences
                </h2>
                <p className='mt-2 text-sm leading-6 text-gray-600'>
                  Essential storage is always active. Choose whether Care Atlas may use the optional categories below.
                </p>
              </div>
              <button
                type='button'
                onClick={() => setShowPreferences(false)}
                aria-label='Close cookie preferences'
                title='Close'
                className='focus:ring-brand-500/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-hidden'
              >
                <SiteIcon name='close' className='h-5 w-5' />
              </button>
            </div>

            <div className='mt-6 divide-y divide-gray-200 border-y border-gray-200'>
              <div className='flex items-start justify-between gap-4 py-4'>
                <div>
                  <h3 className='font-semibold text-gray-950'>Strictly necessary</h3>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>Security, form protection and consent storage.</p>
                </div>
                <span className='bg-brand-50 text-brand-800 rounded-full px-3 py-1 text-xs font-semibold'>
                  Always on
                </span>
              </div>
              {preferenceRows.map(row => (
                <label key={row.key} className='flex cursor-pointer items-start justify-between gap-4 py-4'>
                  <span>
                    <span className='block font-semibold text-gray-950'>{row.title}</span>
                    <span className='mt-1 block text-sm leading-6 text-gray-600'>{row.description}</span>
                  </span>
                  <input
                    type='checkbox'
                    checked={preferences[row.key]}
                    onChange={event => setPreferences(current => ({ ...current, [row.key]: event.target.checked }))}
                    className='text-brand-600 focus:ring-brand-500/20 mt-1 h-5 w-5 shrink-0 rounded border-gray-300'
                  />
                </label>
              ))}
            </div>

            <div className='mt-6 grid gap-2 sm:grid-cols-2'>
              <button
                type='button'
                onClick={() => save(defaultPreferences)}
                className='focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
              >
                Reject non-essential
              </button>
              <button
                type='button'
                onClick={() => save(preferences)}
                className='bg-brand-700 hover:bg-brand-800 focus:ring-brand-500/20 rounded-lg px-4 py-2.5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
              >
                Save preferences
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
