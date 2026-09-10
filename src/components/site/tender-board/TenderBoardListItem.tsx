'use client'

import type { PublicTender, TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

import { dateLabel, valueLabel } from './utils'

type TenderBoardListItemProps = {
  tender: PublicTender
  isSelected: boolean
  variant?: 'list' | 'grid'
  onOpenDetails: (tender: PublicTender) => void
  onOpenForm: (tender: PublicTender, kind: TenderLeadKind) => void
}

function sourceLabel(tender: PublicTender) {
  if (tender.sourceKey === 'proactis_due_north') return 'Proactis'
  if (tender.sourceKey === 'find_a_tender') return 'GOV.UK'
  if (tender.sourceKey === 'contracts_finder') return 'Contracts Finder'

  return tender.sourceName ?? 'Source'
}

function TenderMeta({ tender, compact = false }: { tender: PublicTender; compact?: boolean }) {
  return (
    <dl className={`mt-4 grid gap-3 text-sm ${compact ? 'grid-cols-2' : 'sm:grid-cols-4'}`}>
      <div>
        <dt className='text-xs text-gray-500'>Value</dt>
        <dd className='mt-1 font-semibold text-gray-950'>{valueLabel(tender)}</dd>
      </div>
      <div>
        <dt className='text-xs text-gray-500'>Published</dt>
        <dd className='mt-1 font-semibold text-gray-950'>{dateLabel(tender.publishedAt)}</dd>
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
  )
}

function TenderBadges({ tender }: { tender: PublicTender }) {
  return (
    <div className='mt-3 flex flex-wrap gap-1.5'>
      <span className='border-brand-100 bg-brand-25 text-brand-800 rounded-full border px-2 py-0.5 text-[11px] font-semibold'>
        {sourceLabel(tender)}
      </span>
      <span className='rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600'>
        {tender.category}
      </span>
      {tender.states.map(state => (
        <span
          key={state}
          className='border-brand-100 bg-brand-25 text-brand-800 rounded-full border px-2 py-0.5 text-[11px] font-semibold'
        >
          {state.replaceAll('_', ' ')}
        </span>
      ))}
    </div>
  )
}

export function TenderBoardListItem({
  tender,
  isSelected,
  variant = 'list',
  onOpenDetails,
  onOpenForm
}: TenderBoardListItemProps) {
  if (variant === 'grid') {
    return (
      <article
        className={`flex h-full flex-col rounded-lg border p-4 shadow-sm transition ${
          isSelected
            ? 'border-brand-200 bg-brand-25'
            : 'hover:border-brand-200 hover:shadow-theme-md border-gray-200 bg-white'
        }`}
      >
        <button type='button' className='block flex-1 text-left' onClick={() => onOpenDetails(tender)}>
          <div className='flex items-start justify-between gap-3'>
            <h2 className='line-clamp-3 text-base font-semibold text-gray-950'>{tender.title}</h2>
            <span className='bg-brand-50 text-brand-700 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold'>
              {tender.daysRemaining === null ? 'TBC' : `${tender.daysRemaining}d`}
            </span>
          </div>
          <p className='mt-2 line-clamp-2 text-sm text-gray-600'>{tender.buyer ?? 'Buyer not stated'}</p>
          <TenderBadges tender={tender} />
          <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-600'>
            {tender.summary || 'No summary available.'}
          </p>
          <TenderMeta tender={tender} compact />
        </button>
        <div className='mt-4 grid gap-2'>
          <Button
            onClick={() => onOpenForm(tender, 'booking')}
            fullWidth
            leftIcon={<SiteIcon name='calendar' className='h-4 w-4' />}
          >
            Book meeting
          </Button>
          <Button
            variant='secondary'
            onClick={() => onOpenDetails(tender)}
            fullWidth
            leftIcon={<SiteIcon name='file' className='h-4 w-4' />}
          >
            Open details
          </Button>
        </div>
      </article>
    )
  }

  return (
    <article className={`p-4 transition ${isSelected ? 'bg-brand-25' : 'bg-white hover:bg-gray-50'}`}>
      <button type='button' className='block w-full text-left' onClick={() => onOpenDetails(tender)}>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h2 className='text-lg font-semibold text-gray-950'>{tender.title}</h2>
            <p className='mt-1 text-sm text-gray-600'>
              {tender.buyer ?? 'Buyer not stated'} · {tender.sourceReference ?? 'No reference'}
            </p>
            <TenderBadges tender={tender} />
          </div>
          <span className='bg-brand-50 text-brand-700 w-fit rounded-full px-3 py-1 text-xs font-semibold'>
            {tender.daysRemaining === null ? 'Deadline TBC' : `${tender.daysRemaining} days left`}
          </span>
        </div>
        <p className='mt-3 line-clamp-2 text-sm leading-6 text-gray-600'>{tender.summary || 'No summary available.'}</p>
        <TenderMeta tender={tender} />
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
