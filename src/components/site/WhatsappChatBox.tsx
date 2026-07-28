'use client'

import { useEffect, useMemo, useState } from 'react'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha'
import { ApiError } from '@/lib/api/client'
import { verifyCareAtlasWhatsappIntent } from '@/lib/api/whatsapp'

const whatsappNumber = process.env.NEXT_PUBLIC_CARE_ATLAS_WHATSAPP_NUMBER ?? ''
const defaultMessage =
  process.env.NEXT_PUBLIC_CARE_ATLAS_WHATSAPP_MESSAGE ?? 'Hello Care Atlas, I would like to make an enquiry.'

const options = [
  {
    intent: 'general_enquiry',
    label: 'General enquiry',
    message: defaultMessage
  },
  {
    intent: 'care_consultation',
    label: 'Care consultation',
    message: 'Hello Care Atlas, I would like to book a care business consultation.'
  },
  {
    intent: 'referral',
    label: 'Referral support',
    message: 'Hello Care Atlas, I would like support with a care referral or provider enquiry.'
  },
  {
    intent: 'domiciliary_care',
    label: 'Domiciliary care support',
    message: 'Hello Care Atlas, I would like to discuss domiciliary care support.'
  },
  {
    intent: 'supported_living',
    label: 'Supported living',
    message: 'Hello Care Atlas, I would like to discuss supported living support.'
  },
  {
    intent: 'recruitment',
    label: 'Recruitment enquiry',
    message: 'Hello Care Atlas, I would like to discuss care recruitment support.'
  }
]

function buildWhatsappUrl(message: string) {
  return `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

function wait(ms: number) {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

export function WhatsappChatBox() {
  const [open, setOpen] = useState(false)
  const [startedAt] = useState(() => Math.floor(Date.now() / 1000))
  const [loadingIntent, setLoadingIntent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const enabled = useMemo(() => whatsappNumber.replace(/\D/g, '').length >= 10, [])

  useEffect(() => {
    if (enabled) {
      preloadRecaptcha()
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  async function startChat(intent: string, message: string) {
    setError(null)
    setLoadingIntent(intent)

    try {
      const elapsed = Math.floor(Date.now() / 1000) - startedAt
      if (elapsed < 3) {
        await wait((3 - elapsed) * 1000)
      }

      const recaptchaToken = await getRecaptchaToken('care_atlas_whatsapp')

      await verifyCareAtlasWhatsappIntent({
        intent,
        sourceUrl: window.location.href,
        formStartedAt: startedAt,
        recaptchaToken,
        recaptchaAction: 'care_atlas_whatsapp'
      })

      window.open(buildWhatsappUrl(message), '_blank', 'noopener,noreferrer')
      setOpen(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'WhatsApp chat could not be verified. Please try again.')
    } finally {
      setLoadingIntent(null)
    }
  }

  return (
    <div className='fixed right-4 bottom-4 z-9999 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6'>
      {open && (
        <div className='border-brand-100 w-[min(92vw,380px)] overflow-hidden rounded-lg border bg-white shadow-2xl'>
          <div className='bg-brand-700 px-4 py-3 text-white'>
            <p className='text-sm font-bold'>Chat with Care Atlas</p>
            <p className='mt-1 text-xs text-white/80'>
              Choose a topic and we will open WhatsApp after spam protection.
            </p>
          </div>
          <div className='space-y-2 p-3'>
            {options.map(option => (
              <button
                key={option.intent}
                type='button'
                disabled={loadingIntent !== null}
                onClick={() => startChat(option.intent, option.message)}
                className='hover:border-brand-600 hover:bg-brand-25 flex min-h-11 w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-800 transition disabled:cursor-not-allowed disabled:opacity-60'
              >
                <span>{option.label}</span>
                <span className='text-brand-700 text-xs'>
                  {loadingIntent === option.intent ? 'Checking...' : 'Open'}
                </span>
              </button>
            ))}
            {error && <p className='rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700'>{error}</p>}
            <p className='text-xs leading-5 text-gray-500'>Protected by Google reCAPTCHA before WhatsApp opens.</p>
          </div>
        </div>
      )}
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
        className='flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#1EAE56] focus:ring-4 focus:ring-[#25D366]/25 focus:outline-none'
      >
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#128C4A]'>
          WA
        </span>
        <span>{open ? 'Close chat' : 'WhatsApp chat'}</span>
      </button>
    </div>
  )
}
