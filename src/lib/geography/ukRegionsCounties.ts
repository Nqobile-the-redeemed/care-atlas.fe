import type { Option } from '@/components/site/standalone-inputs'

export type ConstituentCountry = 'England' | 'Scotland' | 'Wales' | 'Northern Ireland'

export type CountyType = 'ceremonial' | 'lieutenancy' | 'council-area' | 'preserved'

export type UkRegionCode = 'NE' | 'NW' | 'YH' | 'EM' | 'WM' | 'EE' | 'LDN' | 'SE' | 'SW' | 'SCT' | 'WLS' | 'NIR'

export interface UkRegion {
  code: UkRegionCode
  name: string
  constituentCountry: ConstituentCountry
  itl1?: string
}

export interface UkCounty {
  code: string
  name: string
  regionCode: UkRegionCode
  countyType: CountyType
  aliases?: string[]
}

export const ALL_REGIONS: UkRegion[] = [
  { code: 'NE', name: 'North East', constituentCountry: 'England', itl1: 'TLC' },
  { code: 'NW', name: 'North West', constituentCountry: 'England', itl1: 'TLD' },
  { code: 'YH', name: 'Yorkshire and The Humber', constituentCountry: 'England', itl1: 'TLE' },
  { code: 'EM', name: 'East Midlands', constituentCountry: 'England', itl1: 'TLF' },
  { code: 'WM', name: 'West Midlands', constituentCountry: 'England', itl1: 'TLG' },
  { code: 'EE', name: 'East of England', constituentCountry: 'England', itl1: 'TLH' },
  { code: 'LDN', name: 'London', constituentCountry: 'England', itl1: 'TLI' },
  { code: 'SE', name: 'South East', constituentCountry: 'England', itl1: 'TLJ' },
  { code: 'SW', name: 'South West', constituentCountry: 'England', itl1: 'TLK' },
  { code: 'SCT', name: 'Scotland', constituentCountry: 'Scotland', itl1: 'TLM' },
  { code: 'WLS', name: 'Wales', constituentCountry: 'Wales', itl1: 'TLL' },
  { code: 'NIR', name: 'Northern Ireland', constituentCountry: 'Northern Ireland', itl1: 'TLN' }
]

export const ALL_COUNTIES: UkCounty[] = [
  // ---------- North East (NE) ----------
  { code: 'durham', name: 'County Durham', regionCode: 'NE', countyType: 'ceremonial' },
  { code: 'northumberland', name: 'Northumberland', regionCode: 'NE', countyType: 'ceremonial' },
  {
    code: 'tyne-and-wear',
    name: 'Tyne and Wear',
    regionCode: 'NE',
    countyType: 'ceremonial',
    aliases: ['Tyne & Wear']
  },

  // ---------- North West (NW) ----------
  { code: 'cheshire', name: 'Cheshire', regionCode: 'NW', countyType: 'ceremonial' },
  { code: 'cumbria', name: 'Cumbria', regionCode: 'NW', countyType: 'ceremonial' },
  { code: 'greater-manchester', name: 'Greater Manchester', regionCode: 'NW', countyType: 'ceremonial' },
  { code: 'lancashire', name: 'Lancashire', regionCode: 'NW', countyType: 'ceremonial' },
  { code: 'merseyside', name: 'Merseyside', regionCode: 'NW', countyType: 'ceremonial' },

  // ---------- Yorkshire and The Humber (YH) ----------
  { code: 'east-riding-of-yorkshire', name: 'East Riding of Yorkshire', regionCode: 'YH', countyType: 'ceremonial' },
  { code: 'north-yorkshire', name: 'North Yorkshire', regionCode: 'YH', countyType: 'ceremonial' },
  { code: 'south-yorkshire', name: 'South Yorkshire', regionCode: 'YH', countyType: 'ceremonial' },
  { code: 'west-yorkshire', name: 'West Yorkshire', regionCode: 'YH', countyType: 'ceremonial' },
  {
    code: 'lincolnshire-yh',
    name: 'Lincolnshire (part)',
    regionCode: 'YH',
    countyType: 'ceremonial',
    aliases: ['Lincolnshire']
  },

  // ---------- East Midlands (EM) ----------
  { code: 'derbyshire', name: 'Derbyshire', regionCode: 'EM', countyType: 'ceremonial' },
  { code: 'leicestershire', name: 'Leicestershire', regionCode: 'EM', countyType: 'ceremonial' },
  { code: 'lincolnshire', name: 'Lincolnshire', regionCode: 'EM', countyType: 'ceremonial' },
  { code: 'northamptonshire', name: 'Northamptonshire', regionCode: 'EM', countyType: 'ceremonial' },
  { code: 'nottinghamshire', name: 'Nottinghamshire', regionCode: 'EM', countyType: 'ceremonial' },
  { code: 'rutland', name: 'Rutland', regionCode: 'EM', countyType: 'ceremonial' },

  // ---------- West Midlands (WM) ----------
  {
    code: 'herefordshire',
    name: 'Herefordshire',
    regionCode: 'WM',
    countyType: 'ceremonial',
    aliases: ['Hereford and Worcester']
  },
  { code: 'shropshire', name: 'Shropshire', regionCode: 'WM', countyType: 'ceremonial', aliases: ['Salop'] },
  { code: 'staffordshire', name: 'Staffordshire', regionCode: 'WM', countyType: 'ceremonial' },
  { code: 'warwickshire', name: 'Warwickshire', regionCode: 'WM', countyType: 'ceremonial' },
  { code: 'west-midlands', name: 'West Midlands', regionCode: 'WM', countyType: 'ceremonial' },
  { code: 'worcestershire', name: 'Worcestershire', regionCode: 'WM', countyType: 'ceremonial' },

  // ---------- East of England (EE) ----------
  { code: 'bedfordshire', name: 'Bedfordshire', regionCode: 'EE', countyType: 'ceremonial' },
  { code: 'cambridgeshire', name: 'Cambridgeshire', regionCode: 'EE', countyType: 'ceremonial' },
  { code: 'essex', name: 'Essex', regionCode: 'EE', countyType: 'ceremonial' },
  { code: 'hertfordshire', name: 'Hertfordshire', regionCode: 'EE', countyType: 'ceremonial' },
  { code: 'norfolk', name: 'Norfolk', regionCode: 'EE', countyType: 'ceremonial' },
  { code: 'suffolk', name: 'Suffolk', regionCode: 'EE', countyType: 'ceremonial' },

  // ---------- London (LDN) ----------
  { code: 'greater-london', name: 'Greater London', regionCode: 'LDN', countyType: 'ceremonial', aliases: ['London'] },
  {
    code: 'city-of-london',
    name: 'City of London',
    regionCode: 'LDN',
    countyType: 'ceremonial',
    aliases: ['The City', 'Square Mile']
  },

  // ---------- South East (SE) ----------
  { code: 'berkshire', name: 'Berkshire', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'buckinghamshire', name: 'Buckinghamshire', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'east-sussex', name: 'East Sussex', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'hampshire', name: 'Hampshire', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'isle-of-wight', name: 'Isle of Wight', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'kent', name: 'Kent', regionCode: 'SE', countyType: 'ceremonial', aliases: ['Garden of England'] },
  { code: 'oxfordshire', name: 'Oxfordshire', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'surrey', name: 'Surrey', regionCode: 'SE', countyType: 'ceremonial' },
  { code: 'west-sussex', name: 'West Sussex', regionCode: 'SE', countyType: 'ceremonial' },

  // ---------- South West (SW) ----------
  {
    code: 'bath-and-north-east-somerset',
    name: 'Bath and North East Somerset',
    regionCode: 'SW',
    countyType: 'ceremonial'
  },
  { code: 'bristol', name: 'Bristol', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'cornwall', name: 'Cornwall', regionCode: 'SW', countyType: 'ceremonial', aliases: ['Kernow'] },
  { code: 'devon', name: 'Devon', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'dorset', name: 'Dorset', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'gloucestershire', name: 'Gloucestershire', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'isles-of-scilly', name: 'Isles of Scilly', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'north-somerset', name: 'North Somerset', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'somerset', name: 'Somerset', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'south-gloucestershire', name: 'South Gloucestershire', regionCode: 'SW', countyType: 'ceremonial' },
  { code: 'wiltshire', name: 'Wiltshire', regionCode: 'SW', countyType: 'ceremonial' },

  // ---------- Scotland (SCT) ---------- Lieutenancy areas
  { code: 'aberdeenshire', name: 'Aberdeenshire', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'angus', name: 'Angus', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'argyll-and-bute', name: 'Argyll and Bute', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'ayrshire-and-arran', name: 'Ayrshire and Arran', regionCode: 'SCT', countyType: 'lieutenancy' },
  {
    code: 'city-of-edinburgh',
    name: 'City of Edinburgh',
    regionCode: 'SCT',
    countyType: 'lieutenancy',
    aliases: ['Edinburgh']
  },
  { code: 'city-of-glasgow', name: 'Glasgow', regionCode: 'SCT', countyType: 'lieutenancy', aliases: ['Glasgow City'] },
  { code: 'dumfries-and-galloway', name: 'Dumfries and Galloway', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'dundee', name: 'Dundee', regionCode: 'SCT', countyType: 'lieutenancy', aliases: ['City of Dundee'] },
  { code: 'falkirk', name: 'Falkirk', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'fife', name: 'Fife', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'highland', name: 'Highland', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'inverclyde', name: 'Inverclyde', regionCode: 'SCT', countyType: 'lieutenancy' },
  {
    code: 'lanarkshire',
    name: 'Lanarkshire',
    regionCode: 'SCT',
    countyType: 'lieutenancy',
    aliases: ['North and South Lanarkshire']
  },
  {
    code: 'lothian',
    name: 'Lothian',
    regionCode: 'SCT',
    countyType: 'lieutenancy',
    aliases: ['East, Mid and West Lothian']
  },
  { code: 'moray', name: 'Moray', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'orkney', name: 'Orkney', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'perth-and-kinross', name: 'Perth and Kinross', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'renfrewshire', name: 'Renfrewshire', regionCode: 'SCT', countyType: 'lieutenancy' },
  { code: 'shetland', name: 'Shetland', regionCode: 'SCT', countyType: 'lieutenancy', aliases: ['Zetland'] },
  { code: 'stirling', name: 'Stirling', regionCode: 'SCT', countyType: 'lieutenancy' },
  {
    code: 'the-borders',
    name: 'Scottish Borders',
    regionCode: 'SCT',
    countyType: 'lieutenancy',
    aliases: ['The Borders']
  },
  {
    code: 'western-isles',
    name: 'Western Isles (Eilean Siar)',
    regionCode: 'SCT',
    countyType: 'lieutenancy',
    aliases: ['Na h-Eileanan Siar', 'Outer Hebrides']
  },

  // ---------- Wales (WLS) ---------- Preserved counties
  { code: 'blaenau-gwent', name: 'Blaenau Gwent', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'bridgend', name: 'Bridgend', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'caerphilly', name: 'Caerphilly', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'cardiff', name: 'Cardiff', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'carmarthenshire', name: 'Carmarthenshire', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'ceredigion', name: 'Ceredigion', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'conwy', name: 'Conwy', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'denbighshire', name: 'Denbighshire', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'flintshire', name: 'Flintshire', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'gwynedd', name: 'Gwynedd', regionCode: 'WLS', countyType: 'preserved' },
  {
    code: 'isle-of-anglesey',
    name: 'Isle of Anglesey',
    regionCode: 'WLS',
    countyType: 'preserved',
    aliases: ['Ynys Môn']
  },
  { code: 'merthyr-tydfil', name: 'Merthyr Tydfil', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'monmouthshire', name: 'Monmouthshire', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'neath-port-talbot', name: 'Neath Port Talbot', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'newport', name: 'Newport', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'pembrokeshire', name: 'Pembrokeshire', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'powys', name: 'Powys', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'rhondda-cynon-taff', name: 'Rhondda Cynon Taf', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'swansea', name: 'Swansea', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'torfaen', name: 'Torfaen', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'vale-of-glamorgan', name: 'Vale of Glamorgan', regionCode: 'WLS', countyType: 'preserved' },
  { code: 'wrexham', name: 'Wrexham', regionCode: 'WLS', countyType: 'preserved' },

  // ---------- Northern Ireland (NIR) ---------- 6 traditional counties
  {
    code: 'antrim',
    name: 'County Antrim',
    regionCode: 'NIR',
    countyType: 'lieutenancy',
    aliases: ['Aontroim', 'Antrim']
  },
  {
    code: 'armagh',
    name: 'County Armagh',
    regionCode: 'NIR',
    countyType: 'lieutenancy',
    aliases: ['Ard Mhacha', 'Armagh']
  },
  { code: 'down', name: 'County Down', regionCode: 'NIR', countyType: 'lieutenancy', aliases: ['An Dún', 'Down'] },
  {
    code: 'fermanagh',
    name: 'County Fermanagh',
    regionCode: 'NIR',
    countyType: 'lieutenancy',
    aliases: ['Fear Manach', 'Fermanagh']
  },
  {
    code: 'londonderry',
    name: 'County Londonderry',
    regionCode: 'NIR',
    countyType: 'lieutenancy',
    aliases: ['Doire', 'Derry']
  },
  {
    code: 'tyrone',
    name: 'County Tyrone',
    regionCode: 'NIR',
    countyType: 'lieutenancy',
    aliases: ['Tír Eoghain', 'Tyrone']
  }
]

export const REGION_CODES = new Set<UkRegionCode>(ALL_REGIONS.map(r => r.code))

export const COUNTY_CODES = new Set<string>(ALL_COUNTIES.map(c => c.code))

export function getCountiesByRegion(regionCodes: UkRegionCode[]): UkCounty[] {
  const set = new Set(regionCodes)

  return ALL_COUNTIES.filter(c => set.has(c.regionCode))
}

export function findRegionByCode(code: UkRegionCode): UkRegion | undefined {
  return ALL_REGIONS.find(r => r.code === code)
}

export function findCountyByCode(code: string): UkCounty | undefined {
  return ALL_COUNTIES.find(c => c.code === code)
}

export function regionToOption(region: UkRegion): Option {
  return {
    code: region.code,
    name: region.name,
    value: region.code,
    description: region.constituentCountry
  }
}

export function countyToOption(county: UkCounty): Option {
  return {
    code: county.code,
    name: county.name,
    value: county.code,
    description: findRegionByCode(county.regionCode)?.name
  }
}

export function getAllRegionOptions(): Option[] {
  return ALL_REGIONS.map(regionToOption)
}

export function getCountyOptionsForRegions(regionCodes: UkRegionCode[]): Option[] {
  return getCountiesByRegion(regionCodes).map(countyToOption)
}
