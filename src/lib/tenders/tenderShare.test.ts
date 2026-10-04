import { describe, expect, it } from 'vitest'

import type { PublicTender } from '@/lib/api/tenders'

import {
  buildTenderShareText,
  cleanTenderText,
  formatTenderDate,
  formatTenderValue,
  tenderHashtags,
  toTenderShareData
} from './tenderShare'

function tender(overrides: Partial<PublicTender> = {}): PublicTender {
  return {
    id: '01a06121-5c09-731c-a0ff-e836b86ecd6c',
    title: 'Adult Social Care Extra Care Services Framework',
    buyer: 'Sefton Council',
    sourceReference: 'DN-100',
    category: 'Extra Care',
    categories: ['Extra Care'],
    keywords: ['Adult social care', 'Care services', 'Extra care housing'],
    taxonomy: [
      {
        slug: 'health-and-social-care',
        label: 'Health and social care',
        level: 'industry',
        parentSlug: null
      }
    ],
    region: 'Sefton',
    regions: ['Sefton'],
    summary: '<p>Commissioning extra care services for adults &amp; older people across Sefton.</p>',
    value: { minMinor: null, maxMinor: null, currency: 'GBP' },
    publishedAt: '2026-09-01T10:00:00Z',
    submissionDeadline: '2026-10-26T12:00:00Z',
    daysRemaining: 22,
    contractStartDate: '2027-04-01',
    contractEndDate: '2030-03-31',
    states: ['active'],
    indicativePricing: {
      upfrontFeeMinor: 250000,
      successFeeMinor: null,
      currency: 'GBP',
      reviewed: true
    },
    locked: false,
    lastSeenAt: '2026-10-01T10:00:00Z',
    publicPath: '/tenders/01a06121-5c09-731c-a0ff-e836b86ecd6c',
    ...overrides
  }
}

describe('cleanTenderText', () => {
  it('removes markup, scripts and decodes supported entities', () => {
    expect(cleanTenderText('<p>Care &amp; support</p><script>alert(1)</script>&pound;10')).toBe('Care & support £10')
  })

  it('collapses whitespace into a readable single paragraph', () => {
    expect(cleanTenderText(' Care\n\n   services\tfor all ')).toBe('Care services for all')
  })

  it('truncates long copy at a word boundary', () => {
    const value = 'Supported living services '.repeat(20)
    const result = cleanTenderText(value, 80)

    expect(result.length).toBeLessThanOrEqual(81)
    expect(result).toMatch(/…$/)
    expect(result).not.toMatch(/servic…$/)
  })
})

describe('tender share formatting', () => {
  it('formats an exact contract value without adding VAT claims', () => {
    expect(formatTenderValue(tender({ value: { minMinor: 2304000000, maxMinor: 2304000000, currency: 'GBP' } }))).toBe(
      '£23,040,000'
    )
  })

  it('formats a genuine value range', () => {
    expect(formatTenderValue(tender({ value: { minMinor: 10000000, maxMinor: 25000000, currency: 'GBP' } }))).toBe(
      '£100,000–£250,000'
    )
  })

  it('keeps a maximum-only value neutral', () => {
    expect(formatTenderValue(tender({ value: { minMinor: null, maxMinor: 25000000, currency: 'GBP' } }))).toBe(
      '£250,000'
    )
  })

  it('labels a minimum-only value as starting from that amount', () => {
    expect(formatTenderValue(tender({ value: { minMinor: 25000000, maxMinor: null, currency: 'GBP' } }))).toBe(
      'From £250,000'
    )
  })

  it('omits zero and missing values', () => {
    expect(formatTenderValue(tender({ value: { minMinor: 0, maxMinor: null, currency: 'GBP' } }))).toBeNull()
  })

  it('formats timed deadlines in Europe/London', () => {
    expect(formatTenderDate('2026-10-26T12:00:00Z', true)).toMatch(/26 October 2026.*12:00.*GMT/)
  })

  it('keeps date-only commencement dates on the source calendar date', () => {
    expect(formatTenderDate('2027-04-01')).toBe('1 April 2027')
  })

  it('omits invalid dates', () => {
    expect(formatTenderDate('not-a-date', true)).toBeNull()
  })
})

describe('tender share content', () => {
  it('always supplies a focused set of core hashtags', () => {
    expect(
      tenderHashtags(tender({ category: '', categories: [], keywords: [], taxonomy: [], regions: [], region: '' }))
    ).toEqual(['#TenderOpportunity', '#UKTenders', '#PublicSectorTenders', '#Procurement', '#CareProviders'])
  })

  it('adds controlled subject and location hashtags without duplicates', () => {
    const hashtags = tenderHashtags(tender())

    expect(hashtags).toContain('#SocialCare')
    expect(hashtags).toContain('#SupportedHousing')
    expect(hashtags).toContain('#Sefton')
    expect(new Set(hashtags).size).toBe(hashtags.length)
    expect(hashtags.length).toBeLessThanOrEqual(9)
  })

  it('normalizes the canonical public URL to the Care Atlas origin', () => {
    expect(toTenderShareData(tender()).publicUrl).toBe(
      'https://www.careatlas.co.uk/tenders/01a06121-5c09-731c-a0ff-e836b86ecd6c'
    )
  })

  it('does not invent fields missing from a sparse tender', () => {
    const data = toTenderShareData(
      tender({
        buyer: null,
        summary: '',
        category: '',
        categories: [],
        region: '',
        regions: [],
        submissionDeadline: null,
        contractStartDate: null
      })
    )
    const advert = buildTenderShareText(data)

    expect(advert).not.toContain('Buyer:')
    expect(advert).not.toContain('Deadline:')
    expect(advert).not.toContain('Commencement:')
    expect(advert).not.toContain('Outcome')
    expect(advert).not.toContain('suppliers')
  })

  it('builds a complete advert from the audited Sefton-shaped record', () => {
    const advert = buildTenderShareText(toTenderShareData(tender()))

    expect(advert).toContain('Adult Social Care Extra Care Services Framework')
    expect(advert).toContain('Buyer: Sefton Council')
    expect(advert).toContain('Deadline: 26 October 2026')
    expect(advert).toContain('Commencement: 1 April 2027')
    expect(advert).toContain('Location: Sefton')
    expect(advert).toContain('#TenderOpportunity')
    expect(advert).toContain('https://www.careatlas.co.uk/tenders/')
  })

  it('can omit the URL for native share payloads', () => {
    const data = toTenderShareData(tender())

    expect(buildTenderShareText(data, { includeUrl: false })).not.toContain(data.publicUrl)
  })
})
