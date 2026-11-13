'use client'

import type { TenderBoardSelectedTender } from './types'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

import { dateLabel, hasTenderDetails, money, plainText, valueLabel, yesNo } from './utils'
import { TenderShareButton } from './TenderShareButton'
import { TenderCareSpecificationSummary } from './TenderCareSpecificationFilters'

type TenderBoardSelectedTenderPanelProps = {
  selectedTender: TenderBoardSelectedTender | null
  detailsLoading: boolean
  onBookMeeting: () => void
  onSendEnquiry: () => void
}

function applicationSignupHref(tenderId: string) {
  const configured = process.env.NEXT_PUBLIC_ORBIT_MIRAI_SIGNUP_URL ?? 'https://app.orbitmirai.com/sign-up'
  const target = new URL(configured, 'https://app.orbitmirai.com')
  target.searchParams.set('package', 'tender_basics')
  target.searchParams.set('source', 'care_atlas')
  target.searchParams.set('redirectTo', `/tenders?highlight=${encodeURIComponent(tenderId)}&action=apply`)
  target.searchParams.set('tender', tenderId)
  return target.toString()
}

export function TenderBoardSelectedTenderPanel({
  selectedTender,
  detailsLoading,
  onBookMeeting,
  onSendEnquiry
}: TenderBoardSelectedTenderPanelProps) {
  if (!selectedTender) return null

  const detailedTender = hasTenderDetails(selectedTender) ? selectedTender : null
  const servicePricing = selectedTender.servicePricing
  return (
    <>
      {selectedTender.bidStatusLabel && (
        <p
          className={`mt-4 rounded-lg border p-3 text-sm font-semibold ${selectedTender.bidStatus === 'feedback_only' ? 'border-amber-300 bg-amber-50 text-amber-950' : 'border-blue-200 bg-blue-50 text-blue-950'}`}
        >
          {selectedTender.bidStatusLabel}
        </p>
      )}
      <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Buyer</p>
          <p className='mt-1 font-semibold text-gray-950'>{selectedTender.buyer ?? 'Not stated'}</p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Single tender service</p>
          <p className='mt-1 font-semibold text-gray-950'>
            {servicePricing
              ? `${money(servicePricing.singleTenderPence, servicePricing.currency)} + VAT`
              : 'View current pricing in Orbit Mirai'}
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
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Regions</p>
          <p className='mt-1 font-semibold text-gray-950'>
            {selectedTender.regions.join(', ') || selectedTender.region || 'UK-wide'}
          </p>
        </div>
        <div className='rounded-lg bg-gray-50 p-3'>
          <p className='text-xs text-gray-500'>Reference</p>
          <p className='mt-1 font-semibold text-gray-950'>{selectedTender.sourceReference ?? selectedTender.id}</p>
        </div>
      </div>

      <section className='border-brand-200 bg-brand-50 mt-4 rounded-lg border p-4'>
        <p className='text-brand-800 text-xs font-semibold tracking-wide uppercase'>Tender Application Service</p>
        <div className='mt-3 grid gap-3 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-gray-600'>Single tender</p>
            <p className='mt-1 font-semibold text-gray-950'>
              {servicePricing
                ? `${money(servicePricing.singleTenderPence, servicePricing.currency)} + VAT`
                : 'View current pricing in Orbit Mirai'}
            </p>
          </div>
          <div>
            <p className='text-xs text-gray-600'>Bulk applications (2+)</p>
            <p className='mt-1 font-semibold text-gray-950'>
              {servicePricing
                ? `${money(servicePricing.bulkUnitPence, servicePricing.currency)} + VAT each`
                : 'Available in Orbit Mirai'}
            </p>
          </div>
        </div>
        <p className='text-brand-900 mt-3 text-sm font-semibold'>No success fee.</p>
        <p className='mt-2 text-xs leading-5 text-gray-600'>
          Care Atlas provides a managed tender-writing and application service. Pricing excludes VAT. Tender awards are
          not guaranteed. Engagements require scope assessment and a tender-specific service agreement.
        </p>
      </section>

      <div className='mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col'>
        <a
          href={applicationSignupHref(selectedTender.id)}
          className='bg-brand-600 hover:bg-brand-700 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white'
        >
          Apply for Tender
        </a>
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
        <TenderShareButton tender={selectedTender} fullWidth />
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

      <TenderCareSpecificationSummary profile={selectedTender.careSpecification} />

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
              <dt className='text-xs text-gray-500'>Opportunity stage</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.lifecycleStageLabel ?? 'Not classified'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Who can respond now</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.bidStatusLabel ?? 'Availability unknown'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Award procedure</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.procedureRouteLabel ?? 'Not classified'}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Purchasing arrangement</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.commercialVehicleLabels?.join(', ') || 'Standalone or not classified'}
              </dd>
            </div>
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
            <div>
              <dt className='text-xs text-gray-500'>Original notice</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.sourceNoticeUrl ? (
                  <a
                    href={detailedTender.sourceNoticeUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-brand-700 hover:underline'
                  >
                    Open source
                  </a>
                ) : (
                  'Not stated'
                )}
              </dd>
            </div>
            <div>
              <dt className='text-xs text-gray-500'>Response portal</dt>
              <dd className='mt-1 font-semibold text-gray-950'>
                {detailedTender.responsePortalUrl ? (
                  <a
                    href={detailedTender.responsePortalUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='text-brand-700 hover:underline'
                  >
                    Open portal
                  </a>
                ) : (
                  'Not stated'
                )}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </>
  )
}
