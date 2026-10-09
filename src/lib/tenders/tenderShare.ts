import type { PublicTender } from '@/lib/api/tenders'
import { absoluteUrl } from '@/lib/seo'

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

export type TenderShareData = { id: string; title: string; publicUrl: string }

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

export function toTenderShareData(tender: Pick<PublicTender, 'id' | 'title' | 'publicPath'>): TenderShareData {
  return {
    id: tender.id,
    title: cleanTenderText(tender.title) || 'Tender opportunity',
    publicUrl: absoluteUrl(tender.publicPath || `/tenders/${encodeURIComponent(tender.id)}`)
  }
}
