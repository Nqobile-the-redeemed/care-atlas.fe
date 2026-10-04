import type { PublicTender } from '@/lib/api/tenders'
import { absoluteUrl } from '@/lib/seo'

const CORE_HASHTAGS = ['#TenderOpportunity', '#UKTenders', '#PublicSectorTenders', '#Procurement', '#CareProviders']

const CONTEXT_HASHTAGS: Array<[RegExp, string]> = [
  [/supported living/i, '#SupportedLiving'],
  [/social care|adult care/i, '#SocialCare'],
  [/domiciliary|home care/i, '#HomeCare'],
  [/mental health/i, '#MentalHealth'],
  [/learning disab/i, '#LearningDisability'],
  [/children|young people/i, '#ChildrensServices'],
  [/housing/i, '#SupportedHousing'],
  [/transport/i, '#CareTransport'],
  [/staffing|recruitment|workforce/i, '#CareRecruitment'],
  [/training/i, '#CareTraining'],
  [/residential|nursing home|care home/i, '#CareHomes'],
  [/health|clinical|nhs/i, '#Healthcare']
]

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  mdash: '—',
  nbsp: ' ',
  ndash: '–',
  pound: '£',
  quot: '"'
}

export type TenderShareData = {
  id: string
  title: string
  buyer: string | null
  summary: string
  contractValue: string | null
  deadline: string | null
  commencement: string | null
  location: string | null
  category: string | null
  hashtags: string[]
  publicUrl: string
}

function decodeHtmlEntities(value: string) {
  return value.replace(/&(#x?[0-9a-f]+|amp|apos|gt|lt|mdash|nbsp|ndash|pound|quot);/gi, (entity, code: string) => {
    if (code.startsWith('#')) {
      const hexadecimal = code[1]?.toLowerCase() === 'x'
      const parsed = Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10)
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : entity
    }

    return HTML_ENTITIES[code.toLowerCase()] ?? entity
  })
}

export function cleanTenderText(value: string | null | undefined, maxLength?: number) {
  const cleaned = decodeHtmlEntities(
    (value ?? '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim()

  if (!maxLength || cleaned.length <= maxLength) return cleaned

  const candidate = cleaned.slice(0, maxLength + 1)
  const finalSpace = candidate.lastIndexOf(' ')
  const cutAt = finalSpace >= Math.floor(maxLength * 0.65) ? finalSpace : maxLength

  return `${candidate.slice(0, cutAt).trimEnd()}…`
}

function validMinorValue(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null
}

export function formatTenderMoney(valueMinor: number, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(valueMinor / 100)
}

export function formatTenderValue(tender: Pick<PublicTender, 'value'>) {
  const minimum = validMinorValue(tender.value.minMinor)
  const maximum = validMinorValue(tender.value.maxMinor)
  const currency = tender.value.currency || 'GBP'

  if (minimum && maximum && minimum !== maximum) {
    return `${formatTenderMoney(minimum, currency)}–${formatTenderMoney(maximum, currency)}`
  }

  if (maximum) return formatTenderMoney(maximum, currency)
  if (minimum) return `From ${formatTenderMoney(minimum, currency)}`

  return null
}

export function formatTenderDate(value: string | null | undefined, includeTime = false) {
  if (!value) return null

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const parsed = new Date(dateOnly ? `${value}T12:00:00Z` : value)
  if (Number.isNaN(parsed.getTime())) return null

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(includeTime && !dateOnly
      ? {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h23',
          timeZoneName: 'short' as const
        }
      : {}),
    timeZone: 'Europe/London'
  }).format(parsed)
}

function locationHashtag(location: string | undefined) {
  if (!location || /^(uk|uk-wide|united kingdom|nationwide)$/i.test(location.trim())) return null

  const withoutCode = location.replace(/^[A-Z]{2,}\d+\s*[-–]\s*/, '')
  const hashtag = withoutCode
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('')

  return hashtag.length >= 3 && hashtag.length <= 24 ? `#${hashtag}` : null
}

export function tenderHashtags(tender: PublicTender) {
  const context = [
    tender.category,
    ...tender.categories,
    ...(tender.keywords ?? []),
    ...(tender.taxonomy ?? []).map(node => node.label)
  ].join(' | ')
  const hashtags = [...CORE_HASHTAGS]

  for (const [pattern, hashtag] of CONTEXT_HASHTAGS) {
    if (pattern.test(context) && !hashtags.includes(hashtag)) hashtags.push(hashtag)
    if (hashtags.length === 8) break
  }

  const location = locationHashtag(tender.regions[0] || tender.region)
  if (location && !hashtags.includes(location) && hashtags.length < 9) hashtags.push(location)

  return hashtags
}

export function toTenderShareData(tender: PublicTender): TenderShareData {
  const regions = [...new Set(tender.regions.filter(Boolean))]
  const fallbackRegion = cleanTenderText(tender.region)
  const category = cleanTenderText(tender.category)

  return {
    id: tender.id,
    title: cleanTenderText(tender.title) || 'Tender opportunity',
    buyer: cleanTenderText(tender.buyer) || null,
    summary: cleanTenderText(tender.summary, 300),
    contractValue: formatTenderValue(tender),
    deadline: formatTenderDate(tender.submissionDeadline, true),
    commencement: formatTenderDate(tender.contractStartDate),
    location: regions.length > 0 ? regions.join(', ') : fallbackRegion || null,
    category: category || null,
    hashtags: tenderHashtags(tender),
    publicUrl: absoluteUrl(tender.publicPath || `/tenders/${encodeURIComponent(tender.id)}`)
  }
}

export function buildTenderShareText(data: TenderShareData, options: { includeUrl?: boolean } = {}) {
  const details = [
    data.buyer ? `Buyer: ${data.buyer}` : '',
    data.contractValue ? `Contract Value: ${data.contractValue}` : '',
    data.deadline ? `Deadline: ${data.deadline}` : '',
    data.commencement ? `Commencement: ${data.commencement}` : '',
    data.location ? `Location: ${data.location}` : '',
    data.category ? `Category: ${data.category}` : ''
  ].filter(Boolean)
  const sections = ['TENDER OPPORTUNITY', data.title, details.join('\n'), data.summary, data.hashtags.join(' ')]

  if (options.includeUrl !== false) sections.push(data.publicUrl)

  return sections.filter(Boolean).join('\n\n')
}
