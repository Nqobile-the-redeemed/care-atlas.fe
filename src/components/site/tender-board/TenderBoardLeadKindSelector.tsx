'use client'

import type { Dispatch, SetStateAction } from 'react'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

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
            <Button
              key={option.value}
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              variant={active ? 'primary' : 'tertiary'}
              fullWidth
              className={active ? 'rounded-md shadow-sm' : 'rounded-md text-gray-700 hover:bg-gray-100'}
              leftIcon={<SiteIcon name={option.icon} className='h-4 w-4' />}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
