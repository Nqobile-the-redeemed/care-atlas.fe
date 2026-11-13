import { expect, it } from 'vitest'
import { tenderRegionOptions } from './tenderRegions'

it('keeps all twelve broad regions and Berkshire towns available without feed matches', () => {
  const options = tenderRegionOptions()
  for (const place of [
    'Scotland',
    'Wales',
    'Northern Ireland',
    'South East England',
    'London',
    'Reading',
    'Wokingham',
    'Bracknell',
    'Newbury',
    'Ascot',
    'Maidenhead'
  ])
    expect(options).toContain(place)
})

it('keeps API and saved locations without duplicate aliases', () => {
  const options = tenderRegionOptions(['South East', 'South East England', 'Torfaen'], ['Saved district'])
  expect(options.filter(place => place === 'South East England')).toHaveLength(1)
  expect(options).toContain('Torfaen')
  expect(options).toContain('Saved district')
})
