import { ALL_REGIONS } from './ukRegionsCounties'

const aliases: Record<string, string> = {
  'North East': 'North East England',
  'North West': 'North West England',
  'South East': 'South East England',
  'South West': 'South West England',
  'Yorkshire and The Humber': 'Yorkshire and the Humber'
}
export function tenderRegionOptions(observed: string[] = [], selected: string[] = []) {
  return Array.from(
    new Set(
      [
        ...ALL_REGIONS.map(region => region.name),
        'Reading',
        'Wokingham',
        'Bracknell',
        'Newbury',
        'Ascot',
        'Maidenhead',
        ...observed,
        ...selected
      ]
        .map(value => aliases[value] ?? value)
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))
}
