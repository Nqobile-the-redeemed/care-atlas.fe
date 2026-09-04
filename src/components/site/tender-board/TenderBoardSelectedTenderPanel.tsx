'use client'

import type { TenderBoardSelectedTender } from './types'

import { SiteIcon } from '../SiteIcon'
import { Button, ButtonLink } from '../ui'

import { dateLabel, hasTenderDetails, money, plainText, valueLabel, yesNo } from './utils'

type TenderBoardSelectedTenderPanelProps = {
  selectedTender: TenderBoardSelectedTender | null
  detailsLoading: boolean
  onBookMeeting: () => void
  onSendEnquiry: () => void
}

export function TenderBoardSelectedTenderPanel({
  selectedTender,
  detailsLoading,
  onBookMeeting,
  onSendEnquiry
}: TenderBoardSelectedTenderPanelProps) {
  if (!selectedTender) return null

  const detailedTender = hasTenderDetails(selectedTender) ? selectedTender : null

  return (
    <>
      <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Buyer</p>
          <p className='mt-1 font-semibold text-gray-950'>{selectedTender.buyer ?? 'Not stated'}</p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Support fee from</p>
          <p className='mt-1 font-semibold text-gray-950'>
            {money(selectedTender.indicativePricing.upfrontFeeMinor, selectedTender.indicativePricing.currency)}
          </p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Deadline</p>
          <p className='mt-1 font-semibold text-gray-950'>{dateLabel(selectedTender.submissionDeadline)}</p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Value</p>
          <p className='mt-1 font-semibold text-gray-950'>{valueLabel(selectedTender)}</p>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col'>
        <Button onClick={onBookMeeting} size='sm' fullWidth leftIcon={<SiteIcon name='calendar' className='h-4 w-4' />}>
          Book meeting
        </Button>
        <Button
          variant='secondary'
          onClick={onSendEnquiry}
          size='sm'
          fullWidth
          leftIcon={<SiteIcon name='mail' className='h-4 w-4' />}
        >
          Send enquiry
        </Button>
      </div>

      <section className='mt-5 border-t border-gray-200 pt-5'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='text-base font-semibold text-gray-950'>Scope</h3>
          {detailsLoading && <span className='text-xs font-medium text-gray-500'>Loading details...</span>}
        </div>
        <p className='mt-3 max-h-72 overflow-y-auto text-sm leading-6 whitespace-pre-wrap text-gray-700'>
          {plainText(detailedTender?.description || selectedTender.summary)}
        </p>
      </section>

      {detailedTender?.lots && detailedTender.lots.length > 0 && (
        <section className='mt-5 border-t border-gray-200 pt-5'>
          <h3 className='text-base font-semibold text-gray-950'>Lots</h3>
          <div className='mt-3 space-y-3'>
            {detailedTender.lots.map(lot => (
              <div key={lot.id} className='rounded-lg border border-gray-200 p-3'>
                <p className='text-sm font-semibold text-gray-950'>{lot.title}</p>
                {lot.description && (
                  <p className='mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-600'>
                    {plainText(lot.description)}
                  </p>
                )}
                <div className='mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500'>
                  <span>{money(lot.valueMinor, lot.currency)}</span>
                  <span>{dateLabel(lot.submissionDeadline)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {detailedTender && (
        <section className='mt-5 border-t border-gray-200 pt-5'>
          <h3 className='text-base font-semibold text-gray-950'>Tender details</h3>
          <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
            <div>
              <dt className='text-xs text-gray-500'>Stage</dt>
              <dd className='mt-1 font-semibold text-gray-950 capitalize'>
                {detailedTender.stage?.replaceAll(',', ', ') ?? 'Not stated'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Procedure</dt>
              <dd className='mt-1 font-semibold text-gray-950'>{detailedTender.procedureType ?? 'Not stated'}</dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>SME suitable</dt>
              <dd className='mt-1 font-semibold text-gray-950'>{yesNo(detailedTender.smeSuitable)}</dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Framework</dt>
              <dd className='mt-1 font-semibold text-gray-950'>{yesNo(detailedTender.isFramework)}</dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>CPV codes</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.cpvCodes.length > 0 ? detailedTender.cpvCodes.join(', ') : 'Not stated'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Locations</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.deliveryLocations.length > 0
                  ? detailedTender.deliveryLocations.join(', ')
                  : detailedTender.region}
              </dd>
            </div>
          </dl>
          <div className='mt-4 flex flex-col gap-2'>
            {detailedTender.sourceNoticeUrl && (
              <ButtonLink
                href={detailedTender.sourceNoticeUrl}
                target='_blank'
                rel='noreferrer'
                variant='tertiary'
                size='sm'
                fullWidth
                rightIcon={<SiteIcon name='arrow' className='h-4 w-4' />}
              >
                Original notice
              </ButtonLink>
            )}
            {detailedTender.responsePortalUrl && (
              <ButtonLink
                href={detailedTender.responsePortalUrl}
                target='_blank'
                rel='noreferrer'
                variant='tertiary'
                size='sm'
                fullWidth
                rightIcon={<SiteIcon name='arrow' className='h-4 w-4' />}
              >
                Response portal
              </ButtonLink>
            )}
          </div>
        </section>
      )}
    </>
  )
}
