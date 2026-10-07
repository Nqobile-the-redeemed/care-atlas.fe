'use client'

import { useMemo, useRef, useState } from 'react'

import { getPublicTender, getPublicTenders, type PublicTender, type PublicTenderDetail } from '@/lib/api/tenders'
import { toTenderAdvertData, type TenderAdvertData } from '@/lib/tenders/tenderShare'

import { Button } from '../ui'
import {
  ADVERT_FORMATS,
  ADVERT_TEMPLATES,
  exportTenderAdvertNode,
  mergeTenderAdvertOverrides,
  TenderAdvertTemplate,
  TENDER_ADVERT_SOURCE_FILES,
  useTenderAdvertQrDataUrl,
  type AdvertFormatId,
  type AdvertTemplateId,
  type TenderAdvertOverrides
} from './TenderAdvertGenerator'

function idFromInput(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''

  try {
    const url = new URL(trimmed)
    const segments = url.pathname.split('/').filter(Boolean)
    return segments.at(-1) ?? trimmed
  } catch {
    return trimmed
  }
}

function textareaToList(value: string) {
  return value
    .split(/\n|,/)
    .map(item => item.trim())
    .filter(Boolean)
}

function JsonPanel({ title, value }: { title: string; value: unknown }) {
  return (
    <details className='rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]'>
      <summary className='cursor-pointer text-sm font-semibold text-gray-900 dark:text-white'>{title}</summary>
      <pre className='mt-3 max-h-96 overflow-auto rounded-xl bg-gray-950 p-4 text-xs leading-5 text-gray-100'>
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  const id = `advert-dev-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  const className =
    'mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'

  return (
    <label className='block text-sm font-semibold text-gray-800 dark:text-gray-100' htmlFor={id}>
      {label}
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={event => onChange(event.target.value)}
          rows={4}
          className={className}
        />
      ) : (
        <input id={id} value={value} onChange={event => onChange(event.target.value)} className={className} />
      )}
    </label>
  )
}

export function TenderAdvertDevPage() {
  const [query, setQuery] = useState('')
  const [idInput, setIdInput] = useState('')
  const [results, setResults] = useState<PublicTender[]>([])
  const [rawTender, setRawTender] = useState<PublicTenderDetail | PublicTender | null>(null)
  const [templateId, setTemplateId] = useState<AdvertTemplateId>('photo-overview')
  const [formatId, setFormatId] = useState<AdvertFormatId>('portrait')
  const [zoom, setZoom] = useState(0.34)
  const [fit, setFit] = useState(true)
  const [compareAll, setCompareAll] = useState(false)
  const [status, setStatus] = useState('')
  const [overrides, setOverrides] = useState<TenderAdvertOverrides>({})
  const exportRef = useRef<HTMLDivElement | null>(null)

  const baseData = useMemo(() => (rawTender ? toTenderAdvertData(rawTender) : null), [rawTender])
  const format = ADVERT_FORMATS.find(item => item.id === formatId) ?? ADVERT_FORMATS[0]
  const finalData = useMemo<TenderAdvertData | null>(
    () => (baseData ? mergeTenderAdvertOverrides(baseData, overrides) : null),
    [baseData, overrides]
  )
  const qrDataUrl = useTenderAdvertQrDataUrl(
    overrides.qrDestination || finalData?.publicUrl || 'https://careatlas.co.uk/tenders'
  )

  const updateOverride = <K extends keyof TenderAdvertOverrides>(key: K, value: TenderAdvertOverrides[K]) => {
    setOverrides(current => ({ ...current, [key]: value }))
  }

  const search = async () => {
    setStatus('Searching tenders...')
    try {
      const response = await getPublicTenders({ keyword: query, perPage: 12, sort: 'newest' })
      setResults(response.data)
      setStatus(response.data.length ? `${response.data.length} tenders loaded.` : 'No matching tenders found.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to search tenders.')
    }
  }

  const loadTender = async (id: string) => {
    const tenderId = idFromInput(id)
    if (!tenderId) return

    setStatus('Loading tender...')
    try {
      const response = await getPublicTender(tenderId)
      setRawTender(response.data)
      setIdInput(tenderId)
      setOverrides({})
      setStatus('Tender loaded.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load tender.')
    }
  }

  const downloadPreview = async () => {
    if (!exportRef.current || !finalData) return

    setStatus('Exporting PNG...')
    try {
      const exported = await exportTenderAdvertNode(
        exportRef.current,
        `${finalData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 64)}-${templateId}-${format.id}.png`
      )
      const anchor = document.createElement('a')
      anchor.href = exported.dataUrl
      anchor.download = exported.filename
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setStatus('PNG exported from the production renderer.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to export PNG.')
    }
  }

  const previewScale = fit ? Math.min(1, Math.min(820 / format.width, 620 / format.height)) : zoom

  return (
    <main className='min-h-screen bg-gray-50 px-5 py-8 text-gray-900 dark:bg-gray-950 dark:text-white'>
      <div className='mx-auto max-w-7xl space-y-6'>
        <header>
          <p className='text-brand-600 text-sm font-semibold tracking-[0.16em] uppercase'>Local development</p>
          <h1 className='mt-2 text-3xl font-bold'>Tender advert playground</h1>
          <p className='mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300'>
            Search real public tenders, apply temporary overrides, compare the three production templates, and export a
            diagnostic PNG without changing live tender data.
          </p>
        </header>

        <section className='grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 lg:grid-cols-[1fr_1fr_auto] dark:border-white/10 dark:bg-white/[0.04]'>
          <Field label='Search tenders' value={query} onChange={setQuery} />
          <Field label='Tender ID or public URL' value={idInput} onChange={setIdInput} />
          <div className='flex items-end gap-2'>
            <Button onClick={() => void search()}>Search</Button>
            <Button variant='secondary' onClick={() => void loadTender(idInput)}>
              Load
            </Button>
          </div>
        </section>

        {results.length > 0 && (
          <section className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
            {results.map(tender => (
              <button
                key={tender.id}
                type='button'
                onClick={() => void loadTender(tender.id)}
                className='shadow-theme-xs hover:border-brand-300 rounded-2xl border border-gray-200 bg-white p-4 text-left transition dark:border-white/10 dark:bg-white/[0.04]'
              >
                <span className='block text-sm font-semibold text-gray-950 dark:text-white'>{tender.title}</span>
                <span className='mt-2 block text-xs text-gray-500 dark:text-gray-400'>{tender.buyer || tender.id}</span>
              </button>
            ))}
          </section>
        )}

        <div className='grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]'>
          <aside className='space-y-4'>
            <section className='space-y-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]'>
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1'>
                <label className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                  Template
                  <select
                    value={templateId}
                    onChange={event => setTemplateId(event.target.value as AdvertTemplateId)}
                    className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.04]'
                  >
                    {ADVERT_TEMPLATES.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className='text-sm font-semibold text-gray-800 dark:text-gray-100'>
                  Format
                  <select
                    value={formatId}
                    onChange={event => setFormatId(event.target.value as AdvertFormatId)}
                    className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.04]'
                  >
                    {ADVERT_FORMATS.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200'>
                <input type='checkbox' checked={compareAll} onChange={event => setCompareAll(event.target.checked)} />
                Compare all three templates
              </label>
              <label className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200'>
                <input type='checkbox' checked={fit} onChange={event => setFit(event.target.checked)} />
                Fit preview
              </label>
              {!fit && (
                <label className='block text-sm font-semibold text-gray-800 dark:text-gray-100'>
                  Zoom
                  <input
                    type='range'
                    min='0.15'
                    max='0.7'
                    step='0.01'
                    value={zoom}
                    onChange={event => setZoom(Number(event.target.value))}
                    className='mt-2 w-full'
                  />
                </label>
              )}
              <Button onClick={() => void downloadPreview()} disabled={!finalData} fullWidth>
                Download current PNG
              </Button>
              {status && (
                <p className='rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-white/[0.06] dark:text-gray-200'>
                  {status}
                </p>
              )}
            </section>

            <section className='space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]'>
              <h2 className='text-base font-semibold'>Temporary overrides</h2>
              <Field
                label='Title'
                value={overrides.title ?? ''}
                onChange={value => updateOverride('title', value)}
                multiline
              />
              <Field label='Buyer' value={overrides.buyer ?? ''} onChange={value => updateOverride('buyer', value)} />
              <Field
                label='Notice type'
                value={overrides.noticeType ?? ''}
                onChange={value => updateOverride('noticeType', value)}
              />
              <Field
                label='Summary'
                value={overrides.summary ?? ''}
                onChange={value => updateOverride('summary', value)}
                multiline
              />
              <Field
                label='Location'
                value={overrides.location ?? ''}
                onChange={value => updateOverride('location', value)}
              />
              <Field
                label='Category'
                value={overrides.category ?? ''}
                onChange={value => updateOverride('category', value)}
              />
              <Field
                label='Contract value'
                value={overrides.contractValue ?? ''}
                onChange={value => updateOverride('contractValue', value)}
              />
              <Field
                label='Deadline'
                value={overrides.deadline ?? ''}
                onChange={value => updateOverride('deadline', value)}
              />
              <Field
                label='Commencement'
                value={overrides.commencement ?? ''}
                onChange={value => updateOverride('commencement', value)}
              />
              <Field
                label='Service themes'
                value={(overrides.serviceThemes ?? []).join('\n')}
                onChange={value => updateOverride('serviceThemes', textareaToList(value))}
                multiline
              />
              <Field
                label='QR destination'
                value={overrides.qrDestination ?? ''}
                onChange={value => updateOverride('qrDestination', value)}
              />
            </section>

            <section className='rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]'>
              <h2 className='text-base font-semibold'>Source paths</h2>
              <ul className='mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300'>
                {TENDER_ADVERT_SOURCE_FILES.map(file => (
                  <li key={file} className='rounded-lg bg-gray-50 px-3 py-2 font-mono dark:bg-white/[0.04]'>
                    {file}
                  </li>
                ))}
              </ul>
            </section>
          </aside>

          <section className='space-y-5'>
            <div className='overflow-auto rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-white/10 dark:bg-white/[0.03]'>
              {!finalData ? (
                <div className='rounded-xl border-2 border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-300'>
                  Load a tender to preview advert templates.
                </div>
              ) : compareAll ? (
                <div className='grid gap-5 xl:grid-cols-3'>
                  {ADVERT_TEMPLATES.map(template => (
                    <div key={template.id}>
                      <h3 className='mb-2 text-sm font-semibold'>{template.name}</h3>
                      <div style={{ width: format.width * previewScale, height: format.height * previewScale }}>
                        <div
                          style={{
                            transform: `scale(${previewScale})`,
                            transformOrigin: 'top left',
                            width: format.width,
                            height: format.height
                          }}
                        >
                          <TenderAdvertTemplate
                            data={finalData}
                            templateId={template.id}
                            format={format}
                            qrDataUrl={qrDataUrl}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ width: format.width * previewScale, height: format.height * previewScale }}>
                  <div
                    style={{
                      transform: `scale(${previewScale})`,
                      transformOrigin: 'top left',
                      width: format.width,
                      height: format.height
                    }}
                  >
                    <TenderAdvertTemplate
                      data={finalData}
                      templateId={templateId}
                      format={format}
                      qrDataUrl={qrDataUrl}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='grid gap-4 lg:grid-cols-3'>
              <JsonPanel title='Raw tender' value={rawTender} />
              <JsonPanel title='Normalized data' value={baseData} />
              <JsonPanel title='Final render data' value={finalData} />
            </div>
          </section>
        </div>
      </div>
      {finalData && (
        <div aria-hidden='true' className='pointer-events-none fixed top-0 -left-[9999px]'>
          <div ref={exportRef}>
            <TenderAdvertTemplate data={finalData} templateId={templateId} format={format} qrDataUrl={qrDataUrl} />
          </div>
        </div>
      )}
    </main>
  )
}
