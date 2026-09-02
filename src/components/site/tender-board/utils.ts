import type { BookingSlot } from '@/lib/api/bookings'
import type { PublicTender, PublicTenderDetail } from '@/lib/api/tenders'

import type { TenderBoardSelectedTender } from './types'

export function dateLabel(value: string | null) {
  if (!value) return 'Not stated'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))
}

export function money(value: number | null, currency = 'GBP') {
  if (value === null) return 'Not stated'

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value / 100)
}

export function valueLabel(tender: Pick<PublicTender, 'value'>) {
  return money(tender.value.maxMinor ?? tender.value.minMinor, tender.value.currency)
}

export function yesNo(value: boolean | null | undefined) {
  if (value === null || value === undefined) return 'Not stated'

  return value ? 'Yes' : 'No'
}

export function plainText(value: string | null | undefined) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function formatSlotDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date(`${date}T12:00:00`))
}

export function groupSlots(slots: BookingSlot[]) {
  return slots.reduce<Record<string, BookingSlot[]>>((groups, slot) => {
    groups[slot.date] = [...(groups[slot.date] ?? []), slot]
    return groups
  }, {})
}

export function hasTenderDetails(tender: TenderBoardSelectedTender): tender is PublicTenderDetail {
  return 'description' in tender
}

export function tenderBookingMessage(tender: TenderBoardSelectedTender, message: string) {
  const sourceNoticeUrl = hasTenderDetails(tender) ? tender.sourceNoticeUrl : null

  return [
    message.trim(),
    '',
    `Tender: ${tender.title}`,
    tender.buyer ? `Buyer: ${tender.buyer}` : '',
    tender.sourceReference ? `Reference: ${tender.sourceReference}` : '',
    tender.submissionDeadline ? `Deadline: ${dateLabel(tender.submissionDeadline)}` : '',
    sourceNoticeUrl ? `Notice: ${sourceNoticeUrl}` : ''
  ]
    .filter(Boolean)
    .join('\n')
}
