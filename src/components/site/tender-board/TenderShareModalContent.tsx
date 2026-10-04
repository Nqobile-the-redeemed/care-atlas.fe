'use client'

import { useState } from 'react'

import { trackEvent } from '@/components/analytics/trackEvent'
import { buildTenderShareText, type TenderShareData } from '@/lib/tenders/tenderShare'

import { SiteIcon } from '../SiteIcon'
import { Button, buttonStyles } from '../ui'

type TenderShareModalContentProps = {
  data: TenderShareData
  onClose: () => void
}

export function TenderShareModalContent({ data }: TenderShareModalContentProps) {
  const [status, setStatus] = useState('')
  const advert = buildTenderShareText(data)
  const nativeAdvert = buildTenderShareText(data, { includeUrl: false })
  const encodedAdvert = encodeURIComponent(advert)
  const encodedUrl = encodeURIComponent(data.publicUrl)

  async function copy(value: string, method: 'copy_advert' | 'copy_link', successMessage: string) {
    setStatus('')

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.')
      await navigator.clipboard.writeText(value)
      trackEvent('tender_shared', { share_method: method })
      setStatus(successMessage)
    } catch {
      setStatus('Copying was blocked by your browser. Select the advert preview and copy it manually.')
    }
  }

  async function shareNative() {
    const payload = { title: data.title, text: nativeAdvert, url: data.publicUrl }

    if (!navigator.share || (navigator.canShare && !navigator.canShare(payload))) {
      await copy(advert, 'copy_advert', 'Sharing is unavailable in this browser, so the advert was copied instead.')
      return
    }

    setStatus('')
    try {
      await navigator.share(payload)
      trackEvent('tender_shared', { share_method: 'native' })
      setStatus('Tender shared.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setStatus('The share sheet could not open. You can still copy the advert or link below.')
    }
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <section aria-labelledby='tender-share-preview-title'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Ready to share</p>
            <h3 id='tender-share-preview-title' className='mt-1 text-lg font-semibold text-gray-950'>
              Tender advert preview
            </h3>
          </div>
          <span className='bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-semibold'>Public link</span>
        </div>

        <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 break-words whitespace-pre-wrap text-gray-700'>
          {advert}
        </div>
      </section>

      <section aria-labelledby='tender-share-actions-title'>
        <h3 id='tender-share-actions-title' className='text-sm font-semibold text-gray-950'>
          Share or copy
        </h3>
        <div className='mt-3 grid gap-2 sm:grid-cols-3'>
          <Button onClick={() => void shareNative()} fullWidth leftIcon={<SiteIcon name='share' className='h-4 w-4' />}>
            Share
          </Button>
          <Button
            variant='secondary'
            onClick={() => void copy(advert, 'copy_advert', 'Tender advert copied.')}
            fullWidth
            leftIcon={<SiteIcon name='clipboard' className='h-4 w-4' />}
          >
            Copy advert
          </Button>
          <Button
            variant='secondary'
            onClick={() => void copy(data.publicUrl, 'copy_link', 'Tender link copied.')}
            fullWidth
            leftIcon={<SiteIcon name='link' className='h-4 w-4' />}
          >
            Copy link
          </Button>
        </div>
        <p role='status' aria-live='polite' className='mt-3 min-h-5 text-sm text-gray-600'>
          {status}
        </p>
      </section>

      <section className='border-t border-gray-200 pt-5' aria-labelledby='tender-share-shortcuts-title'>
        <h3 id='tender-share-shortcuts-title' className='text-sm font-semibold text-gray-950'>
          Share with
        </h3>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          LinkedIn receives the public link. Copy the advert first if you want to add the full details to your post.
        </p>
        <div className='mt-3 grid gap-2 sm:grid-cols-3'>
          <a
            href={`https://wa.me/?text=${encodedAdvert}`}
            target='_blank'
            rel='noreferrer'
            onClick={() => trackEvent('tender_shared', { share_method: 'whatsapp' })}
            className={buttonStyles({ variant: 'secondary', fullWidth: true })}
          >
            <SiteIcon name='message' className='h-4 w-4' />
            <span>WhatsApp</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target='_blank'
            rel='noreferrer'
            onClick={() => trackEvent('tender_shared', { share_method: 'linkedin' })}
            className={buttonStyles({ variant: 'secondary', fullWidth: true })}
          >
            <SiteIcon name='share' className='h-4 w-4' />
            <span>LinkedIn</span>
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(`Tender opportunity: ${data.title}`)}&body=${encodedAdvert}`}
            onClick={() => trackEvent('tender_shared', { share_method: 'email' })}
            className={buttonStyles({ variant: 'secondary', fullWidth: true })}
          >
            <SiteIcon name='mail' className='h-4 w-4' />
            <span>Email</span>
          </a>
        </div>
      </section>
    </div>
  )
}
