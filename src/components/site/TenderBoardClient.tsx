'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  getPublicTender,
  getPublicTenders,
  PublicTender,
  PublicTenderDetail,
  sendTenderLead,
  TenderLeadKind
} from '@/lib/api/tenders'
import { SiteIcon } from './SiteIcon'

const inputClass =
  'min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-hidden transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

function dateLabel(value: string | null) {
  if (!value) return 'Not stated'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

function money(value: number | null, currency = 'GBP') {
  if (value === null) return 'Not stated'

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value / 100)
}

function valueLabel(tender: PublicTender) {
  return money(tender.value.maxMinor ?? tender.value.minMinor, tender.value.currency)
}

function yesNo(value: boolean | null | undefined) {
  if (value === null || value === undefined) return 'Not stated'

  return value ? 'Yes' : 'No'
}

function plainText(value: string | null | undefined) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  line1: '',
  line2: '',
  city: '',
  county: '',
  postcode: '',
  country: 'United Kingdom',
  message: '',
  consent: false,
  website: ''
}

export function TenderBoardClient() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [filters, setFilters] = useState({ keyword: '', category: '', region: '' })
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [selectedTender, setSelectedTender] = useState<PublicTenderDetail | PublicTender | null>(null)
  const [leadKind, setLeadKind] = useState<TenderLeadKind>('enquiry')
  const [formStartedAt, setFormStartedAt] = useState(() => Math.floor(Date.now() / 1000))
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const categories = useMemo(() => Array.from(new Set(tenders.flatMap(tender => tender.categories))).sort(), [tenders])
  const regions = useMemo(() => Array.from(new Set(tenders.flatMap(tender => tender.regions))).sort(), [tenders])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getPublicTenders(filters)
      setTenders(response.data)
      setSelectedTender(current => current ?? response.data[0] ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender list could not be loaded.')
      setTenders([])
      setSelectedTender(null)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void load()
  }, [load])

  function openForm(tender: PublicTender, kind: TenderLeadKind) {
    setSelectedTender(tender)
    setLeadKind(kind)
    setNotice('')
    setError('')
    setFormStartedAt(Math.floor(Date.now() / 1000))
    setForm(current => ({
      ...current,
      message:
        current.message ||
        `I would like to discuss support for this tender: ${tender.title}. Please contact me with the next steps.`
    }))
  }

  async function openDetails(tender: PublicTender) {
    setSelectedTender(tender)
    setDetailsLoading(true)
    setError('')

    try {
      const response = await getPublicTender(tender.id)
      setSelectedTender(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender details could not be loaded.')
    } finally {
      setDetailsLoading(false)
    }
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedTender) return

    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await sendTenderLead(selectedTender.id, leadKind, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          county: form.county,
          postcode: form.postcode,
          country: form.country
        },
        message: form.message,
        consent: form.consent,
        formStartedAt,
        sourceUrl: window.location.href,
        website: form.website
      })
      setNotice(leadKind === 'booking' ? 'Booking request sent. We will reply by email.' : 'Tender enquiry sent.')
      setForm(emptyForm)
      setFormStartedAt(Math.floor(Date.now() / 1000))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender request could not be sent.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]'>
      <section className='rounded-lg border border-gray-200 bg-white'>
        <form
          className='border-b border-gray-200 bg-gray-50 p-4'
          onSubmit={event => {
            event.preventDefault()
            setFilters({ keyword: keyword.trim(), category, region })
          }}
        >
          <div className='grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]'>
            <label className='relative'>
              <span className='sr-only'>Search tenders</span>
              <SiteIcon name='search' className='absolute top-3.5 left-3 h-4 w-4 text-gray-400' />
              <input
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder='Search care, cleaning, supported living...'
                className={`${inputClass} w-full pl-10`}
              />
            </label>
            <select
              value={category}
              onChange={event => setCategory(event.target.value)}
              aria-label='Category'
              className={inputClass}
            >
              <option value=''>All categories</option>
              {categories.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={region}
              onChange={event => setRegion(event.target.value)}
              aria-label='Region'
              className={inputClass}
            >
              <option value=''>All regions</option>
              {regions.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button
              type='submit'
              className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
            >
              <SiteIcon name='search' className='h-4 w-4' />
              Search
            </button>
          </div>
        </form>

        {loading && <p className='p-8 text-sm text-gray-600'>Loading tender opportunities...</p>}

        {!loading && tenders.length === 0 && (
          <div className='p-8'>
            <p className='text-base font-semibold text-gray-950'>No tender previews available yet.</p>
            <p className='mt-2 text-sm leading-6 text-gray-600'>
              Care Atlas can still take a tender support enquiry while new public-board integrations are being added.
            </p>
          </div>
        )}

        {!loading && tenders.length > 0 && (
          <div className='divide-y divide-gray-200'>
            {tenders.map(tender => (
              <article
                key={tender.id}
                className={`p-4 transition ${
                  selectedTender?.id === tender.id ? 'bg-brand-25' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <button type='button' className='block w-full text-left' onClick={() => void openDetails(tender)}>
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
                    onClick={() => openForm(tender, 'booking')}
                    className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
                  >
                    <SiteIcon name='calendar' className='h-4 w-4' />
                    Book support
                  </button>
                  <button
                    type='button'
                    onClick={() => openForm(tender, 'enquiry')}
                    className='border-brand-200 text-brand-800 hover:bg-brand-50 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold focus:ring-4 focus:outline-hidden'
                  >
                    <SiteIcon name='mail' className='h-4 w-4' />
                    Send enquiry
                  </button>
                  <button
                    type='button'
                    onClick={() => void openDetails(tender)}
                    className='focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
                  >
                    <SiteIcon name='file' className='h-4 w-4' />
                    Open details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className='h-fit rounded-lg border border-gray-200 bg-white p-5 lg:sticky lg:top-28'>
        <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Tender support</p>
        <h2 className='mt-2 text-2xl font-semibold text-gray-950'>
          {selectedTender ? selectedTender.title : 'Discuss a tender'}
        </h2>
        {selectedTender && (
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
              <button
                type='button'
                onClick={() => openForm(selectedTender, 'booking')}
                className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
              >
                <SiteIcon name='calendar' className='h-4 w-4' />
                Book support
              </button>
              <button
                type='button'
                onClick={() => openForm(selectedTender, 'enquiry')}
                className='border-brand-200 text-brand-800 hover:bg-brand-50 focus:ring-brand-500/20 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-white px-4 text-sm font-semibold focus:ring-4 focus:outline-hidden'
              >
                <SiteIcon name='mail' className='h-4 w-4' />
                Send enquiry
              </button>
            </div>

            <section className='mt-5 border-t border-gray-200 pt-5'>
              <div className='flex items-center justify-between gap-3'>
                <h3 className='text-base font-semibold text-gray-950'>Scope</h3>
                {detailsLoading && <span className='text-xs font-medium text-gray-500'>Loading details...</span>}
              </div>
              <p className='mt-3 max-h-72 overflow-y-auto text-sm leading-6 whitespace-pre-wrap text-gray-700'>
                {plainText(
                  'description' in selectedTender && selectedTender.description
                    ? selectedTender.description
                    : selectedTender.summary
                )}
              </p>
            </section>

            {'lots' in selectedTender && selectedTender.lots && selectedTender.lots.length > 0 && (
              <section className='mt-5 border-t border-gray-200 pt-5'>
                <h3 className='text-base font-semibold text-gray-950'>Lots</h3>
                <div className='mt-3 space-y-3'>
                  {selectedTender.lots.map(lot => (
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

            {'description' in selectedTender && (
              <section className='mt-5 border-t border-gray-200 pt-5'>
                <h3 className='text-base font-semibold text-gray-950'>Tender details</h3>
                <dl className='mt-3 grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <dt className='text-xs text-gray-500'>Stage</dt>
                    <dd className='mt-1 font-semibold text-gray-950 capitalize'>
                      {selectedTender.stage?.replaceAll(',', ', ') ?? 'Not stated'}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Procedure</dt>
                    <dd className='mt-1 font-semibold text-gray-950'>{selectedTender.procedureType ?? 'Not stated'}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>SME suitable</dt>
                    <dd className='mt-1 font-semibold text-gray-950'>{yesNo(selectedTender.smeSuitable)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Framework</dt>
                    <dd className='mt-1 font-semibold text-gray-950'>{yesNo(selectedTender.isFramework)}</dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>CPV codes</dt>
                    <dd className='mt-1 font-semibold text-gray-950'>
                      {selectedTender.cpvCodes.length > 0 ? selectedTender.cpvCodes.join(', ') : 'Not stated'}
                    </dd>
                  </div>
                  <div>
                    <dt className='text-xs text-gray-500'>Locations</dt>
                    <dd className='mt-1 font-semibold text-gray-950'>
                      {selectedTender.deliveryLocations.length > 0
                        ? selectedTender.deliveryLocations.join(', ')
                        : selectedTender.region}
                    </dd>
                  </div>
                </dl>
                <div className='mt-4 flex flex-col gap-2'>
                  {selectedTender.sourceNoticeUrl && (
                    <a
                      href={selectedTender.sourceNoticeUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='text-brand-700 hover:bg-brand-50 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold'
                    >
                      Original notice
                      <SiteIcon name='arrow' className='h-4 w-4' />
                    </a>
                  )}
                  {selectedTender.responsePortalUrl && (
                    <a
                      href={selectedTender.responsePortalUrl}
                      target='_blank'
                      rel='noreferrer'
                      className='text-brand-700 hover:bg-brand-50 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold'
                    >
                      Response portal
                      <SiteIcon name='arrow' className='h-4 w-4' />
                    </a>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        <div className='mt-5 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1'>
          {(['enquiry', 'booking'] as TenderLeadKind[]).map(kind => (
            <button
              key={kind}
              type='button'
              onClick={() => setLeadKind(kind)}
              className={`min-h-10 rounded-md text-sm font-semibold capitalize ${
                leadKind === kind ? 'shadow-theme-xs bg-white text-gray-950' : 'text-gray-600 hover:text-gray-950'
              }`}
            >
              {kind}
            </button>
          ))}
        </div>

        <form className='mt-5 space-y-3' onSubmit={submitLead}>
          <input
            className='hidden'
            tabIndex={-1}
            autoComplete='off'
            value={form.website}
            onChange={event => setForm(current => ({ ...current, website: event.target.value }))}
          />
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
            <input
              required
              value={form.name}
              onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
              placeholder='Full name'
              className={inputClass}
            />
            <input
              required
              type='email'
              value={form.email}
              onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
              placeholder='Email'
              className={inputClass}
            />
            <input
              required
              value={form.phone}
              onChange={event => setForm(current => ({ ...current, phone: event.target.value }))}
              placeholder='Phone'
              className={inputClass}
            />
            <input
              value={form.company}
              onChange={event => setForm(current => ({ ...current, company: event.target.value }))}
              placeholder='Company'
              className={inputClass}
            />
            <input
              required
              value={form.line1}
              onChange={event => setForm(current => ({ ...current, line1: event.target.value }))}
              placeholder='Address line 1'
              className={inputClass}
            />
            <input
              value={form.line2}
              onChange={event => setForm(current => ({ ...current, line2: event.target.value }))}
              placeholder='Address line 2'
              className={inputClass}
            />
            <input
              required
              value={form.city}
              onChange={event => setForm(current => ({ ...current, city: event.target.value }))}
              placeholder='Town or city'
              className={inputClass}
            />
            <input
              value={form.county}
              onChange={event => setForm(current => ({ ...current, county: event.target.value }))}
              placeholder='County'
              className={inputClass}
            />
            <input
              required
              value={form.postcode}
              onChange={event => setForm(current => ({ ...current, postcode: event.target.value }))}
              placeholder='Postcode'
              className={inputClass}
            />
          </div>
          <textarea
            required
            minLength={10}
            value={form.message}
            onChange={event => setForm(current => ({ ...current, message: event.target.value }))}
            placeholder='Tell us what you need help with'
            rows={5}
            className={`${inputClass} w-full py-3`}
          />
          <label className='flex gap-3 text-sm leading-6 text-gray-600'>
            <input
              required
              type='checkbox'
              checked={form.consent}
              onChange={event => setForm(current => ({ ...current, consent: event.target.checked }))}
              className='mt-1 h-4 w-4 rounded border-gray-300'
            />
            I agree for Care Atlas to contact me about this tender.
          </label>
          {notice && <p className='bg-success-50 text-success-700 rounded-lg p-3 text-sm font-medium'>{notice}</p>}
          {error && <p className='bg-error-50 text-error-700 rounded-lg p-3 text-sm font-medium'>{error}</p>}
          <button
            type='submit'
            disabled={submitting || !selectedTender}
            className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden disabled:opacity-50'
          >
            <SiteIcon name={leadKind === 'booking' ? 'calendar' : 'mail'} className='h-4 w-4' />
            {submitting ? 'Sending...' : leadKind === 'booking' ? 'Request booking' : 'Send enquiry'}
          </button>
        </form>
      </aside>
    </div>
  )
}
