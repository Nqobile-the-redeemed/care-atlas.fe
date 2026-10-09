'use client'

import { useState } from 'react'
import type { TenderShareData } from '@/lib/tenders/tenderShare'
import { SiteIcon } from '../SiteIcon'
import { Button, buttonStyles } from '../ui'

export function TenderShareModalContent({ data }: { data: TenderShareData; onClose: () => void }) {
  const [status, setStatus] = useState('')
  const encodedUrl = encodeURIComponent(data.publicUrl)
  async function copy() {
    try {
      await navigator.clipboard.writeText(data.publicUrl)
      setStatus('Tender link copied.')
    } catch {
      setStatus('Clipboard access was blocked. Select and copy the link below.')
    }
  }
  async function share() {
    if (!navigator.share) return copy()
    try {
      await navigator.share({ title: data.title, url: data.publicUrl })
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setStatus('Unable to open sharing. You can copy the link instead.')
    }
  }
  return (
    <div className='space-y-4 p-4 md:p-6'>
      <h3 className='text-lg font-semibold text-gray-950'>{data.title}</h3>
      <a href={data.publicUrl} className='text-brand-700 block text-sm break-all underline'>
        {data.publicUrl}
      </a>
      <div className='grid gap-2 sm:grid-cols-2'>
        <Button onClick={() => void share()} fullWidth leftIcon={<SiteIcon name='share' className='h-4 w-4' />}>
          Share
        </Button>
        <Button
          onClick={() => void copy()}
          variant='secondary'
          fullWidth
          leftIcon={<SiteIcon name='link' className='h-4 w-4' />}
        >
          Copy link
        </Button>
      </div>
      <div className='grid gap-2 sm:grid-cols-3'>
        <a
          href={`https://wa.me/?text=${encodedUrl}`}
          target='_blank'
          rel='noreferrer'
          className={buttonStyles({ variant: 'secondary', fullWidth: true })}
        >
          WhatsApp
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target='_blank'
          rel='noreferrer'
          className={buttonStyles({ variant: 'secondary', fullWidth: true })}
        >
          LinkedIn
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(data.title)}&body=${encodedUrl}`}
          className={buttonStyles({ variant: 'secondary', fullWidth: true })}
        >
          Email
        </a>
      </div>
      <p role='status' aria-live='polite' className='min-h-5 text-sm text-gray-600'>
        {status}
      </p>
    </div>
  )
}
