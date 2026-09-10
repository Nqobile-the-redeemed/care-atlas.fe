'use client'

import type { PublicTender, TenderLeadKind } from '@/lib/api/tenders'

import { TenderBoardListItem } from './TenderBoardListItem'
import type { TenderBoardViewMode } from './TenderBoardFilters'

type TenderBoardListProps = {
  loading: boolean
  tenders: PublicTender[]
  viewMode?: TenderBoardViewMode
  selectedTenderId?: string
  onOpenDetails: (tender: PublicTender) => void
  onOpenForm: (tender: PublicTender, kind: TenderLeadKind) => void
}

export function TenderBoardList({
  loading,
  tenders,
  viewMode = 'list',
  selectedTenderId,
  onOpenDetails,
  onOpenForm
}: TenderBoardListProps) {
  if (loading) {
    return (
      <div className={viewMode === 'grid' ? 'grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-3 p-4'}>
        {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, index) => (
          <div key={index} className='h-36 animate-pulse rounded-lg bg-gray-100' />
        ))}
      </div>
    )
  }

  if (tenders.length === 0) {
    return (
      <div className='p-8'>
        <p className='text-base font-semibold text-gray-950'>No tender previews available yet.</p>
        <p className='mt-2 text-sm leading-6 text-gray-600'>
          Care Atlas can still take a tender support enquiry while new public-board integrations are being added.
        </p>
      </div>
    )
  }

  return (
    <div className={viewMode === 'grid' ? 'grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3' : 'divide-y divide-gray-200'}>
      {tenders.map(tender => (
        <TenderBoardListItem
          key={tender.id}
          tender={tender}
          variant={viewMode}
          isSelected={selectedTenderId === tender.id}
          onOpenDetails={onOpenDetails}
          onOpenForm={onOpenForm}
        />
      ))}
    </div>
  )
}
