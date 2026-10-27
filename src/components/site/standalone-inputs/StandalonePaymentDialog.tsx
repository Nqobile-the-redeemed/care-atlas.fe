'use client'

import { useEffect } from 'react'

import { SiteIcon } from '../SiteIcon'

import type { ReactNode } from 'react'

interface StandalonePaymentDialogProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  busy?: boolean
  onClose: () => void
}

export function StandalonePaymentDialog({
  title,
  description,
  children,
  footer,
  busy = false,
  onClose
}: StandalonePaymentDialogProps) {
  const titleId = `payment-dialog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [busy, onClose])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm'>
      <section
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900'
      >
        <header className='flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-700'>
          <div>
            <h2 id={titleId} className='text-lg font-semibold text-slate-950 dark:text-white'>
              {title}
            </h2>
            {description ? <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>{description}</p> : null}
          </div>
          <button
            type='button'
            onClick={onClose}
            disabled={busy}
            aria-label='Close payment dialog'
            className='grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          >
            <SiteIcon name='close' className='h-5 w-5' />
          </button>
        </header>

        <div className='space-y-5 p-5 sm:p-6'>{children}</div>

        {footer ? (
          <footer className='border-t border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-700'>{footer}</footer>
        ) : null}
      </section>
    </div>
  )
}
