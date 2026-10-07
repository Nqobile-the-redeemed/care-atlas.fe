'use client'

/* eslint-disable @next/next/no-img-element */

import QRCode from 'qrcode'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { trackEvent } from '@/components/analytics/trackEvent'
import { searchTenderAdvertPhotos, trackTenderAdvertPhotoDownload, type TenderAdvertPhoto } from '@/lib/api/tenders'
import type { TenderAdvertData, TenderAdvertFact } from '@/lib/tenders/tenderShare'

import { Button } from '../ui'

export type AdvertTemplateId = 'photo-overview' | 'facts-first' | 'service-focus'
export type AdvertFormatId = 'portrait' | 'square' | 'landscape' | 'portrait-tall'

export type AdvertFormat = {
  id: AdvertFormatId
  label: string
  width: number
  height: number
}

export type AdvertTemplate = {
  id: AdvertTemplateId
  name: string
  purpose: string
}

export type TenderAdvertOverrides = Partial<
  Pick<
    TenderAdvertData,
    | 'title'
    | 'buyer'
    | 'summary'
    | 'contractValue'
    | 'deadline'
    | 'commencement'
    | 'location'
    | 'category'
    | 'noticeType'
  >
> & {
  serviceThemes?: string[]
  qrDestination?: string
}

export type TenderAdvertPhotoSelection = {
  photo: TenderAdvertPhoto | null
  objectPosition?: string
}

type GeneratedAdvert = {
  templateId: AdvertTemplateId
  dataUrl: string
  filename: string
}

type TenderAdvertGeneratorProps = {
  data: TenderAdvertData
  caption: string
  onCopyCaption: (caption: string) => Promise<void>
}

type TenderAdvertTemplateProps = {
  data: TenderAdvertData
  templateId: AdvertTemplateId
  format: AdvertFormat
  qrDataUrl: string | null
  photoSelection?: TenderAdvertPhotoSelection
  showPhotoCredit?: boolean
}

export const ADVERT_FORMATS: AdvertFormat[] = [
  { id: 'portrait', label: 'Portrait 1080 x 1350', width: 1080, height: 1350 },
  { id: 'square', label: 'Square 1080 x 1080', width: 1080, height: 1080 },
  { id: 'landscape', label: 'Landscape 1200 x 630', width: 1200, height: 630 },
  { id: 'portrait-tall', label: 'Tall portrait 1080 x 1620', width: 1080, height: 1620 }
]

export const ADVERT_TEMPLATES: AdvertTemplate[] = [
  {
    id: 'photo-overview',
    name: 'Photo Overview',
    purpose: 'Default editorial layout with a strong image, overview, facts, and QR footer.'
  },
  {
    id: 'facts-first',
    name: 'Facts First',
    purpose: 'Moves the key dates, value, and location higher for scan-first tender promotion.'
  },
  {
    id: 'service-focus',
    name: 'Service Focus',
    purpose: 'Emphasises service themes and delivery context before the fact cards.'
  }
]

export const TENDER_ADVERT_SOURCE_FILES = [
  'src/components/site/tender-board/TenderAdvertGenerator.tsx',
  'src/components/site/tender-board/TenderShareModalContent.tsx',
  'src/lib/tenders/tenderShare.ts',
  'src/lib/api/tenders.ts',
  'src/app/dev/tender-adverts/page.tsx'
]

const BRAND = {
  navy: '#0A2D57',
  ink: '#12263A',
  blue: '#1E64C8',
  sky: '#DDEEFF',
  powder: '#EFF7FF',
  pale: '#F8FBFF',
  panel: '#FFFFFF',
  line: '#C5D8EC',
  muted: '#59738F',
  gold: '#F6C343'
}

function safeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72)
}

function clamp(value: string | null | undefined, max = 120) {
  if (!value) return ''
  if (value.length <= max) return value

  const candidate = value.slice(0, max + 1)
  const finalSpace = candidate.lastIndexOf(' ')
  return `${candidate.slice(0, finalSpace > max * 0.65 ? finalSpace : max).trimEnd()}...`
}

function compactTitle(value: string, format: AdvertFormat) {
  if (format.id === 'landscape') return clamp(value, 92)
  if (format.id === 'square') return clamp(value, 116)
  if (format.id === 'portrait-tall') return clamp(value, 154)
  return clamp(value, 136)
}

function compactSummary(value: string, format: AdvertFormat) {
  if (format.id === 'landscape') return clamp(value, 120)
  if (format.id === 'square') return clamp(value, 160)
  if (format.id === 'portrait-tall') return clamp(value, 255)
  return clamp(value, 210)
}

function dedupe(values: Array<string | null | undefined>, limit = 5) {
  return [...new Set(values.map(value => value?.trim()).filter(Boolean) as string[])].slice(0, limit)
}

function chosenFacts(data: TenderAdvertData, limit: number): TenderAdvertFact[] {
  const base = [
    data.deadline ? { label: 'Deadline', value: data.deadline } : null,
    data.contractValue ? { label: 'Contract value', value: data.contractValue } : null,
    data.commencement ? { label: 'Commencement', value: data.commencement } : null,
    data.location ? { label: 'Location', value: clamp(data.location, 72) } : null,
    data.category ? { label: 'Service category', value: clamp(data.category, 64) } : null
  ].filter((fact): fact is TenderAdvertFact => Boolean(fact))

  const existing = data.facts.filter(fact => !base.some(item => item.label.toLowerCase() === fact.label.toLowerCase()))

  return [...base, ...existing].slice(0, limit)
}

function unsplashImageUrl(photo: TenderAdvertPhoto | null | undefined, width: number, height: number) {
  if (!photo) return null

  const candidate = photo.urls.raw || photo.urls.full || photo.urls.regular || photo.urls.small || photo.urls.thumb
  if (!candidate) return null

  try {
    const url = new URL(candidate)
    url.searchParams.set('w', String(width))
    url.searchParams.set('h', String(height))
    url.searchParams.set('fit', 'crop')
    url.searchParams.set('crop', 'faces,entropy')
    url.searchParams.set('auto', 'format')
    url.searchParams.set('q', '86')
    return url.toString()
  } catch {
    return candidate
  }
}

function photoCredit(photo: TenderAdvertPhoto | null | undefined) {
  const name = photo?.photographer?.name
  if (!name) return null
  return `Photo: ${name} / Unsplash`
}

function mergeTenderAdvertOverrides(
  data: TenderAdvertData,
  overrides: TenderAdvertOverrides = {},
  selectedPhoto?: TenderAdvertPhotoSelection
): TenderAdvertData {
  const serviceThemes = overrides.serviceThemes ? dedupe(overrides.serviceThemes, 6) : data.serviceThemes

  return {
    ...data,
    ...overrides,
    buyer: overrides.buyer === undefined ? data.buyer : overrides.buyer || null,
    category: overrides.category === undefined ? data.category : overrides.category || null,
    contractValue: overrides.contractValue === undefined ? data.contractValue : overrides.contractValue || null,
    deadline: overrides.deadline === undefined ? data.deadline : overrides.deadline || null,
    commencement: overrides.commencement === undefined ? data.commencement : overrides.commencement || null,
    location: overrides.location === undefined ? data.location : overrides.location || null,
    serviceThemes,
    approvedImageUrl: selectedPhoto?.photo ? unsplashImageUrl(selectedPhoto.photo, 1400, 900) : data.approvedImageUrl
  }
}

export { mergeTenderAdvertOverrides }

async function waitForRenderAssets(node: HTMLElement) {
  await document.fonts?.ready

  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map(image =>
      image.complete && image.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>(resolve => {
            const done = () => resolve()
            image.addEventListener('load', done, { once: true })
            image.addEventListener('error', done, { once: true })
            window.setTimeout(done, 2500)
          })
    )
  )
}

export async function exportTenderAdvertNode(node: HTMLElement, filename: string) {
  await waitForRenderAssets(node)
  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 1,
    backgroundColor: BRAND.pale
  })

  return { dataUrl, filename }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export function useTenderAdvertQrDataUrl(destination: string) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    QRCode.toString(destination, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 3,
      color: {
        dark: BRAND.navy,
        light: '#FFFFFF'
      }
    })
      .then(svg => {
        if (!cancelled) setQrDataUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [destination])

  return qrDataUrl
}

function CareAtlasLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 14 : 18, minWidth: 0 }}>
      <img
        src='/images/logo/care-atlas-logo.svg'
        alt='Care Atlas'
        crossOrigin='anonymous'
        style={{ width: compact ? 210 : 255, height: 'auto', display: 'block' }}
      />
    </div>
  )
}

function IconGlyph({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'flex',
        width: 50,
        height: 50,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        background: BRAND.blue,
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: 900,
        lineHeight: 1
      }}
    >
      {children}
    </span>
  )
}

function Header({ data, compact = false }: { data: TenderAdvertData; compact?: boolean }) {
  return (
    <div>
      <div style={{ height: compact ? 12 : 14, borderRadius: 999, background: BRAND.blue }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          paddingTop: compact ? 18 : 24
        }}
      >
        <CareAtlasLogo compact={compact} />
        <div
          style={{
            border: `2px solid ${BRAND.line}`,
            borderRadius: 999,
            padding: compact ? '10px 18px' : '13px 22px',
            color: BRAND.navy,
            fontSize: compact ? 18 : 21,
            fontWeight: 900,
            whiteSpace: 'nowrap',
            background: '#FFFFFF'
          }}
        >
          {data.noticeType || 'Tender opportunity'}
        </div>
      </div>
    </div>
  )
}

function TitleBlock({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const compact = landscape || format.id === 'square'

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: compact ? 12 : 18 }}>
      <div style={{ color: BRAND.blue, fontSize: compact ? 24 : 30, fontWeight: 950 }}>
        {data.buyer ? `Buyer: ${clamp(data.buyer, landscape ? 50 : 78)}` : 'Public sector opportunity'}
      </div>
      <h1
        style={{
          margin: 0,
          color: BRAND.ink,
          fontSize: landscape ? 52 : compact ? 56 : 68,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: 0
        }}
      >
        {compactTitle(data.title, format)}
      </h1>
      {data.reference && (
        <div style={{ color: BRAND.muted, fontSize: compact ? 18 : 22, fontWeight: 800 }}>Ref: {data.reference}</div>
      )}
    </section>
  )
}

function PhotoPanel({
  data,
  format,
  photoSelection,
  compact = false
}: {
  data: TenderAdvertData
  format: AdvertFormat
  photoSelection?: TenderAdvertPhotoSelection
  compact?: boolean
}) {
  const imageUrl = photoSelection?.photo
    ? unsplashImageUrl(photoSelection.photo, format.width, Math.max(620, Math.round(format.height * 0.5)))
    : data.approvedImageUrl
  const credit = photoCredit(photoSelection?.photo)

  return (
    <div
      style={{
        position: 'relative',
        minHeight: compact ? 250 : format.id === 'landscape' ? 220 : 360,
        overflow: 'hidden',
        borderRadius: 42,
        background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.pale})`,
        border: `3px solid ${BRAND.line}`
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={photoSelection?.photo?.alt || data.category || data.title}
          crossOrigin='anonymous'
          style={{
            width: '100%',
            height: '100%',
            minHeight: compact ? 250 : format.id === 'landscape' ? 220 : 360,
            objectFit: 'cover',
            objectPosition: photoSelection?.objectPosition || '50% 50%',
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 42,
            color: BRAND.navy,
            fontSize: 34,
            lineHeight: 1.1,
            fontWeight: 950,
            textAlign: 'center'
          }}
        >
          Select an Unsplash image for the finished advert
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: 28,
          right: credit ? 230 : 28,
          bottom: 28,
          display: 'inline-flex',
          width: 'fit-content',
          maxWidth: 'calc(100% - 56px)',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          padding: '13px 20px',
          color: BRAND.navy,
          fontSize: compact ? 18 : 22,
          fontWeight: 950,
          boxShadow: '0 16px 30px rgba(18, 38, 58, 0.14)'
        }}
      >
        {data.category || data.serviceThemes[0] || 'Care sector opportunity'}
      </div>
      {credit && (
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            borderRadius: 999,
            background: 'rgba(10,45,87,0.82)',
            color: '#FFFFFF',
            padding: '9px 13px',
            fontSize: 13,
            fontWeight: 800
          }}
        >
          {credit}
        </div>
      )}
    </div>
  )
}

function OverviewPanel({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  return (
    <div
      style={{
        borderRadius: 32,
        background: BRAND.powder,
        border: `2px solid ${BRAND.line}`,
        padding: format.id === 'landscape' ? 22 : 30,
        color: BRAND.ink
      }}
    >
      <div
        style={{
          color: BRAND.blue,
          fontSize: 16,
          fontWeight: 950,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}
      >
        Opportunity overview
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: format.id === 'landscape' ? 21 : 27,
          lineHeight: 1.28,
          fontWeight: 700
        }}
      >
        {compactSummary(
          data.summary || 'Review this tender opportunity on Care Atlas and prepare your response.',
          format
        )}
      </div>
    </div>
  )
}

function FactCard({ fact, index, compact = false }: { fact: TenderAdvertFact; index: number; compact?: boolean }) {
  const icons = ['D', 'GBP', 'S', 'L', 'C', 'P']
  return (
    <div
      style={{
        display: 'flex',
        minWidth: 0,
        alignItems: 'flex-start',
        gap: compact ? 12 : 16,
        borderRadius: 28,
        background: '#FFFFFF',
        border: `2px solid ${BRAND.line}`,
        padding: compact ? 18 : 22
      }}
    >
      <IconGlyph>{icons[index % icons.length]}</IconGlyph>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: BRAND.blue, fontSize: compact ? 14 : 16, fontWeight: 950, textTransform: 'uppercase' }}>
          {fact.label}
        </div>
        <div
          style={{
            marginTop: 6,
            color: BRAND.ink,
            fontSize: compact ? 21 : 24,
            lineHeight: 1.13,
            fontWeight: 950,
            overflowWrap: 'anywhere'
          }}
        >
          {fact.value}
        </div>
      </div>
    </div>
  )
}

function FactGrid({ facts, compact = false }: { facts: TenderAdvertFact[]; compact?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
        gap: compact ? 14 : 18
      }}
    >
      {facts.map((fact, index) => (
        <FactCard key={`${fact.label}-${index}`} fact={fact} index={index} compact={compact} />
      ))}
    </div>
  )
}

function ThemePanel({ data, compact = false }: { data: TenderAdvertData; compact?: boolean }) {
  const themes = dedupe(
    [
      ...data.serviceThemes,
      data.category,
      data.procurementType,
      data.procedure,
      data.location ? `Delivery area: ${clamp(data.location, 48)}` : null
    ],
    4
  )

  return (
    <div
      style={{
        borderRadius: 34,
        background: '#FFFFFF',
        border: `2px solid ${BRAND.line}`,
        padding: compact ? 22 : 30
      }}
    >
      <div
        style={{
          color: BRAND.blue,
          fontSize: 16,
          fontWeight: 950,
          letterSpacing: '0.12em',
          textTransform: 'uppercase'
        }}
      >
        Service themes
      </div>
      <div style={{ marginTop: 18, display: 'grid', gap: compact ? 12 : 16 }}>
        {themes.map((theme, index) => (
          <div
            key={`${theme}-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              borderRadius: 999,
              background: index % 2 === 0 ? BRAND.powder : '#FFF7DD',
              padding: compact ? '13px 16px' : '16px 20px',
              color: BRAND.ink,
              fontSize: compact ? 20 : 25,
              lineHeight: 1.1,
              fontWeight: 950
            }}
          >
            <span
              style={{
                display: 'flex',
                width: compact ? 36 : 42,
                height: compact ? 36 : 42,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                background: index % 2 === 0 ? BRAND.blue : BRAND.gold,
                color: index % 2 === 0 ? '#FFFFFF' : BRAND.navy,
                fontSize: 16,
                flexShrink: 0
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            {clamp(theme, 56)}
          </div>
        ))}
      </div>
    </div>
  )
}

function Footer({ data, qrDataUrl }: { data: TenderAdvertData; qrDataUrl: string | null }) {
  return (
    <footer
      style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        borderRadius: 36,
        background: BRAND.navy,
        padding: 28,
        color: '#FFFFFF'
      }}
    >
      <div>
        <div style={{ fontSize: 29, lineHeight: 1.05, fontWeight: 950 }}>View the opportunity on Care Atlas</div>
        <div style={{ marginTop: 9, color: '#DDEEFF', fontSize: 19, fontWeight: 700 }}>
          Scan the code for the full notice, dates, and response links.
        </div>
        <div style={{ marginTop: 15, display: 'flex', gap: 14, color: '#F8FBFF', fontSize: 17, fontWeight: 800 }}>
          <span>careatlas.co.uk</span>
          {data.deadline && <span>Deadline: {data.deadline}</span>}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          width: 148,
          height: 148,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 26,
          background: '#FFFFFF',
          padding: 12
        }}
      >
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt='Care Atlas tender QR code'
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        ) : (
          <span style={{ color: BRAND.navy, fontSize: 22, fontWeight: 950 }}>QR</span>
        )}
      </div>
    </footer>
  )
}

function Canvas({ format, children }: { format: AdvertFormat; children: ReactNode }) {
  return (
    <div
      style={{
        width: format.width,
        height: format.height,
        overflow: 'hidden',
        background: BRAND.pale,
        color: BRAND.ink,
        fontFamily: 'Inter, Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  )
}

function contentStyle(format: AdvertFormat): CSSProperties {
  return {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: format.id === 'landscape' ? 20 : 28,
    padding: format.id === 'landscape' ? '34px 46px' : format.id === 'square' ? 44 : 54
  }
}

function PhotoOverview({ data, format, qrDataUrl, photoSelection }: TenderAdvertTemplateProps) {
  const landscape = format.id === 'landscape'
  const facts = chosenFacts(data, landscape ? 4 : 6)

  return (
    <Canvas format={format}>
      <div style={contentStyle(format)}>
        <Header data={data} compact={landscape} />
        <TitleBlock data={data} format={format} />
        <PhotoPanel data={data} format={format} photoSelection={photoSelection} compact={landscape} />
        <OverviewPanel data={data} format={format} />
        {!landscape && <FactGrid facts={facts} />}
        {landscape && <FactGrid facts={facts.slice(0, 4)} compact />}
        <Footer data={data} qrDataUrl={qrDataUrl} />
      </div>
    </Canvas>
  )
}

function FactsFirst({ data, format, qrDataUrl, photoSelection }: TenderAdvertTemplateProps) {
  const landscape = format.id === 'landscape'
  const facts = chosenFacts(data, landscape ? 4 : 6)

  return (
    <Canvas format={format}>
      <div style={contentStyle(format)}>
        <Header data={data} compact={landscape} />
        <TitleBlock data={data} format={format} />
        <FactGrid facts={facts} compact={landscape || format.id === 'square'} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: landscape ? '1.15fr 0.85fr' : '1fr',
            gap: 22,
            minHeight: 0
          }}
        >
          <PhotoPanel
            data={data}
            format={format}
            photoSelection={photoSelection}
            compact={landscape || format.id === 'square'}
          />
          <OverviewPanel data={data} format={format} />
        </div>
        <Footer data={data} qrDataUrl={qrDataUrl} />
      </div>
    </Canvas>
  )
}

function ServiceFocus({ data, format, qrDataUrl, photoSelection }: TenderAdvertTemplateProps) {
  const landscape = format.id === 'landscape'
  const facts = chosenFacts(data, landscape ? 3 : 4)

  return (
    <Canvas format={format}>
      <div style={contentStyle(format)}>
        <Header data={data} compact={landscape} />
        <TitleBlock data={data} format={format} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: landscape ? '1fr 1fr' : '1fr',
            gap: 22,
            minHeight: 0
          }}
        >
          <PhotoPanel
            data={data}
            format={format}
            photoSelection={photoSelection}
            compact={landscape || format.id === 'square'}
          />
          <ThemePanel data={data} compact={landscape || format.id === 'square'} />
        </div>
        <OverviewPanel data={data} format={format} />
        <FactGrid facts={facts} compact={landscape} />
        <Footer data={data} qrDataUrl={qrDataUrl} />
      </div>
    </Canvas>
  )
}

export function TenderAdvertTemplate(props: TenderAdvertTemplateProps) {
  if (props.templateId === 'facts-first') return <FactsFirst {...props} />
  if (props.templateId === 'service-focus') return <ServiceFocus {...props} />
  return <PhotoOverview {...props} />
}

function TemplatePreview({
  template,
  selected,
  onToggle
}: {
  template: AdvertTemplate
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-brand-500 bg-brand-50 text-brand-950 shadow-theme-xs'
          : 'hover:border-brand-200 hover:bg-brand-50/60 border-gray-200 bg-white text-gray-700'
      } dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]`}
    >
      <span className='block text-sm font-semibold'>{template.name}</span>
      <span className='mt-1 block text-xs leading-5 text-gray-600 dark:text-gray-300'>{template.purpose}</span>
    </button>
  )
}

function PhotoPicker({
  tenderId,
  selectedPhoto,
  onSelect
}: {
  tenderId: string
  selectedPhoto: TenderAdvertPhoto | null
  onSelect: (photo: TenderAdvertPhoto | null) => void
}) {
  const [query, setQuery] = useState('')
  const [resolvedQuery, setResolvedQuery] = useState('')
  const [photos, setPhotos] = useState<TenderAdvertPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runSearch = useCallback(
    async (nextQuery = query) => {
      setLoading(true)
      setError(null)
      try {
        const response = await searchTenderAdvertPhotos(tenderId, {
          query: nextQuery.trim() || undefined,
          orientation: 'landscape',
          perPage: 9
        })
        setPhotos(response.data.results)
        setResolvedQuery(response.data.query)
        if (!selectedPhoto && response.data.results[0]) onSelect(response.data.results[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load Unsplash photos.')
      } finally {
        setLoading(false)
      }
    },
    [onSelect, query, selectedPhoto, tenderId]
  )

  useEffect(() => {
    void runSearch('')
    // Initial tender-specific search only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenderId])

  return (
    <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <label className='sr-only' htmlFor='tender-advert-photo-search'>
          Search advert photos
        </label>
        <input
          id='tender-advert-photo-search'
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={resolvedQuery || 'Search Unsplash photos'}
          className='focus:border-brand-500 focus:ring-brand-500/15 min-h-11 flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:ring-4 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
        />
        <Button onClick={() => void runSearch()} loading={loading} size='sm'>
          Search photos
        </Button>
        <Button variant='secondary' onClick={() => onSelect(null)} size='sm'>
          No photo
        </Button>
      </div>
      {resolvedQuery && (
        <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>Unsplash query: {resolvedQuery}</p>
      )}
      {error && <p className='text-error-600 mt-2 text-sm'>{error}</p>}
      <div className='mt-4 grid grid-cols-3 gap-3'>
        {photos.map(photo => {
          const thumb = unsplashImageUrl(photo, 360, 240) || photo.urls.thumb || photo.urls.small || ''
          const active = selectedPhoto?.unsplashId === photo.unsplashId
          return (
            <button
              key={photo.unsplashId}
              type='button'
              onClick={() => onSelect(photo)}
              className={`overflow-hidden rounded-xl border text-left transition ${
                active ? 'border-brand-500 ring-brand-500/15 ring-4' : 'hover:border-brand-300 border-gray-200'
              }`}
            >
              <img src={thumb} alt={photo.alt || 'Unsplash result'} className='h-24 w-full object-cover' />
              <span className='block truncate bg-white px-2 py-1 text-xs text-gray-600 dark:bg-gray-950 dark:text-gray-300'>
                {photo.photographer?.name || 'Unsplash'}
              </span>
            </button>
          )
        })}
      </div>
      <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
        Images are provided by Unsplash. Downloads are tracked when an advert export is generated.
      </p>
    </div>
  )
}

export function buildTenderAdvertCaption(
  data: TenderAdvertData,
  selectedPhoto?: TenderAdvertPhoto | null,
  includeHashtags = false
) {
  const details = [
    data.buyer ? `Buyer: ${data.buyer}` : null,
    data.contractValue ? `Contract value: ${data.contractValue}` : null,
    data.deadline ? `Deadline: ${data.deadline}` : null,
    data.location ? `Location: ${data.location}` : null,
    data.category ? `Category: ${data.category}` : null
  ].filter(Boolean)

  const photo = photoCredit(selectedPhoto)
  return [
    data.noticeType || 'Tender opportunity',
    data.title,
    details.join('\n'),
    data.summary,
    data.publicUrl,
    photo,
    includeHashtags ? data.hashtags.join(' ') : null
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function TenderAdvertGenerator({ data, caption, onCopyCaption }: TenderAdvertGeneratorProps) {
  const [formatId, setFormatId] = useState<AdvertFormatId>('portrait')
  const [selectedTemplates, setSelectedTemplates] = useState<AdvertTemplateId[]>([
    'photo-overview',
    'facts-first',
    'service-focus'
  ])
  const [selectedPhoto, setSelectedPhoto] = useState<TenderAdvertPhoto | null>(null)
  const [objectPosition, setObjectPosition] = useState('50% 50%')
  const [generated, setGenerated] = useState<GeneratedAdvert[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [includeHashtags, setIncludeHashtags] = useState(false)
  const nodeRefs = useRef<Record<AdvertTemplateId, HTMLDivElement | null>>({
    'photo-overview': null,
    'facts-first': null,
    'service-focus': null
  })
  const trackedPhotos = useRef<Set<string>>(new Set())

  const format = ADVERT_FORMATS.find(item => item.id === formatId) ?? ADVERT_FORMATS[0]
  const qrDataUrl = useTenderAdvertQrDataUrl(data.publicUrl)
  const mergedData = useMemo(
    () => mergeTenderAdvertOverrides(data, {}, { photo: selectedPhoto, objectPosition }),
    [data, objectPosition, selectedPhoto]
  )
  const generatedCaption = useMemo(
    () => buildTenderAdvertCaption(mergedData, selectedPhoto, includeHashtags),
    [includeHashtags, mergedData, selectedPhoto]
  )

  const setTemplateRef = useCallback(
    (templateId: AdvertTemplateId) => (node: HTMLDivElement | null) => {
      nodeRefs.current[templateId] = node
    },
    []
  )

  const toggleTemplate = (templateId: AdvertTemplateId) => {
    setSelectedTemplates(current => {
      if (current.includes(templateId)) {
        return current.length === 1 ? current : current.filter(id => id !== templateId)
      }
      return [...current, templateId]
    })
  }

  const trackSelectedDownload = async () => {
    if (!selectedPhoto || trackedPhotos.current.has(selectedPhoto.unsplashId)) return

    await trackTenderAdvertPhotoDownload(data.id, selectedPhoto.unsplashId)
      .then(() => {
        trackedPhotos.current.add(selectedPhoto.unsplashId)
      })
      .catch(() => {
        setMessage(
          'Advert generated. Unsplash tracking could not be confirmed, so please retry export before publishing.'
        )
      })
  }

  const generateAdverts = async () => {
    setBusy(true)
    setMessage(null)
    try {
      await trackSelectedDownload()
      const results: GeneratedAdvert[] = []

      for (const templateId of selectedTemplates) {
        const node = nodeRefs.current[templateId]
        if (!node) continue

        const filename = `${safeFilename(mergedData.title || 'tender-advert')}-${templateId}-${format.id}.png`
        const exported = await exportTenderAdvertNode(node, filename)
        results.push({ templateId, ...exported })
        downloadDataUrl(exported.dataUrl, exported.filename)
      }

      setGenerated(results)
      if (results.length > 0) setMessage(`Generated ${results.length} advert image${results.length === 1 ? '' : 's'}.`)
      trackEvent('tender_advert_generated', {
        tender_id: data.id,
        format: format.id,
        templates: selectedTemplates.join(','),
        has_unsplash_photo: Boolean(selectedPhoto)
      })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to generate advert images.')
    } finally {
      setBusy(false)
    }
  }

  const copyAdvertCaption = async () => {
    await onCopyCaption(generatedCaption || caption)
  }

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]'>
        <div className='space-y-4'>
          <div className='overflow-auto rounded-2xl border border-gray-200 bg-gray-100 p-4 dark:border-white/10 dark:bg-white/[0.03]'>
            <div
              style={{
                width: format.width * 0.34,
                minWidth: Math.min(format.width * 0.34, 360),
                transformOrigin: 'top left'
              }}
            >
              <div
                style={{
                  transform: 'scale(0.34)',
                  transformOrigin: 'top left',
                  width: format.width,
                  height: format.height
                }}
              >
                <TenderAdvertTemplate
                  data={mergedData}
                  templateId={selectedTemplates[0]}
                  format={format}
                  qrDataUrl={qrDataUrl}
                  photoSelection={{ photo: selectedPhoto, objectPosition }}
                />
              </div>
            </div>
          </div>
          <PhotoPicker tenderId={data.id} selectedPhoto={selectedPhoto} onSelect={setSelectedPhoto} />
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-sm font-semibold text-gray-800 dark:text-white' htmlFor='tender-advert-format'>
              Export format
            </label>
            <select
              id='tender-advert-format'
              value={formatId}
              onChange={event => setFormatId(event.target.value as AdvertFormatId)}
              className='mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
            >
              {ADVERT_FORMATS.map(item => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-3'>
            <div className='text-sm font-semibold text-gray-800 dark:text-white'>Templates</div>
            {ADVERT_TEMPLATES.map(template => (
              <TemplatePreview
                key={template.id}
                template={template}
                selected={selectedTemplates.includes(template.id)}
                onToggle={() => toggleTemplate(template.id)}
              />
            ))}
          </div>

          <div>
            <label className='text-sm font-semibold text-gray-800 dark:text-white' htmlFor='photo-position'>
              Image position
            </label>
            <select
              id='photo-position'
              value={objectPosition}
              onChange={event => setObjectPosition(event.target.value)}
              className='mt-2 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white'
            >
              <option value='50% 50%'>Centre</option>
              <option value='50% 25%'>Top</option>
              <option value='50% 75%'>Bottom</option>
              <option value='25% 50%'>Left</option>
              <option value='75% 50%'>Right</option>
            </select>
          </div>

          <label className='flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200'>
            <input
              type='checkbox'
              checked={includeHashtags}
              onChange={event => setIncludeHashtags(event.target.checked)}
              className='text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300'
            />
            Include hashtags in copied caption
          </label>

          <div className='flex flex-col gap-3'>
            <Button onClick={() => void generateAdverts()} loading={busy} fullWidth>
              Generate and download
            </Button>
            <Button variant='secondary' onClick={() => void copyAdvertCaption()} fullWidth>
              Copy caption
            </Button>
          </div>
          {message && (
            <p className='rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-white/[0.06] dark:text-gray-200'>
              {message}
            </p>
          )}
          {generated.length > 0 && (
            <div className='text-xs text-gray-500 dark:text-gray-400'>
              Last export:{' '}
              {generated
                .map(item => ADVERT_TEMPLATES.find(template => template.id === item.templateId)?.name)
                .join(', ')}
            </div>
          )}
        </div>
      </div>

      <div aria-hidden='true' className='pointer-events-none fixed top-0 -left-[9999px]'>
        {ADVERT_TEMPLATES.map(template => (
          <div key={template.id} ref={setTemplateRef(template.id)} style={{ marginBottom: 40 }}>
            <TenderAdvertTemplate
              data={mergedData}
              templateId={template.id}
              format={format}
              qrDataUrl={qrDataUrl}
              photoSelection={{ photo: selectedPhoto, objectPosition }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
