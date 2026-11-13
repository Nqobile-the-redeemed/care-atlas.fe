import { describe, expect, it } from 'vitest'

import {
  appendTenderClassificationUrlState,
  readTenderClassificationSelections
} from './TenderClassificationFilters'

describe('tender classification URL state', () => {
  it('round-trips include and exclude selections', () => {
    const source = new URLSearchParams('lifecycle_stage=live_tender&exclude_bid_status=members_only')
    const selections = readTenderClassificationSelections(source)
    const target = new URLSearchParams()
    appendTenderClassificationUrlState(target, selections)

    expect(selections.lifecycleStage.include).toEqual(['live_tender'])
    expect(selections.bidStatus.exclude).toEqual(['members_only'])
    expect(target.getAll('lifecycle_stage')).toEqual(['live_tender'])
    expect(target.getAll('exclude_bid_status')).toEqual(['members_only'])
  })
})
