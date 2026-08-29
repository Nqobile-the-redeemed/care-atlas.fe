'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '@/lib/api/client'
import { SiteIcon } from '@/components/site/SiteIcon'
import type { TenderFilters, TenderPreview } from './types'

const EMPTY_FILTERS: TenderFilters = { categories: [], regions: [] }

function formatMoney(minor: number | null, currency = 'GBP') {
  if (minor === null) return 'Not stated'

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(minor / 100)
}

function formatValue(tender: TenderPreview) {
  const { minMinor, maxMinor, currency } = tender.value
  if (minMinor === null && maxMinor === null) return 'Not stated'
  if (minMinor !== null && maxMinor !== null && minMinor !== maxMinor) {
    return `${formatMoney(minMinor, currency)} - ${formatMoney(maxMinor, currency)}`
  }

  return formatMoney(maxMinor ?? minMinor, currency)
}

function formatDate(value: string | null) {
  if (!value) return 'Not stated'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function formatTerm(tender: TenderPreview) {
  if (!tender.contractStartDate && !tender.contractEndDate) return 'Not stated'
  return `${formatDate(tender.contractStartDate)} - ${formatDate(tender.contractEndDate)}`
}

function sourceLabel(tender: TenderPreview) {
  if (tender.sourceKey === 'proactis_due_north') return 'Proactis'
  if (tender.sourceKey === 'find_a_tender') return 'GOV.UK'

  return tender.sourceName ?? 'Source'
}

function signupHref() {
  const configured = process.env.NEXT_PUBLIC_ORBIT_MIRAI_SIGNUP_URL ?? 'https://portal.orbitmirai.com/sign-up'
  const target = new URL(configured, window.location.origin)
  target.searchParams.set('plan', 'tender-navigator')
  target.searchParams.set('source', 'care-atlas')
  target.searchParams.set('returnTo', '/tenders')

  const current = new URLSearchParams(window.location.search)
  current.forEach((value, key) => {
    if (key.startsWith('utm_') || key === 'ref' || key === 'referral') {
      target.searchParams.set(key, value)
    }
  })

  return target.toString()
}

function StateBadges({ states }: { states: TenderPreview['states'] }) {
  const labels = {
    new: 'New',
    closing_soon: 'Closing soon',
    updated: 'Updated',
    framework: 'Framework'
  }

  return (
    <div className='flex flex-wrap gap-1.5'>
      {states.map(state => (
        <span
          key={state}
          className='border-brand-100 bg-brand-25 text-brand-800 rounded-full border px-2 py-0.5 text-[11px] font-semibold'
        >
          {labels[state]}
        </span>
      ))}
    </div>
  )
}

function TenderPanel({ tender, onClose }: { tender: TenderPreview; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <>
      <button
        type='button'
        aria-label='Close tender preview'
        className='fixed inset-0 z-9998 bg-gray-950/30'
        onClick={onClose}
      />
      <aside
        role='dialog'
        aria-modal='true'
        aria-labelledby='tender-preview-title'
        className='fixed top-0 right-0 z-9999 flex h-full w-full max-w-2xl flex-col border-l border-gray-200 bg-white shadow-2xl'
      >
        <header className='flex items-start justify-between gap-4 border-b border-gray-200 p-5'>
          <div>
            <p className='text-brand-700 text-xs font-semibold tracking-[0.08em] uppercase'>Locked tender preview</p>
            <h2 id='tender-preview-title' className='mt-1 text-xl font-semibold text-gray-950'>
              {tender.title}
            </h2>
            <p className='mt-1 text-sm text-gray-500'>{tender.buyer ?? 'Buyer not stated'}</p>
            <p className='mt-2'>
              <span className='border-brand-100 bg-brand-25 text-brand-800 rounded-full border px-2 py-0.5 text-[11px] font-semibold'>
                {sourceLabel(tender)}
              </span>
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close preview'
            title='Close'
            className='focus:ring-brand-500/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
          >
            <SiteIcon name='close' className='h-5 w-5' />
          </button>
        </header>

        <div className='flex-1 overflow-y-auto p-5 sm:p-6'>
          <StateBadges states={tender.states} />
          <dl className='mt-6 grid gap-4 sm:grid-cols-2'>
            {[
              ['Category', tender.category],
              ['Region', tender.region],
              ['Estimated value', formatValue(tender)],
              ['Deadline', formatDate(tender.submissionDeadline)],
              ['Days remaining', tender.daysRemaining === null ? 'Not stated' : String(tender.daysRemaining)],
              ['Contract term', formatTerm(tender)]
            ].map(([label, value]) => (
              <div key={label} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <dt className='text-xs font-semibold tracking-[0.06em] text-gray-500 uppercase'>{label}</dt>
                <dd className='mt-1 text-sm font-semibold text-gray-900'>{value}</dd>
              </div>
            ))}
          </dl>

          <section className='mt-6'>
            <h3 className='text-base font-semibold text-gray-950'>Opportunity summary</h3>
            <p className='mt-2 text-sm leading-7 text-gray-600'>{tender.summary || 'Not stated'}</p>
          </section>

          <section className='border-brand-100 bg-brand-25 mt-6 rounded-lg border p-5'>
            <div className='flex items-center gap-3'>
              <span className='bg-brand-600 flex h-10 w-10 items-center justify-center rounded-lg text-white'>
                <SiteIcon name='lock' className='h-5 w-5' />
              </span>
              <div>
                <h3 className='font-semibold text-gray-950'>Unlock complete tender details</h3>
                <p className='mt-1 text-sm text-gray-600'>14 days free, then £5 + VAT per month.</p>
              </div>
            </div>
            <ul className='mt-4 space-y-2 text-sm text-gray-700'>
              {[
                'Full notice and lot details',
                'Save tenders and filtered views',
                'Care Atlas bid-support enquiries'
              ].map(item => (
                <li key={item} className='flex gap-2'>
                  <SiteIcon name='check' className='text-success-600 mt-0.5 h-4 w-4 shrink-0' />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className='mt-6 border-t border-gray-200 pt-5'>
            <h3 className='text-sm font-semibold text-gray-950'>Indicative Care Atlas support</h3>
            <div className='mt-3 grid gap-3 sm:grid-cols-2'>
              <div className='rounded-lg border border-gray-200 p-4'>
                <p className='text-xs text-gray-500'>Upfront fee</p>
                <p className='mt-1 font-semibold text-gray-950'>
                  From {formatMoney(tender.indicativePricing.upfrontFeeMinor)}
                </p>
              </div>
              <div className='rounded-lg border border-gray-200 p-4'>
                <p className='text-xs text-gray-500'>Success fee</p>
                <p className='mt-1 font-semibold text-gray-950'>
                  {tender.indicativePricing.successFeeMinor === null
                    ? 'Assessment required'
                    : `From ${formatMoney(tender.indicativePricing.successFeeMinor)}`}
                </p>
              </div>
            </div>
            <p className='mt-3 text-xs leading-5 text-gray-500'>
              Prices exclude VAT, are indicative, do not guarantee success and require a separate engagement agreement.
            </p>
          </section>
        </div>

        <footer className='border-t border-gray-200 bg-gray-50 p-5'>
          <button
            type='button'
            onClick={() => window.location.assign(signupHref())}
            className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
          >
            Start 14-day free trial
            <SiteIcon name='arrow' className='h-4 w-4' />
          </button>
          <p className='mt-3 text-center text-xs text-gray-500'>
            Source details remain protected until your Orbit Mirai tender access is active.
          </p>
        </footer>
      </aside>
    </>
  )
}

export function PublicTenderBoard() {
  const [tenders, setTenders] = useState<TenderPreview[]>([])
  const [availableFilters, setAvailableFilters] = useState<TenderFilters>(EMPTY_FILTERS)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [appliedKeyword, setAppliedKeyword] = useState('')
  const [selected, setSelected] = useState<TenderPreview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTenders = useCallback(async () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (appliedKeyword) params.set('keyword', appliedKeyword)
    if (category) params.set('category', category)
    if (region) params.set('region', region)

    try {
      const response = await apiRequest<TenderPreview[]>(`/v1/public/tenders?${params.toString()}`, {
        cache: 'no-store'
      })
      setTenders(response.data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Tender previews could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [appliedKeyword, category, region])

  useEffect(() => {
    void loadTenders()
  }, [loadTenders])

  useEffect(() => {
    apiRequest<TenderFilters>('/v1/public/tender-filters', { cache: 'no-store' })
      .then(response => setAvailableFilters(response.data))
      .catch(() => setAvailableFilters(EMPTY_FILTERS))
  }, [])

  const lastUpdated = useMemo(() => {
    const timestamps = tenders
      .map(tender => tender.lastSeenAt)
      .filter((value): value is string => Boolean(value))
      .map(value => new Date(value).getTime())

    return timestamps.length ? formatDate(new Date(Math.max(...timestamps)).toISOString()) : 'Awaiting source update'
  }, [tenders])

  return (
    <>
      <div className='border-brand-100 overflow-hidden rounded-lg border bg-white shadow-sm'>
        <form
          className='border-b border-gray-200 bg-gray-50 p-4'
          onSubmit={event => {
            event.preventDefault()
            setAppliedKeyword(keyword.trim())
          }}
        >
          <div className='grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_220px_auto]'>
            <label className='relative'>
              <span className='sr-only'>Search tender previews</span>
              <SiteIcon name='search' className='absolute top-3.5 left-3 h-4 w-4 text-gray-400' />
              <input
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder='Search title, buyer or summary'
                className='focus:border-brand-500 focus:ring-brand-500/10 min-h-11 w-full rounded-lg border border-gray-300 bg-white pr-3 pl-10 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
              />
            </label>
            <label>
              <span className='sr-only'>Category</span>
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
                className='focus:border-brand-500 focus:ring-brand-500/10 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
              >
                <option value=''>All categories</option>
                {availableFilters.categories.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span className='sr-only'>Region</span>
              <select
                value={region}
                onChange={event => setRegion(event.target.value)}
                className='focus:border-brand-500 focus:ring-brand-500/10 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
              >
                <option value=''>All regions</option>
                {availableFilters.regions.map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button
              type='submit'
              className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
            >
              <SiteIcon name='search' className='h-4 w-4' />
              Search
            </button>
          </div>
        </form>

        <div className='flex flex-col gap-2 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm font-semibold text-gray-950'>15 of many live opportunities</p>
          <p className='text-xs text-gray-500'>Data last updated: {lastUpdated}</p>
        </div>

        {loading && (
          <div className='grid gap-3 p-4' aria-label='Loading tender previews'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='h-20 animate-pulse rounded-lg bg-gray-100' />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className='p-8 text-center'>
            <p className='text-sm font-semibold text-gray-950'>Tender previews are temporarily unavailable.</p>
            <p className='mt-2 text-sm text-gray-600'>{error}</p>
            <button
              type='button'
              onClick={() => void loadTenders()}
              className='text-brand-700 focus:ring-brand-500/20 hover:bg-brand-50 mt-5 rounded-lg px-4 py-2 text-sm font-semibold focus:ring-4 focus:outline-hidden'
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && tenders.length === 0 && (
          <div className='p-10 text-center'>
            <p className='font-semibold text-gray-950'>No current previews match these filters.</p>
            <p className='mt-2 text-sm text-gray-600'>Try a broader category, region or keyword.</p>
          </div>
        )}

        {!loading && !error && tenders.length > 0 && (
          <>
            <div className='hidden overflow-x-auto lg:block'>
              <table className='min-w-[1500px] border-collapse text-left text-sm'>
                <thead className='bg-brand-950 text-white'>
                  <tr>
                    {[
                      'Tender',
                      'Category',
                      'Region',
                      'Estimated value',
                      'Deadline',
                      'Contract term',
                      'Summary',
                      'Upfront fee',
                      'Success fee',
                      'Action'
                    ].map(heading => (
                      <th key={heading} scope='col' className='px-4 py-3 text-xs font-semibold'>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {tenders.map(tender => (
                    <tr
                      key={tender.id}
                      tabIndex={0}
                      onClick={() => setSelected(tender)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          setSelected(tender)
                        }
                      }}
                      className='hover:bg-brand-25 focus:bg-brand-25 cursor-pointer align-top transition focus:outline-hidden'
                    >
                      <td className='w-72 px-4 py-4'>
                        <p className='font-semibold text-gray-950'>{tender.title}</p>
                        <p className='mt-1 text-xs text-gray-500'>{tender.buyer ?? 'Buyer not stated'}</p>
                        <div className='mt-2'>
                          <div className='flex flex-wrap gap-1.5'>
                            <span className='border-brand-100 bg-brand-25 text-brand-800 rounded-full border px-2 py-0.5 text-[11px] font-semibold'>
                              {sourceLabel(tender)}
                            </span>
                            <StateBadges states={tender.states} />
                          </div>
                        </div>
                      </td>
                      <td className='w-44 px-4 py-4 text-gray-700'>{tender.category}</td>
                      <td className='w-32 px-4 py-4 text-gray-700'>{tender.region}</td>
                      <td className='w-36 px-4 py-4 font-medium text-gray-900'>{formatValue(tender)}</td>
                      <td className='w-36 px-4 py-4'>
                        <p className='font-medium text-gray-900'>{formatDate(tender.submissionDeadline)}</p>
                        <p className='mt-1 text-xs text-gray-500'>
                          {tender.daysRemaining === null ? 'Not stated' : `${tender.daysRemaining} days left`}
                        </p>
                      </td>
                      <td className='w-44 px-4 py-4 text-gray-700'>{formatTerm(tender)}</td>
                      <td className='w-72 px-4 py-4'>
                        <p className='line-clamp-2 leading-6 text-gray-600'>{tender.summary || 'Not stated'}</p>
                      </td>
                      <td className='w-36 px-4 py-4 font-medium text-gray-900'>
                        From {formatMoney(tender.indicativePricing.upfrontFeeMinor)}
                      </td>
                      <td className='w-40 px-4 py-4 text-gray-700'>
                        {tender.indicativePricing.successFeeMinor === null
                          ? 'Assessment required'
                          : `From ${formatMoney(tender.indicativePricing.successFeeMinor)}`}
                      </td>
                      <td className='w-40 px-4 py-4'>
                        <button
                          type='button'
                          onClick={event => {
                            event.stopPropagation()
                            window.location.assign(signupHref())
                          }}
                          className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 min-h-10 rounded-lg px-3 text-xs font-semibold text-white focus:ring-4 focus:outline-hidden'
                        >
                          Get bid support
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='grid gap-3 p-4 lg:hidden'>
              {tenders.map(tender => (
                <article key={tender.id} className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                  <button
                    type='button'
                    onClick={() => setSelected(tender)}
                    className='focus:ring-brand-500/20 w-full text-left focus:ring-4 focus:outline-hidden'
                  >
                    <StateBadges states={tender.states} />
                    <span className='border-brand-100 bg-brand-25 text-brand-800 mt-2 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold'>
                      {sourceLabel(tender)}
                    </span>
                    <h3 className='mt-3 text-base font-semibold text-gray-950'>{tender.title}</h3>
                    <p className='mt-1 text-xs text-gray-500'>{tender.buyer ?? 'Buyer not stated'}</p>
                    <dl className='mt-4 grid grid-cols-2 gap-3 text-sm'>
                      <div>
                        <dt className='text-xs text-gray-500'>Category</dt>
                        <dd className='mt-1 font-medium text-gray-900'>{tender.category}</dd>
                      </div>
                      <div>
                        <dt className='text-xs text-gray-500'>Region</dt>
                        <dd className='mt-1 font-medium text-gray-900'>{tender.region}</dd>
                      </div>
                      <div>
                        <dt className='text-xs text-gray-500'>Value</dt>
                        <dd className='mt-1 font-medium text-gray-900'>{formatValue(tender)}</dd>
                      </div>
                      <div>
                        <dt className='text-xs text-gray-500'>Deadline</dt>
                        <dd className='mt-1 font-medium text-gray-900'>{formatDate(tender.submissionDeadline)}</dd>
                      </div>
                    </dl>
                    <p className='mt-4 line-clamp-2 text-sm leading-6 text-gray-600'>
                      {tender.summary || 'Not stated'}
                    </p>
                  </button>
                  <button
                    type='button'
                    onClick={() => window.location.assign(signupHref())}
                    className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 mt-4 min-h-11 w-full rounded-lg px-4 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
                  >
                    Get bid support
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {selected && <TenderPanel tender={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
