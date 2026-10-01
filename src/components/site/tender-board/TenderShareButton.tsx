'use client'

import { useEffect, useRef, useState } from 'react'

import type { PublicTender } from '@/lib/api/tenders'
import { trackEvent } from '@/components/analytics/trackEvent'

import { SiteIcon } from '../SiteIcon'

export function TenderShareButton({ tender }: { tender: PublicTender }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const url = typeof window === 'undefined' ? `/tenders/${tender.id}` : `${window.location.origin}/tenders/${tender.id}`
  const text = `${tender.title}${tender.buyer ? ` — ${tender.buyer}` : ''}`

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: tender.title, text, url })
        trackEvent('tender_shared', { share_method: 'native' })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    setOpen(current => {
      const nextOpen = !current
      if (nextOpen) trackEvent('tender_share_menu_opened')
      return nextOpen
    })
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    trackEvent('tender_shared', { share_method: 'copy_link' })
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(text)

  return (
    <div ref={rootRef} className='relative'>
      <button
        type='button'
        onClick={() => void share()}
        aria-expanded={open}
        aria-haspopup='menu'
        title='Share tender'
        className='focus:ring-brand-500/20 flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
      >
        <SiteIcon name='share' className='h-4 w-4' />
        Share
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 bottom-12 z-20 w-52 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl'
        >
          <button
            type='button'
            role='menuitem'
            onClick={() => void copyLink()}
            className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50'
          >
            <SiteIcon name={copied ? 'check' : 'link'} className='h-4 w-4' />
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            role='menuitem'
            href={`mailto:?subject=${encodeURIComponent(tender.title)}&body=${encodedText}%0A%0A${encodedUrl}`}
            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
          >
            <SiteIcon name='mail' className='h-4 w-4' /> Email
          </a>
          <a
            role='menuitem'
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
          >
            <SiteIcon name='message' className='h-4 w-4' /> WhatsApp
          </a>
          <a
            role='menuitem'
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50'
          >
            <SiteIcon name='share' className='h-4 w-4' /> LinkedIn
          </a>
        </div>
      )}
    </div>
  )
}
