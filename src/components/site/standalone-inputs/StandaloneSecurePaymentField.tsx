import { SiteIcon } from '../SiteIcon'

import type { ReactNode } from 'react'

interface StandaloneSecurePaymentFieldProps {
  label?: string
  description?: string
  error?: string
  children: ReactNode
}

export function StandaloneSecurePaymentField({
  label = 'Payment details',
  description = 'Your payment details are encrypted and handled by the payment provider.',
  error,
  children
}: StandaloneSecurePaymentFieldProps) {
  return (
    <section aria-label={label} className='space-y-3'>
      <div className='flex items-start gap-3'>
        <span className='grid h-9 w-9 shrink-0 place-items-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200'>
          <SiteIcon name='lock' className='h-4 w-4' />
        </span>
        <div>
          <h3 className='font-semibold text-slate-950 dark:text-white'>{label}</h3>
          <p className='mt-0.5 text-sm text-slate-600 dark:text-slate-300'>{description}</p>
        </div>
      </div>

      <div className='rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950'>
        {children}
      </div>

      {error ? (
        <p role='alert' className='flex items-start gap-2 text-sm text-red-600 dark:text-red-300'>
          <SiteIcon name='alertCircle' className='mt-0.5 h-4 w-4 shrink-0' />
          {error}
        </p>
      ) : null}
    </section>
  )
}
