'use client'

import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { trackEvent } from '@/components/analytics/trackEvent'
import type { TenderAdvertData } from '@/lib/tenders/tenderShare'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

type AdvertTemplateId = 'detailed' | 'spotlight' | 'facts' | 'delivery' | 'scope'
type AdvertFormatId = 'portrait' | 'square' | 'landscape'

type AdvertFormat = {
  id: AdvertFormatId
  label: string
  width: number
  height: number
}

type AdvertTemplate = {
  id: AdvertTemplateId
  name: string
  purpose: string
}

type GeneratedAdvert = {
  templateId: AdvertTemplateId
  dataUrl: string
  filename: string
}

type TenderAdvertGeneratorProps = {
  data: TenderAdvertData
  caption: string
  onCopyCaption: () => Promise<void>
}

const FORMATS: AdvertFormat[] = [
  { id: 'portrait', label: 'Portrait 1080 x 1350', width: 1080, height: 1350 },
  { id: 'square', label: 'Square 1080 x 1080', width: 1080, height: 1080 },
  { id: 'landscape', label: 'Landscape 1200 x 630', width: 1200, height: 630 }
]

const TEMPLATES: AdvertTemplate[] = [
  {
    id: 'detailed',
    name: 'Detailed Brief',
    purpose: 'Best when lots, requirements or richer tender details are available.'
  },
  {
    id: 'spotlight',
    name: 'Opportunity Spotlight',
    purpose: 'A polished overview for larger frameworks and high-value opportunities.'
  },
  {
    id: 'facts',
    name: 'Buyer and Key Facts',
    purpose: 'A concise, easy-scanning advert for most tender records.'
  },
  {
    id: 'delivery',
    name: 'Service and Delivery Focus',
    purpose: 'Useful when the service scope and delivery context matter most.'
  },
  {
    id: 'scope',
    name: 'Service Scope and Dates',
    purpose: 'Good for tenders with service categories, status and multiple dates.'
  }
]

const BRAND = {
  navy: '#102A43',
  deep: '#061B33',
  blue: '#2463A6',
  brightBlue: '#1D4ED8',
  softBlue: '#DCEAF7',
  powder: '#EDF5FC',
  nearWhite: '#F8FBFE',
  text: '#243B53',
  muted: '#52677D',
  line: '#BFD3E6',
  gold: '#F7C948'
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
  return `${candidate.slice(0, finalSpace > max * 0.65 ? finalSpace : max).trim()}...`
}

function compactTitle(value: string, format: AdvertFormat) {
  if (format.id === 'landscape') return clamp(value, 86)
  if (format.id === 'square') return clamp(value, 108)
  return clamp(value, 132)
}

function compactSummary(value: string, format: AdvertFormat) {
  if (format.id === 'landscape') return clamp(value, 105)
  if (format.id === 'square') return clamp(value, 155)
  return clamp(value, 215)
}

function recommendTemplates(data: TenderAdvertData): AdvertTemplateId[] {
  const recommended: AdvertTemplateId[] = []

  if (data.lots.length > 0 || data.importantPoints.length > 0) recommended.push('detailed')
  if (data.contractValue || data.serviceThemes.length >= 3) recommended.push('spotlight')
  recommended.push('facts')
  if (data.summary || data.deliveryLocations.length > 0) recommended.push('delivery')
  if (data.serviceThemes.length > 2 || data.enquiryDeadline || data.stage || data.status) recommended.push('scope')

  return [...new Set(recommended)].slice(0, 3)
}

function chooseFacts(data: TenderAdvertData, limit: number) {
  return data.facts.slice(0, limit)
}

function logoMark(size = 54) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: BRAND.brightBlue,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: Math.round(size * 0.32),
        letterSpacing: '-0.04em'
      }}
    >
      CA
    </div>
  )
}

function BrandHeader({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 14 : 18 }}>
      {logoMark(compact ? 44 : 58)}
      <div>
        <div
          style={{
            color: dark ? 'white' : BRAND.navy,
            fontSize: compact ? 24 : 31,
            fontWeight: 900,
            lineHeight: 1
          }}
        >
          Care Atlas
        </div>
        <div
          style={{
            marginTop: 6,
            color: dark ? '#DCEAF7' : BRAND.muted,
            fontSize: compact ? 11 : 14,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          Tender opportunity
        </div>
      </div>
    </div>
  )
}

function AdvertFooter({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        borderTop: `2px solid ${dark ? 'rgba(255,255,255,0.22)' : BRAND.line}`,
        paddingTop: 22,
        color: dark ? '#EAF4FF' : BRAND.navy,
        fontSize: 22,
        fontWeight: 800
      }}
    >
      <span>View opportunity on Care Atlas</span>
      <span style={{ color: dark ? '#FFFFFF' : BRAND.blue }}>careatlas.co.uk/tenders</span>
    </div>
  )
}

function PhotoPanel({
  label,
  format,
  round = 'card'
}: {
  label: string
  format: AdvertFormat
  round?: 'card' | 'circle'
}) {
  const isLandscape = format.id === 'landscape'
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: round === 'circle' ? 999 : 42,
        minHeight: isLandscape ? 210 : 340,
        width: round === 'circle' ? (isLandscape ? 260 : 360) : '100%',
        height: round === 'circle' ? (isLandscape ? 260 : 360) : undefined,
        background:
          'radial-gradient(circle at 30% 25%, #ffffff 0 10%, transparent 11%), linear-gradient(135deg, #DCEAF7 0%, #F8FBFE 45%, #C7DDF2 100%)',
        border: `4px solid ${BRAND.softBlue}`,
        flexShrink: 0
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 34,
          borderRadius: round === 'circle' ? 999 : 34,
          border: `3px solid ${BRAND.blue}`,
          opacity: 0.45
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 34,
          right: 34,
          bottom: 34,
          padding: '18px 22px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.82)',
          color: BRAND.navy,
          fontSize: 25,
          lineHeight: 1.08,
          fontWeight: 900
        }}
      >
        {label}
      </div>
    </div>
  )
}

function FactCard({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 24,
        padding: '20px 22px',
        background: dark ? 'rgba(255,255,255,0.08)' : '#FFFFFF',
        border: `2px solid ${dark ? 'rgba(255,255,255,0.16)' : BRAND.line}`,
        color: dark ? '#FFFFFF' : BRAND.navy
      }}
    >
      <div
        style={{
          color: dark ? '#BFD3E6' : BRAND.blue,
          fontSize: 15,
          fontWeight: 900,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 7, fontSize: 25, lineHeight: 1.12, fontWeight: 900 }}>{value}</div>
    </div>
  )
}

function ThemePill({ children, index = 0 }: { children: string; index?: number }) {
  const colors = [BRAND.powder, '#FFF4CF', '#E8F7EF', '#E8EEFF']
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        borderRadius: 999,
        background: colors[index % colors.length],
        color: BRAND.navy,
        padding: '18px 22px',
        fontSize: 24,
        fontWeight: 900
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          borderRadius: 999,
          background: index % 2 === 0 ? BRAND.blue : BRAND.gold,
          color: index % 2 === 0 ? 'white' : BRAND.navy,
          fontSize: 17
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      {children}
    </div>
  )
}

function AdvertCanvas({
  format,
  children,
  dark = false
}: {
  format: AdvertFormat
  children: ReactNode
  dark?: boolean
}) {
  return (
    <div
      style={{
        width: format.width,
        height: format.height,
        overflow: 'hidden',
        background: dark ? BRAND.deep : BRAND.nearWhite,
        color: dark ? 'white' : BRAND.text,
        fontFamily: 'Inter, Arial, sans-serif',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  )
}

function DetailedBriefTemplate({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const compact = format.id === 'square' || landscape
  const facts = chooseFacts(data, landscape ? 4 : 5)
  const lots = data.lots.length
    ? data.lots
    : data.serviceThemes.slice(0, 4).map(theme => ({ title: theme, description: null, value: null, regions: [] }))
  const requirements = data.importantPoints.length
    ? data.importantPoints
    : [
        'Review the full opportunity on Care Atlas',
        'Confirm eligibility before submitting',
        'Prepare evidence and response plan'
      ]

  return (
    <AdvertCanvas format={format}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: landscape ? 38 : 58, gap: 28 }}>
        <BrandHeader compact={compact} />
        <div style={{ display: 'flex', gap: 30, alignItems: 'stretch', minHeight: landscape ? 210 : 330 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 36,
              background: BRAND.navy,
              color: 'white',
              padding: landscape ? 30 : 42,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ color: '#9CC4F2', fontSize: 20, fontWeight: 900 }}>Tender title</div>
            <div style={{ marginTop: 10, fontSize: landscape ? 42 : 54, lineHeight: 1.02, fontWeight: 950 }}>
              {compactTitle(data.title, format)}
            </div>
            {data.reference && (
              <div style={{ marginTop: 18, color: '#DCEAF7', fontSize: 22, fontWeight: 800 }}>
                Ref: {data.reference}
              </div>
            )}
          </div>
          {!landscape && (
            <div style={{ width: 360 }}>
              <PhotoPanel label={data.category ?? 'Care sector opportunity'} format={format} />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: landscape ? 'repeat(4,1fr)' : 'repeat(3,1fr)', gap: 16 }}>
          {facts.map(fact => (
            <FactCard key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </div>

        {!landscape && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, flex: 1, minHeight: 0 }}>
            <div style={{ borderRadius: 30, background: BRAND.powder, padding: 28 }}>
              <div style={{ color: BRAND.blue, fontSize: 18, fontWeight: 950, textTransform: 'uppercase' }}>
                Scope or lots
              </div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lots.slice(0, 4).map((lot, index) => (
                  <div key={`${lot.title}-${index}`} style={{ borderRadius: 18, background: 'white', padding: 18 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: BRAND.navy }}>{clamp(lot.title, 58)}</div>
                    {lot.value && (
                      <div style={{ marginTop: 5, fontSize: 17, color: BRAND.blue, fontWeight: 800 }}>{lot.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 30, background: '#FFFFFF', border: `2px solid ${BRAND.line}`, padding: 28 }}>
              <div style={{ color: BRAND.blue, fontSize: 18, fontWeight: 950, textTransform: 'uppercase' }}>
                Important points
              </div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {requirements.slice(0, 5).map(point => (
                  <div
                    key={point}
                    style={{ display: 'flex', gap: 12, fontSize: 21, lineHeight: 1.25, color: BRAND.text }}
                  >
                    <span style={{ color: BRAND.blue, fontWeight: 950 }}>•</span>
                    <span>{clamp(point, 78)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <AdvertFooter />
      </div>
    </AdvertCanvas>
  )
}

function OpportunitySpotlightTemplate({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const metric = data.contractValue ?? data.status ?? 'Open opportunity'
  const themes = data.serviceThemes.length ? data.serviceThemes.slice(0, 3) : [data.category ?? 'Care services']

  return (
    <AdvertCanvas format={format}>
      <div
        style={{
          height: '100%',
          padding: landscape ? '34px 54px' : '54px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: landscape ? 22 : 30,
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BrandHeader compact />
        </div>
        <div
          style={{
            color: BRAND.blue,
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          Tender opportunity
        </div>
        <div style={{ color: BRAND.navy, fontSize: landscape ? 48 : 66, lineHeight: 1.02, fontWeight: 950 }}>
          {compactTitle(data.title, format)}
        </div>
        {data.buyer && (
          <div style={{ color: BRAND.blue, fontSize: landscape ? 36 : 48, lineHeight: 1.05, fontWeight: 950 }}>
            {clamp(data.buyer, landscape ? 45 : 58)}
          </div>
        )}
        <div
          style={{
            color: BRAND.text,
            fontSize: landscape ? 20 : 28,
            lineHeight: 1.25,
            maxWidth: 930,
            margin: '0 auto'
          }}
        >
          {compactSummary(
            data.summary || data.category || 'Explore this public-sector opportunity on Care Atlas.',
            format
          )}
        </div>
        <div style={{ color: BRAND.navy, fontSize: landscape ? 54 : 96, lineHeight: 0.98, fontWeight: 950 }}>
          {metric}
        </div>
        <div
          style={{ display: 'flex', gap: 26, alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}
        >
          {!landscape && <PhotoPanel label={data.location ?? 'UK care opportunity'} format={format} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: landscape ? 520 : 440 }}>
            {themes.map((theme, index) => (
              <ThemePill key={theme} index={index}>
                {clamp(theme, 38)}
              </ThemePill>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, textAlign: 'left' }}>
          {data.deadline && <FactCard label='Submission deadline' value={data.deadline} />}
          {data.commencement && <FactCard label='Commencement' value={data.commencement} />}
        </div>
        <AdvertFooter />
      </div>
    </AdvertCanvas>
  )
}

function BuyerKeyFactsTemplate({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const facts = chooseFacts(data, landscape ? 5 : 6)

  return (
    <AdvertCanvas format={format}>
      <div style={{ height: '100%', padding: landscape ? 44 : 62, display: 'flex', flexDirection: 'column', gap: 34 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 34, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <BrandHeader compact={landscape} />
            {data.buyer && (
              <div style={{ marginTop: 48, color: BRAND.blue, fontSize: landscape ? 32 : 44, fontWeight: 950 }}>
                Buyer: {clamp(data.buyer, landscape ? 44 : 58)}
              </div>
            )}
            <div
              style={{
                marginTop: 18,
                color: BRAND.navy,
                fontSize: landscape ? 48 : 64,
                lineHeight: 1.03,
                fontWeight: 950
              }}
            >
              {compactTitle(data.title, format)}
            </div>
            {data.reference && (
              <div style={{ marginTop: 22, color: BRAND.muted, fontSize: 24, fontWeight: 800 }}>
                Reference: {data.reference}
              </div>
            )}
          </div>
          {!landscape && (
            <PhotoPanel label={data.location ?? data.category ?? 'Tender'} format={format} round='circle' />
          )}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: landscape ? 'repeat(5,1fr)' : 'repeat(2,1fr)',
            gap: 18,
            flex: 1
          }}
        >
          {facts.map(fact => (
            <FactCard key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </div>
        <AdvertFooter />
      </div>
    </AdvertCanvas>
  )
}

function ServiceDeliveryTemplate({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const themes = data.serviceThemes.length
    ? data.serviceThemes.slice(0, landscape ? 3 : 4)
    : [data.category ?? 'Care services']
  const facts = chooseFacts(data, landscape ? 4 : 5)

  return (
    <AdvertCanvas format={format} dark>
      <div style={{ height: '100%', padding: landscape ? 38 : 56, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <BrandHeader dark compact={landscape} />
        <div style={{ display: 'grid', gridTemplateColumns: landscape ? '1.35fr 0.9fr' : '1fr 0.8fr', gap: 28 }}>
          <div>
            <div style={{ color: '#F7C948', fontSize: 20, fontWeight: 900, textTransform: 'uppercase' }}>
              Service and delivery focus
            </div>
            <div
              style={{
                marginTop: 16,
                color: 'white',
                fontSize: landscape ? 48 : 62,
                lineHeight: 1.03,
                fontWeight: 950
              }}
            >
              {compactTitle(data.title, format)}
            </div>
            {data.buyer && (
              <div style={{ marginTop: 20, color: '#DCEAF7', fontSize: 28, fontWeight: 850 }}>
                {clamp(data.buyer, 64)}
              </div>
            )}
            <div style={{ marginTop: 20, color: '#DCEAF7', fontSize: landscape ? 20 : 27, lineHeight: 1.32 }}>
              {compactSummary(
                data.summary || data.category || 'View the service scope and procurement facts on Care Atlas.',
                format
              )}
            </div>
          </div>
          <PhotoPanel label={data.location ?? 'Delivery area'} format={format} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: landscape ? 'repeat(4,1fr)' : 'repeat(2,1fr)', gap: 14 }}>
          {facts.map(fact => (
            <FactCard key={fact.label} label={fact.label} value={fact.value} dark />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${themes.length},1fr)`, gap: 14, flex: 1 }}>
          {themes.map(theme => (
            <div
              key={theme}
              style={{
                borderRadius: 24,
                background: 'rgba(255,255,255,0.08)',
                border: '2px solid rgba(255,255,255,0.16)',
                padding: 22,
                color: 'white',
                fontSize: landscape ? 20 : 25,
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {clamp(theme, 42)}
            </div>
          ))}
        </div>
        <AdvertFooter dark />
      </div>
    </AdvertCanvas>
  )
}

function ScopeDatesTemplate({ data, format }: { data: TenderAdvertData; format: AdvertFormat }) {
  const landscape = format.id === 'landscape'
  const themes = data.serviceThemes.length
    ? data.serviceThemes.slice(0, landscape ? 5 : 8)
    : [data.category ?? 'Care services']
  const points = data.importantPoints.length
    ? data.importantPoints
    : [data.status, data.procedure, data.procurementType].filter((point): point is string => Boolean(point))

  return (
    <AdvertCanvas format={format}>
      <div style={{ height: '100%', padding: landscape ? 36 : 52, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
          <BrandHeader compact />
          {data.status && (
            <div
              style={{
                borderRadius: 999,
                background: BRAND.navy,
                color: 'white',
                padding: '14px 22px',
                fontSize: 20,
                fontWeight: 900
              }}
            >
              {data.status}
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: landscape ? '1.35fr 0.85fr' : '1fr 0.72fr', gap: 28 }}>
          <div>
            <div style={{ color: BRAND.navy, fontSize: landscape ? 48 : 62, lineHeight: 1.02, fontWeight: 950 }}>
              {compactTitle(data.title, format)}
            </div>
            {data.buyer && (
              <div style={{ marginTop: 16, color: BRAND.blue, fontSize: landscape ? 28 : 36, fontWeight: 900 }}>
                {clamp(data.buyer, 54)}
              </div>
            )}
            <div style={{ marginTop: 18, color: BRAND.text, fontSize: landscape ? 19 : 25, lineHeight: 1.28 }}>
              {compactSummary(
                data.summary || 'Explore the tender scope, deadlines and participation information.',
                format
              )}
            </div>
          </div>
          {!landscape && <PhotoPanel label={data.category ?? 'Opportunity'} format={format} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: landscape ? 'repeat(5,1fr)' : 'repeat(3,1fr)', gap: 14 }}>
          {chooseFacts(data, landscape ? 5 : 6).map(fact => (
            <FactCard key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: landscape ? '1.2fr 0.8fr' : '1fr', gap: 20, flex: 1 }}>
          <div style={{ borderRadius: 30, background: BRAND.powder, padding: 26 }}>
            <div style={{ color: BRAND.blue, fontSize: 18, fontWeight: 950, textTransform: 'uppercase' }}>
              Services include
            </div>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {themes.map(theme => (
                <div
                  key={theme}
                  style={{
                    borderRadius: 18,
                    background: 'white',
                    padding: 16,
                    color: BRAND.navy,
                    fontSize: 20,
                    fontWeight: 850
                  }}
                >
                  {clamp(theme, 34)}
                </div>
              ))}
            </div>
          </div>
          {!landscape && (
            <div style={{ borderRadius: 30, background: '#FFFFFF', border: `2px solid ${BRAND.line}`, padding: 26 }}>
              <div style={{ color: BRAND.blue, fontSize: 18, fontWeight: 950, textTransform: 'uppercase' }}>
                Important information
              </div>
              <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(points.length ? points : ['View full opportunity details on Care Atlas']).slice(0, 3).map(point => (
                  <div key={point} style={{ color: BRAND.text, fontSize: 21, lineHeight: 1.25, fontWeight: 700 }}>
                    {clamp(point, 80)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <AdvertFooter />
      </div>
    </AdvertCanvas>
  )
}

function TenderAdvertTemplate({
  data,
  format,
  templateId
}: {
  data: TenderAdvertData
  format: AdvertFormat
  templateId: AdvertTemplateId
}) {
  switch (templateId) {
    case 'detailed':
      return <DetailedBriefTemplate data={data} format={format} />
    case 'spotlight':
      return <OpportunitySpotlightTemplate data={data} format={format} />
    case 'delivery':
      return <ServiceDeliveryTemplate data={data} format={format} />
    case 'scope':
      return <ScopeDatesTemplate data={data} format={format} />
    case 'facts':
    default:
      return <BuyerKeyFactsTemplate data={data} format={format} />
  }
}

function previewScale(format: AdvertFormat) {
  const maxWidth = 210
  return maxWidth / format.width
}

export function TenderAdvertGenerator({ data, caption, onCopyCaption }: TenderAdvertGeneratorProps) {
  const recommended = useMemo(() => recommendTemplates(data), [data])
  const [formatId, setFormatId] = useState<AdvertFormatId>('portrait')
  const [selectedIds, setSelectedIds] = useState<AdvertTemplateId[]>(recommended)
  const [generated, setGenerated] = useState<Partial<Record<AdvertTemplateId, GeneratedAdvert>>>({})
  const [generating, setGenerating] = useState(false)
  const [status, setStatus] = useState('')
  const captureRefs = useRef<Partial<Record<AdvertTemplateId, HTMLDivElement | null>>>({})

  const format = FORMATS.find(item => item.id === formatId) ?? FORMATS[0]
  const selectedTemplates = TEMPLATES.filter(template => selectedIds.includes(template.id))

  function toggleTemplate(templateId: AdvertTemplateId) {
    setGenerated({})
    setStatus('')
    setSelectedIds(current => {
      if (current.includes(templateId)) return current.filter(id => id !== templateId)
      if (current.length >= 3) return [...current.slice(1), templateId]
      return [...current, templateId]
    })
  }

  function outputFilename(templateId: AdvertTemplateId) {
    return `care-atlas-${safeFilename(data.reference || data.id)}-${templateId}-${format.id}.png`
  }

  async function generateSelected() {
    if (selectedIds.length === 0) {
      setStatus('Choose up to three templates before generating.')
      return
    }

    setGenerating(true)
    setStatus('Preparing advert images...')
    setGenerated({})

    try {
      await new Promise(requestAnimationFrame)
      await document.fonts?.ready
      const { toPng } = await import('html-to-image')
      const nextGenerated: Partial<Record<AdvertTemplateId, GeneratedAdvert>> = {}

      for (const templateId of selectedIds) {
        const node = captureRefs.current[templateId]
        if (!node) throw new Error('The advert preview was not ready. Please try again.')

        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 1,
          width: format.width,
          height: format.height,
          canvasWidth: format.width,
          canvasHeight: format.height,
          backgroundColor: BRAND.nearWhite
        })

        nextGenerated[templateId] = {
          templateId,
          dataUrl,
          filename: outputFilename(templateId)
        }
      }

      setGenerated(nextGenerated)
      setStatus('Advert images generated. Preview and download the versions you want.')
      trackEvent('tender_adverts_generated', {
        template_count: selectedIds.length,
        output_format: format.id
      })
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Advert images could not be generated.')
    } finally {
      setGenerating(false)
    }
  }

  function downloadAdvert(advert: GeneratedAdvert) {
    const link = document.createElement('a')
    link.href = advert.dataUrl
    link.download = advert.filename
    link.click()
    trackEvent('tender_advert_downloaded', { template: advert.templateId, output_format: format.id })
  }

  async function downloadAll() {
    const adverts = selectedIds.map(id => generated[id]).filter((item): item is GeneratedAdvert => Boolean(item))
    if (adverts.length !== selectedIds.length) {
      setStatus('Generate the selected adverts before downloading the ZIP.')
      return
    }

    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    for (const advert of adverts) {
      const base64 = advert.dataUrl.split(',')[1] ?? ''
      zip.file(advert.filename, base64, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `care-atlas-${safeFilename(data.reference || data.id)}-${format.id}-adverts.zip`
    link.click()
    URL.revokeObjectURL(url)
    trackEvent('tender_advert_zip_downloaded', { template_count: adverts.length, output_format: format.id })
  }

  const scale = previewScale(format)

  return (
    <section className='border-t border-gray-200 pt-6' aria-labelledby='tender-advert-generator-title'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Image adverts</p>
          <h3 id='tender-advert-generator-title' className='mt-1 text-lg font-semibold text-gray-950'>
            Generate branded tender images
          </h3>
          <p className='mt-2 max-w-2xl text-sm leading-6 text-gray-600'>
            Choose up to three Care Atlas templates. The images use verified tender fields only and download as real
            PNGs.
          </p>
        </div>
        <Button
          variant='secondary'
          onClick={() => void onCopyCaption()}
          leftIcon={<SiteIcon name='clipboard' className='h-4 w-4' />}
          className='sm:w-fit'
        >
          Copy caption
        </Button>
      </div>

      <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Recommended set</p>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          {recommended
            .map(id => TEMPLATES.find(template => template.id === id)?.name)
            .filter(Boolean)
            .join(', ')}
          {data.lots.length > 0 || data.importantPoints.length > 0
            ? ' because this record has richer detail.'
            : ' because this tender is strongest around core procurement facts.'}
        </p>
      </div>

      <div className='mt-5 grid gap-3 sm:grid-cols-3'>
        {FORMATS.map(item => (
          <label
            key={item.id}
            className={`cursor-pointer rounded-lg border p-3 text-sm font-semibold ${
              item.id === format.id
                ? 'border-brand-300 bg-brand-50 text-brand-900'
                : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            <input
              type='radio'
              className='sr-only'
              name='tender-advert-format'
              checked={item.id === format.id}
              onChange={() => {
                setFormatId(item.id)
                setGenerated({})
              }}
            />
            {item.label}
          </label>
        ))}
      </div>

      <div className='mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {TEMPLATES.map(template => {
          const selected = selectedIds.includes(template.id)
          return (
            <button
              key={template.id}
              type='button'
              onClick={() => toggleTemplate(template.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selected
                  ? 'border-brand-300 bg-brand-25 shadow-theme-xs'
                  : 'hover:border-brand-200 border-gray-200 bg-white'
              }`}
            >
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='font-semibold text-gray-950'>{template.name}</p>
                  <p className='mt-1 text-xs leading-5 text-gray-500'>{template.purpose}</p>
                </div>
                {selected && <SiteIcon name='check' className='text-brand-600 h-5 w-5 shrink-0' />}
              </div>
              <div className='mt-4 h-[170px] overflow-hidden rounded-lg border border-gray-200 bg-white'>
                <div
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: format.width,
                    height: format.height
                  }}
                >
                  <TenderAdvertTemplate data={data} format={format} templateId={template.id} />
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
        <Button
          onClick={() => void generateSelected()}
          loading={generating}
          disabled={selectedIds.length === 0}
          leftIcon={<SiteIcon name='spark' className='h-4 w-4' />}
        >
          Generate adverts
        </Button>
        <Button
          variant='secondary'
          onClick={() => void downloadAll()}
          disabled={selectedIds.some(id => !generated[id])}
          leftIcon={<SiteIcon name='share' className='h-4 w-4' />}
        >
          Download all as ZIP
        </Button>
      </div>

      <p role='status' aria-live='polite' className='mt-3 min-h-5 text-sm text-gray-600'>
        {status}
      </p>

      {selectedTemplates.length > 0 && (
        <div className='mt-5 grid gap-4 md:grid-cols-3'>
          {selectedTemplates.map(template => {
            const advert = generated[template.id]
            return (
              <div key={template.id} className='rounded-xl border border-gray-200 bg-white p-3'>
                <p className='text-sm font-semibold text-gray-950'>{template.name}</p>
                <div className='mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50'>
                  {advert ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={advert.dataUrl} alt={`${template.name} advert preview`} className='h-auto w-full' />
                  ) : (
                    <div className='flex h-40 items-center justify-center px-4 text-center text-sm text-gray-500'>
                      Generate to preview the exact PNG output.
                    </div>
                  )}
                </div>
                <Button
                  variant='secondary'
                  size='sm'
                  fullWidth
                  className='mt-3'
                  disabled={!advert}
                  onClick={() => advert && downloadAdvert(advert)}
                >
                  Download PNG
                </Button>
              </div>
            )
          })}
        </div>
      )}

      <div aria-hidden='true' className='pointer-events-none fixed top-0 -left-[10000px] opacity-0'>
        {selectedIds.map(templateId => (
          <div
            key={`${templateId}-${format.id}`}
            ref={node => {
              captureRefs.current[templateId] = node
            }}
            style={{ width: format.width, height: format.height }}
          >
            <TenderAdvertTemplate data={data} format={format} templateId={templateId} />
          </div>
        ))}
      </div>

      <textarea className='sr-only' readOnly value={caption} aria-hidden='true' tabIndex={-1} />
    </section>
  )
}
