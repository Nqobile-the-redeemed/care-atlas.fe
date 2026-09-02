'use client'

import type { PublicTender, TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'

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
        <button
          type='button'
          onClick={() => onOpenForm(tender, 'booking')}
          className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
        >
          <SiteIcon name='calendar' className='h-4 w-4' />
          Book meeting
        </button>
        <button
          type='button'
          onClick={() => onOpenForm(tender, 'enquiry')}
          className='border-brand-200 text-brand-800 hover:bg-brand-50 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold focus:ring-4 focus:outline-hidden'
        >
          <SiteIcon name='mail' className='h-4 w-4' />
          Send enquiry
        </button>
        <button
          type='button'
          onClick={() => onOpenDetails(tender)}
          className='focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
        >
          <SiteIcon name='file' className='h-4 w-4' />
          Open details
        </button>
      </div>
    </article>
  )
}
