'use client'

import type { Dispatch, SetStateAction } from 'react'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'

type TenderBoardLeadKindSelectorProps = {
  value: TenderLeadKind
  onChange: Dispatch<SetStateAction<TenderLeadKind>>
}

const options: Array<{ value: TenderLeadKind; label: string; icon: string }> = [
  { value: 'enquiry', label: 'Enquiry', icon: 'mail' },
  { value: 'booking', label: 'Booking', icon: 'calendar' }
]

export function TenderBoardLeadKindSelector({ value, onChange }: TenderBoardLeadKindSelectorProps) {
  return (
    <div className='mt-5'>
      <p className='font-neue text-gray-mediumGray mb-2 text-xs font-semibold uppercase dark:text-slate-300'>
        How can we help?
      </p>
      <div className='grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm'>
        {options.map(option => {
          const active = value === option.value

          return (
            <button
              key={option.value}
              type='button'
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition focus:ring-4 focus:ring-brand-500/10 focus:outline-hidden ${
                active ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
              }`}
            >
              <SiteIcon name={option.icon} className='h-4 w-4' />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
