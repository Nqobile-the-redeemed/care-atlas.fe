export type TenderPreview = {
  id: string
  title: string
  buyer: string | null
  sourceReference: string | null
  category: string
  categories: string[]
  region: string
  regions: string[]
  summary: string
  value: {
    minMinor: number | null
    maxMinor: number | null
    currency: string
  }
  publishedAt: string | null
  submissionDeadline: string | null
  daysRemaining: number | null
  contractStartDate: string | null
  contractEndDate: string | null
  states: Array<'new' | 'closing_soon' | 'updated' | 'framework'>
  indicativePricing: {
    upfrontFeeMinor: number
    successFeeMinor: number | null
    currency: string
    reviewed: boolean
  }
  locked: true
  lastSeenAt: string | null
}

export type TenderFilters = {
  categories: string[]
  regions: string[]
}
