import type { PublicTender, PublicTenderDetail, PublicTenderLot } from '@/lib/api/tenders'
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

export type TenderAdvertFact = {
  label: string
  value: string
}

export type TenderAdvertData = TenderShareData & {
  reference: string | null
  published: string | null
  enquiryDeadline: string | null
  outcomeDate: string | null
  contractEnd: string | null
  duration: string | null
  procedure: string | null
  procurementType: string | null
  stage: string | null
  status: string | null
  approvedImageUrl: string | null
  buyerLogoUrl: string | null
  deliveryLocations: string[]
  cpvCodes: string[]
  serviceThemes: string[]
  lots: Array<{
    title: string
    description: string | null
    value: string | null
    regions: string[]
  }>
  importantPoints: string[]
  facts: TenderAdvertFact[]
  hasDetailedScope: boolean
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

function hasDetailedTenderFields(tender: PublicTender): tender is PublicTenderDetail {
  return 'description' in tender
}

function cleanList(values: Array<string | null | undefined>, limit = 6) {
  return [...new Set(values.map(value => cleanTenderText(value)).filter(Boolean))].slice(0, limit)
}

function lotToAdvertLot(lot: PublicTenderLot) {
  return {
    title: cleanTenderText(lot.title, 90) || 'Lot',
    description: cleanTenderText(lot.description, 130) || null,
    value: lot.valueMinor ? formatTenderMoney(lot.valueMinor, lot.currency || 'GBP') : null,
    regions: cleanList(lot.regions, 3)
  }
}

function statusLabel(tender: PublicTender) {
  if (tender.daysRemaining !== null && tender.daysRemaining < 0) return 'Closed'
  if (tender.daysRemaining === 0) return 'Closes today'
  if (tender.daysRemaining !== null) return `${tender.daysRemaining} days remaining`
  return tender.states[0] ? tender.states[0].replaceAll('_', ' ') : null
}

function serviceThemes(tender: PublicTender) {
  return cleanList(
    [
      tender.category,
      ...tender.categories,
      ...(tender.taxonomy ?? []).map(node => node.label),
      ...(tender.keywords ?? [])
    ],
    5
  )
}

function importantTenderPoints(tender: PublicTender) {
  const detailed = hasDetailedTenderFields(tender) ? tender : null
  const points = [
    detailed?.isFramework ? 'Framework opportunity' : '',
    detailed?.isDynamicMarket ? 'Dynamic market opportunity' : '',
    detailed?.smeSuitable === true ? 'Marked SME suitable' : '',
    detailed?.vcseSuitable === true ? 'Marked VCSE suitable' : '',
    detailed?.responsePortalUrl ? 'Response portal available from the source notice' : '',
    detailed?.sourceNoticeUrl ? 'Original public notice available' : ''
  ]

  return cleanList(points, 3)
}

function buildAdvertFacts(tender: PublicTender, shareData: TenderShareData): TenderAdvertFact[] {
  const detailed = hasDetailedTenderFields(tender) ? tender : null
  const locations = detailed?.deliveryLocations?.length ? detailed.deliveryLocations.join(', ') : shareData.location
  const facts: TenderAdvertFact[] = [
    shareData.deadline ? { label: 'Submission deadline', value: shareData.deadline } : null,
    shareData.contractValue ? { label: 'Contract value', value: shareData.contractValue } : null,
    shareData.commencement ? { label: 'Commencement', value: shareData.commencement } : null,
    detailed?.clarificationDeadline
      ? { label: 'Enquiry deadline', value: formatTenderDate(detailed.clarificationDeadline, true) ?? '' }
      : null,
    locations ? { label: 'Location', value: cleanTenderText(locations, 90) } : null,
    detailed?.procedureType ? { label: 'Procedure', value: cleanTenderText(detailed.procedureType, 90) } : null
  ].filter((fact): fact is TenderAdvertFact => Boolean(fact && fact.value))

  return facts.slice(0, 7)
}

export function toTenderAdvertData(tender: PublicTender): TenderAdvertData {
  const shareData = toTenderShareData(tender)
  const detailed = hasDetailedTenderFields(tender) ? tender : null
  const lots = (detailed?.lots ?? []).map(lotToAdvertLot).slice(0, 4)
  const deliveryLocations = cleanList(detailed?.deliveryLocations ?? tender.regions, 5)

  return {
    ...shareData,
    reference: cleanTenderText(tender.sourceReference) || null,
    published: formatTenderDate(tender.publishedAt),
    enquiryDeadline: formatTenderDate(detailed?.clarificationDeadline, true),
    outcomeDate: null,
    contractEnd: formatTenderDate(tender.contractEndDate),
    duration: null,
    procedure: cleanTenderText(detailed?.procedureType) || null,
    procurementType: cleanTenderText(detailed?.procurementType) || null,
    stage: cleanTenderText(detailed?.stage) || null,
    status: statusLabel(tender),
    approvedImageUrl: null,
    buyerLogoUrl: null,
    deliveryLocations,
    cpvCodes: cleanList(detailed?.cpvCodes ?? [], 5),
    serviceThemes: serviceThemes(tender),
    lots,
    importantPoints: importantTenderPoints(tender),
    facts: buildAdvertFacts(tender, shareData),
    hasDetailedScope: Boolean(detailed?.description || lots.length > 0 || detailed?.cpvCodes?.length)
  }
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
