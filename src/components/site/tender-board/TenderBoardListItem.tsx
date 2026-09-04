'use client'

import type { PublicTender, TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

import { dateLabel, valueLabel } from './utils'

type TenderBoardListItemProps = {
  tender: PublicTender
  isSelected: boolean
  onOpenDetails: (tender: PublicTender) => void
  onOpenForm: (tender: PublicTender, kind: TenderLeadKind) => void
}

export function TenderBoardListItem({ tender, isSelected, onOpenDetails, onOpenForm }: TenderBoardListItemProps) {
  return (
    <article className={`p-4 transition ${isSelected ? 'bg-brand-25' : 'bg-white hover:bg-gray-50'}`}>
      <button type='button' className='block w-full text-left' onClick={() => onOpenDetails(tender)}>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-gray-950'>{tender.title}</h2>
            <p className='mt-1 text-sm text-gray-600'>
              {tender.buyer ?? 'Buyer not stated'} · {tender.sourceReference ?? 'No reference'}
            </p>
          </div>
          <span className='bg-brand-50 text-brand-700 w-fit rounded-full px-3 py-1 text-xs font-semibold'>
            {tender.daysRemaining === null ? 'Deadline TBC' : `${tender.daysRemaining} days left`}
          </span>
        </div>
        <p className='mt-3 line-clamp-2 text-sm leading-6 text-gray-600'>{tender.summary}</p>
        <dl className='mt-4 grid gap-3 text-sm sm:grid-cols-3'>
          <div>
            <dt className='text-xs text-gray-500'>Value</dt>
            <dd className='mt-1 font-semibold text-gray-950'>{valueLabel(tender)}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-500'>Deadline</dt>
            <dd className='mt-1 font-semibold text-gray-950'>{dateLabel(tender.submissionDeadline)}</dd>
          </div>
          <div>
            <dt className='text-xs text-gray-500'>Region</dt>
            <dd className='mt-1 font-semibold text-gray-950'>{tender.region}</dd>
          </div>
        </dl>
      </button>
      <div className='mt-4 flex flex-col gap-2 sm:flex-row'>
        <Button
          onClick={() => onOpenForm(tender, 'booking')}
          fullWidth
          className='sm:w-fit'
          leftIcon={<SiteIcon name='calendar' className='h-4 w-4' />}
        >
          Book meeting
        </Button>
        <Button
          variant='secondary'
          onClick={() => onOpenForm(tender, 'enquiry')}
          fullWidth
          className='sm:w-fit'
          leftIcon={<SiteIcon name='mail' className='h-4 w-4' />}
        >
          Send enquiry
        </Button>
        <Button
          variant='secondary'
          onClick={() => onOpenDetails(tender)}
          fullWidth
          className='border-gray-300 text-gray-800 hover:border-gray-300 hover:bg-gray-50 sm:w-fit'
          leftIcon={<SiteIcon name='file' className='h-4 w-4' />}
        >
          Open details
        </Button>
      </div>
    </article>
  )
}
