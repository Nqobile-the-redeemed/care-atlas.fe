'use client'

import type { PublicTender, TenderLeadKind } from '@/lib/api/tenders'

import { TenderBoardListItem } from './TenderBoardListItem'

type TenderBoardListProps = {
  loading: boolean
  tenders: PublicTender[]
  selectedTenderId?: string
  onOpenDetails: (tender: PublicTender) => void
  onOpenForm: (tender: PublicTender, kind: TenderLeadKind) => void
}

export function TenderBoardList({
  loading,
  tenders,
  selectedTenderId,
  onOpenDetails,
  onOpenForm
}: TenderBoardListProps) {
  if (loading) {
    return <p className='p-8 text-sm text-gray-600'>Loading tender opportunities...</p>
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
    <div className='divide-y divide-gray-200'>
      {tenders.map(tender => (
        <TenderBoardListItem
          key={tender.id}
          tender={tender}
          isSelected={selectedTenderId === tender.id}
          onOpenDetails={onOpenDetails}
          onOpenForm={onOpenForm}
        />
      ))}
    </div>
  )
}
