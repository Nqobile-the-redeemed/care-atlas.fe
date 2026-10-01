'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  getPublicTenderFilters,
  getPublicTender,
  getPublicTenders,
  type PublicTender,
  type TenderFilters,
  type TenderLeadKind,
  type TenderPagination,
  type TenderTaxonomyNode
} from '@/lib/api/tenders'
import { useHalfScreenModal } from '@/context/HalfScreenModalContext'

import { SiteIcon } from './SiteIcon'
import { Button } from './ui'
import {
  TenderBoardFilters,
  TenderBoardHalfScreenContent,
  TenderBoardList,
  type TenderBoardViewMode,
  type TenderBoardFiltersState,
  type TenderBoardPanelData
} from './tender-board'

const TENDERS_PER_PAGE = 15
const DEFAULT_SORT: 'deadline' | 'newest' = 'newest'

type AppliedTenderFilters = Pick<TenderBoardFiltersState, 'keyword'> & {
  category: string[]
  region: string[]
  subcategory: string[]
  taxonomy: string[]
  keywords: string[]
  stage: string[]
  procedureType: string[]
  procurementType: string[]
  publishedFrom?: string
  publishedTo?: string
  deadlineFrom?: string
  deadlineTo?: string
  framework?: boolean
  dynamicMarket?: boolean
  smeSuitable?: boolean
  valueMinMinor?: number
  valueMaxMinor?: number
  sort: 'deadline' | 'newest'
}

type FilterPanelProps = {
  region: string[]
  subcategory: string[]
  taxonomy: string[]
  keywords: string[]
  stage: string[]
  procedureType: string[]
  procurementType: string[]
  regions: string[]
  subcategories: string[]
  taxonomyNodes: TenderTaxonomyNode[]
  keywordOptions: string[]
  stages: string[]
  procedureTypes: string[]
  procurementTypes: string[]
  publishedFrom: string
  publishedTo: string
  deadlineFrom: string
  deadlineTo: string
  framework: boolean
  dynamicMarket: boolean
  smeSuitable: boolean
  valueMinMinor?: number
  valueMaxMinor?: number
  valueBounds?: { minMinor: number | null; maxMinor: number | null; currency: string }
  resultCount?: number
  facets?: TenderFilters['facets']
  activeFilterCount: number
  onRegionToggle: (value: string) => void
  onSubcategoryToggle: (value: string) => void
  onTaxonomyToggle: (value: string) => void
  onKeywordToggle: (value: string) => void
  onStageToggle: (value: string) => void
  onProcedureTypeToggle: (value: string) => void
  onProcurementTypeToggle: (value: string) => void
  onDateChange: (field: 'publishedFrom' | 'publishedTo' | 'deadlineFrom' | 'deadlineTo', value: string) => void
  onBooleanChange: (field: 'framework' | 'dynamicMarket' | 'smeSuitable', value: boolean) => void
  onValueChange: (field: 'valueMinMinor' | 'valueMaxMinor', value: number) => void
  onClear: () => void
}

function dedupeTenders(tenders: PublicTender[]) {
  const seen = new Set<string>()

  return tenders.filter(tender => {
    const key = [tender.id, tender.sourceReference, tender.title.toLowerCase(), tender.buyer?.toLowerCase() ?? '']
      .filter(Boolean)
      .join('|')

    if (seen.has(key)) return false
    seen.add(key)

    return true
  })
}

function optionalNumber(value: string | null) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function compactMoneyMinor(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    notation: 'compact',
    maximumFractionDigits: value >= 100_000_000 ? 1 : 0
  }).format(value / 100)
}

function valueStops(minimum: number, maximum: number) {
  if (maximum <= minimum) return [minimum]

  return Array.from({ length: 5 }, (_, index) => Math.round(minimum + ((maximum - minimum) * index) / 4))
}

function TenderValueRange({
  minimum,
  maximum,
  selectedMinimum,
  selectedMaximum,
  step,
  onChange
}: {
  minimum: number
  maximum: number
  selectedMinimum: number
  selectedMaximum: number
  step: number
  onChange: (field: 'valueMinMinor' | 'valueMaxMinor', value: number) => void
}) {
  const stops = valueStops(minimum, maximum)
  const span = Math.max(1, maximum - minimum)
  const minimumPercent = ((selectedMinimum - minimum) / span) * 100
  const maximumPercent = ((selectedMaximum - minimum) / span) * 100

  const jumpTo = (value: number) => {
    if (Math.abs(value - selectedMinimum) <= Math.abs(value - selectedMaximum)) {
      onChange('valueMinMinor', Math.min(value, selectedMaximum))
      return
    }

    onChange('valueMaxMinor', Math.max(value, selectedMinimum))
  }

  return (
    <div className='mx-auto w-full max-w-lg rounded-lg border border-gray-200 bg-gray-50 p-3'>
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <span className='block text-[11px] font-semibold tracking-wide text-gray-500 uppercase'>Minimum</span>
          <strong className='mt-0.5 block text-sm text-gray-950 tabular-nums'>
            {compactMoneyMinor(selectedMinimum)}
          </strong>
        </div>
        <div className='text-right'>
          <span className='block text-[11px] font-semibold tracking-wide text-gray-500 uppercase'>Maximum</span>
          <strong className='mt-0.5 block text-sm text-gray-950 tabular-nums'>
            {compactMoneyMinor(selectedMaximum)}
          </strong>
        </div>
      </div>

      <div className='relative mt-3 h-2 rounded-full bg-gray-200' aria-hidden='true'>
        <span
          className='bg-brand-600 absolute h-2 rounded-full'
          style={{ left: `${minimumPercent}%`, right: `${100 - maximumPercent}%` }}
        />
      </div>

      <div className='mt-2 grid gap-1.5'>
        <input
          type='range'
          min={minimum}
          max={maximum}
          step={step}
          value={selectedMinimum}
          onChange={event => onChange('valueMinMinor', Math.min(Number(event.target.value), selectedMaximum))}
          aria-label='Minimum contract value'
          className='accent-brand-600 w-full'
        />
        <input
          type='range'
          min={minimum}
          max={maximum}
          step={step}
          value={selectedMaximum}
          onChange={event => onChange('valueMaxMinor', Math.max(Number(event.target.value), selectedMinimum))}
          aria-label='Maximum contract value'
          className='accent-brand-600 w-full'
        />
      </div>

      <div className='mt-2 grid grid-cols-5 gap-1' aria-label='Contract value shortcuts'>
        {stops.map((value, index) => (
          <button
            key={`${value}-${index}`}
            type='button'
            onClick={() => jumpTo(value)}
            className='focus:ring-brand-500/20 min-w-0 rounded-md px-0.5 py-1 text-[10px] font-medium text-gray-500 tabular-nums hover:bg-white hover:text-gray-950 focus:ring-4 focus:outline-hidden sm:text-xs'
            aria-label={`Set nearest contract value to ${compactMoneyMinor(value)}`}
          >
            {compactMoneyMinor(value)}
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  selectedLabel,
  optionCount,
  children
}: {
  title: string
  selectedLabel?: string
  optionCount?: number
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(Boolean(selectedLabel))

  useEffect(() => {
    if (selectedLabel) setIsOpen(true)
  }, [selectedLabel])

  return (
    <section className='border-b border-gray-200 last:border-b-0'>
      <button
        type='button'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(current => !current)}
        className='focus:ring-brand-500/20 flex w-full items-center justify-between gap-3 rounded-lg py-3 text-left focus:ring-4 focus:outline-hidden'
      >
        <span className='min-w-0'>
          <span className='block text-sm font-semibold text-gray-950'>{title}</span>
          <span className='mt-0.5 block truncate text-xs text-gray-500'>
            {selectedLabel || (optionCount === undefined ? 'Expand options' : `${optionCount} options`)}
          </span>
        </span>
        <SiteIcon
          name='chevron'
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className='max-h-64 space-y-2 overflow-y-auto pr-1 pb-3'>{children}</div>}
    </section>
  )
}

function FilterCheckboxList({
  name,
  value,
  options,
  onToggle,
  counts
}: {
  name: string
  value: string[]
  options: string[]
  onToggle: (value: string) => void
  counts?: Array<{ value: string | boolean; count: number }>
}) {
  return (
    <div className='space-y-1'>
      {options.map(option => {
        const checked = value.includes(option)

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
              checked ? 'bg-brand-50 text-brand-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
            }`}
          >
            <input
              type='checkbox'
              name={name}
              checked={checked}
              onChange={() => onToggle(option)}
              className='text-brand-600 focus:ring-brand-500/20 h-4 w-4 border-gray-300'
            />
            <span className='line-clamp-2 flex-1'>{option.replaceAll('_', ' ')}</span>
            {counts && (
              <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 tabular-nums'>
                {counts.find(item => item.value === option)?.count ?? 0}
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}

function TaxonomyFilterTree({
  nodes,
  selected,
  counts,
  onToggle
}: {
  nodes: TenderTaxonomyNode[]
  selected: string[]
  counts?: Array<{ value: string | boolean; count: number }>
  onToggle: (slug: string) => void
}) {
  const children = new Map<string | null, TenderTaxonomyNode[]>()
  nodes.forEach(node => {
    const siblings = children.get(node.parentSlug) ?? []
    siblings.push(node)
    children.set(node.parentSlug, siblings)
  })
  children.forEach(items => items.sort((left, right) => left.label.localeCompare(right.label)))

  const renderNodes = (parentSlug: string | null, depth = 0): ReactNode =>
    (children.get(parentSlug) ?? []).map(node => {
      const childNodes = children.get(node.slug) ?? []
      const count = counts?.find(item => item.value === node.slug)?.count
      const label = node.level === 'cpv_code' && node.cpvCode ? `${node.cpvCode} · ${node.label}` : node.label

      return (
        <div key={node.slug} className={depth ? 'ml-4 border-l border-gray-200 pl-2' : undefined}>
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
              selected.includes(node.slug)
                ? 'bg-brand-50 text-brand-800'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
            }`}
          >
            <input
              type='checkbox'
              checked={selected.includes(node.slug)}
              onChange={() => onToggle(node.slug)}
              className='text-brand-600 focus:ring-brand-500/20 h-4 w-4 border-gray-300'
            />
            <span className='line-clamp-2 flex-1'>{label}</span>
            {typeof count === 'number' && (
              <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 tabular-nums'>{count}</span>
            )}
          </label>
          {childNodes.length > 0 && <div>{renderNodes(node.slug, depth + 1)}</div>}
        </div>
      )
    })

  return <div className='space-y-1'>{renderNodes(null)}</div>
}

function FilterPanel({
  region,
  subcategory,
  taxonomy,
  keywords,
  stage,
  procedureType,
  procurementType,
  regions,
  subcategories,
  taxonomyNodes,
  keywordOptions,
  stages,
  procedureTypes,
  procurementTypes,
  publishedFrom,
  publishedTo,
  deadlineFrom,
  deadlineTo,
  framework,
  dynamicMarket,
  smeSuitable,
  valueMinMinor,
  valueMaxMinor,
  valueBounds,
  resultCount,
  facets,
  activeFilterCount,
  onRegionToggle,
  onSubcategoryToggle,
  onTaxonomyToggle,
  onKeywordToggle,
  onStageToggle,
  onProcedureTypeToggle,
  onProcurementTypeToggle,
  onDateChange,
  onBooleanChange,
  onValueChange,
  onClear
}: FilterPanelProps) {
  const minimum = valueBounds?.minMinor ?? 0
  const maximum = Math.max(valueBounds?.maxMinor ?? minimum, minimum)
  const rangeStep = Math.max(10_000, Math.round((maximum - minimum) / 100) || 10_000)

  return (
    <div className='rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center justify-between gap-3 border-b border-gray-200 p-4'>
        <div>
          <h2 className='font-semibold text-gray-950'>Filters</h2>
          <p className='text-xs text-gray-500'>
            {activeFilterCount} active
            {resultCount !== undefined ? ` · ${resultCount.toLocaleString('en-GB')} results` : ''}
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            type='button'
            onClick={onClear}
            className='text-brand-700 hover:bg-brand-50 focus:ring-brand-500/20 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-4 focus:outline-hidden'
          >
            Clear all
          </button>
        )}
      </div>
      <div className='px-4'>
        <FilterGroup
          title='Care service hierarchy'
          selectedLabel={taxonomy.length ? `${taxonomy.length} selected` : undefined}
          optionCount={taxonomyNodes.length || subcategories.length}
        >
          {taxonomyNodes.length > 0 ? (
            <TaxonomyFilterTree
              nodes={taxonomyNodes}
              selected={taxonomy}
              counts={facets?.taxonomy}
              onToggle={onTaxonomyToggle}
            />
          ) : subcategories.length > 0 ? (
            <FilterCheckboxList
              name='service-type'
              value={subcategory}
              options={subcategories}
              onToggle={onSubcategoryToggle}
              counts={facets?.subcategories}
            />
          ) : (
            <p className='text-sm text-gray-500'>Service subcategories are not available from the API yet.</p>
          )}
        </FilterGroup>
        <FilterGroup
          title='Region or location'
          selectedLabel={region.length ? `${region.length} selected` : undefined}
          optionCount={regions.length}
        >
          <FilterCheckboxList
            name='region'
            value={region}
            options={regions}
            onToggle={onRegionToggle}
            counts={facets?.regions}
          />
        </FilterGroup>
        <FilterGroup
          title='Keywords'
          selectedLabel={keywords.length ? `${keywords.length} selected` : undefined}
          optionCount={keywordOptions.length}
        >
          <FilterCheckboxList
            name='keywords'
            value={keywords}
            options={keywordOptions}
            onToggle={onKeywordToggle}
            counts={facets?.keywords}
          />
        </FilterGroup>
        <FilterGroup title='Advanced filters' selectedLabel={activeFilterCount ? 'Review active filters' : undefined}>
          <div className='space-y-4 pb-4'>
            <div className='grid grid-cols-2 gap-2'>
              <label className='text-xs font-medium text-gray-700'>
                Published from
                <input
                  type='date'
                  value={publishedFrom}
                  onChange={event => onDateChange('publishedFrom', event.target.value)}
                  className='mt-1 h-10 w-full rounded-lg border border-gray-300 px-2 text-xs'
                />
              </label>
              <label className='text-xs font-medium text-gray-700'>
                Published to
                <input
                  type='date'
                  value={publishedTo}
                  onChange={event => onDateChange('publishedTo', event.target.value)}
                  className='mt-1 h-10 w-full rounded-lg border border-gray-300 px-2 text-xs'
                />
              </label>
              <label className='text-xs font-medium text-gray-700'>
                Closing from
                <input
                  type='date'
                  value={deadlineFrom}
                  onChange={event => onDateChange('deadlineFrom', event.target.value)}
                  className='mt-1 h-10 w-full rounded-lg border border-gray-300 px-2 text-xs'
                />
              </label>
              <label className='text-xs font-medium text-gray-700'>
                Closing to
                <input
                  type='date'
                  value={deadlineTo}
                  onChange={event => onDateChange('deadlineTo', event.target.value)}
                  className='mt-1 h-10 w-full rounded-lg border border-gray-300 px-2 text-xs'
                />
              </label>
            </div>

            {maximum > minimum && (
              <div>
                <p className='mb-2 text-xs font-semibold text-gray-700'>Contract value</p>
                <TenderValueRange
                  minimum={minimum}
                  maximum={maximum}
                  selectedMinimum={valueMinMinor ?? minimum}
                  selectedMaximum={valueMaxMinor ?? maximum}
                  step={rangeStep}
                  onChange={onValueChange}
                />
              </div>
            )}

            <FilterCheckboxList
              name='stage'
              value={stage}
              options={stages}
              onToggle={onStageToggle}
              counts={facets?.stages}
            />
            <FilterCheckboxList
              name='procedure-type'
              value={procedureType}
              options={procedureTypes}
              onToggle={onProcedureTypeToggle}
              counts={facets?.procedureTypes}
            />
            <FilterCheckboxList
              name='procurement-type'
              value={procurementType}
              options={procurementTypes}
              onToggle={onProcurementTypeToggle}
              counts={facets?.procurementTypes}
            />
            <div className='space-y-2'>
              {(
                [
                  ['framework', 'Framework', framework],
                  ['dynamicMarket', 'Dynamic market / DPS', dynamicMarket],
                  ['smeSuitable', 'SME suitable', smeSuitable]
                ] as const
              ).map(([field, label, checked]) => (
                <label key={field} className='flex cursor-pointer items-center gap-2 text-sm text-gray-700'>
                  <input
                    type='checkbox'
                    checked={checked}
                    onChange={event => onBooleanChange(field, event.target.checked)}
                    className='text-brand-600 h-4 w-4 border-gray-300'
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </FilterGroup>
      </div>
    </div>
  )
}

export function TenderBoardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openModal } = useHalfScreenModal()
  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') ?? '')
  const [category, setCategory] = useState(() => searchParams.getAll('category'))
  const [region, setRegion] = useState(() => searchParams.getAll('region'))
  const [subcategory, setSubcategory] = useState(() => searchParams.getAll('subcategory'))
  const [taxonomy, setTaxonomy] = useState(() => searchParams.getAll('taxonomy'))
  const [keywords, setKeywords] = useState(() => searchParams.getAll('keywords'))
  const [stage, setStage] = useState(() => searchParams.getAll('stage'))
  const [procedureType, setProcedureType] = useState(() => searchParams.getAll('procedureType'))
  const [procurementType, setProcurementType] = useState(() => searchParams.getAll('procurementType'))
  const [publishedFrom, setPublishedFrom] = useState(() => searchParams.get('publishedFrom') ?? '')
  const [publishedTo, setPublishedTo] = useState(() => searchParams.get('publishedTo') ?? '')
  const [deadlineFrom, setDeadlineFrom] = useState(() => searchParams.get('deadlineFrom') ?? '')
  const [deadlineTo, setDeadlineTo] = useState(() => searchParams.get('deadlineTo') ?? '')
  const [framework, setFramework] = useState(() => searchParams.get('framework') === 'true')
  const [dynamicMarket, setDynamicMarket] = useState(() => searchParams.get('dynamicMarket') === 'true')
  const [smeSuitable, setSmeSuitable] = useState(() => searchParams.get('smeSuitable') === 'true')
  const [valueMinMinor, setValueMinMinor] = useState<number | undefined>(() =>
    optionalNumber(searchParams.get('valueMinMinor'))
  )
  const [valueMaxMinor, setValueMaxMinor] = useState<number | undefined>(() =>
    optionalNumber(searchParams.get('valueMaxMinor'))
  )
  const [sort, setSort] = useState<'deadline' | 'newest'>(() =>
    searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  )
  const [filters, setFilters] = useState<AppliedTenderFilters>(() => ({
    keyword: searchParams.get('keyword')?.trim() ?? '',
    category: searchParams.getAll('category'),
    region: searchParams.getAll('region'),
    subcategory: searchParams.getAll('subcategory'),
    taxonomy: searchParams.getAll('taxonomy'),
    keywords: searchParams.getAll('keywords'),
    stage: searchParams.getAll('stage'),
    procedureType: searchParams.getAll('procedureType'),
    procurementType: searchParams.getAll('procurementType'),
    publishedFrom: searchParams.get('publishedFrom') || undefined,
    publishedTo: searchParams.get('publishedTo') || undefined,
    deadlineFrom: searchParams.get('deadlineFrom') || undefined,
    deadlineTo: searchParams.get('deadlineTo') || undefined,
    framework: searchParams.get('framework') === 'true' || undefined,
    dynamicMarket: searchParams.get('dynamicMarket') === 'true' || undefined,
    smeSuitable: searchParams.get('smeSuitable') === 'true' || undefined,
    valueMinMinor: optionalNumber(searchParams.get('valueMinMinor')),
    valueMaxMinor: optionalNumber(searchParams.get('valueMaxMinor')),
    sort: searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  }))
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page') ?? 1) || 1))
  const [viewMode, setViewMode] = useState<TenderBoardViewMode>(() =>
    searchParams.get('view') === 'grid' ? 'grid' : 'list'
  )
  const [activeTenderId, setActiveTenderId] = useState(() => searchParams.get('tender') ?? '')
  const initialTenderOpenedRef = useRef(false)
  const valueFilterTimerRef = useRef<number | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [pagination, setPagination] = useState<TenderPagination | null>(null)
  const [filterOptions, setFilterOptions] = useState<TenderFilters>({ categories: [], regions: [] })
  const [contextualFilters, setContextualFilters] = useState<TenderFilters>({ categories: [], regions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set())

  const regions = useMemo(() => [...filterOptions.regions].sort(), [filterOptions.regions])
  const subcategories = useMemo(() => [...(filterOptions.subcategories ?? [])].sort(), [filterOptions.subcategories])
  const taxonomyNodes = useMemo(() => filterOptions.taxonomy ?? [], [filterOptions.taxonomy])
  const keywordOptions = useMemo(() => [...(filterOptions.keywords ?? [])].sort(), [filterOptions.keywords])
  const stages = useMemo(() => [...(filterOptions.stages ?? [])].sort(), [filterOptions.stages])
  const procedureTypes = useMemo(() => [...(filterOptions.procedureTypes ?? [])].sort(), [filterOptions.procedureTypes])
  const procurementTypes = useMemo(
    () => [...(filterOptions.procurementTypes ?? [])].sort(),
    [filterOptions.procurementTypes]
  )
  const activeFilterCount =
    Number(Boolean(filters.keyword)) +
    filters.category.length +
    filters.region.length +
    filters.subcategory.length +
    filters.taxonomy.length +
    filters.keywords.length +
    filters.stage.length +
    filters.procedureType.length +
    filters.procurementType.length +
    Number(Boolean(filters.publishedFrom)) +
    Number(Boolean(filters.publishedTo)) +
    Number(Boolean(filters.deadlineFrom)) +
    Number(Boolean(filters.deadlineTo)) +
    Number(Boolean(filters.framework)) +
    Number(Boolean(filters.dynamicMarket)) +
    Number(Boolean(filters.smeSuitable)) +
    Number(filters.valueMinMinor !== undefined || filters.valueMaxMinor !== undefined)

  const activeFilterLabels = [
    filters.keyword ? { key: 'keyword', label: `Search: ${filters.keyword}` } : null,
    ...filters.subcategory.map(label => ({ key: 'subcategory' as const, label })),
    ...filters.category.map(label => ({ key: 'category' as const, label })),
    ...filters.taxonomy.map(slug => ({
      key: 'taxonomy' as const,
      label: taxonomyNodes.find(node => node.slug === slug)?.label ?? slug
    })),
    ...filters.region.map(label => ({ key: 'region' as const, label }))
  ].filter(
    (item): item is { key: 'keyword' | 'category' | 'region' | 'subcategory' | 'taxonomy'; label: string } =>
      item !== null
  )

  const tenderBoardTemplate = useMemo(
    () => ({
      id: 'tender-board',
      component: TenderBoardHalfScreenContent
    }),
    []
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getPublicTenders({
        ...filters,
        page,
        perPage: TENDERS_PER_PAGE,
        sort: filters.sort
      })
      setTenders(dedupeTenders(response.data))
      setPagination((response.meta as { pagination?: TenderPagination } | undefined)?.pagination ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender list could not be loaded.')
      setTenders([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    preloadRecaptcha()
  }, [])

  useEffect(() => {
    void getPublicTenderFilters()
      .then(response => {
        setFilterOptions(response.data)
        setContextualFilters(response.data)
      })
      .catch(() => {
        setFilterOptions({ categories: [], regions: [] })
        setContextualFilters({ categories: [], regions: [] })
      })
  }, [])

  useEffect(() => {
    if (activeFilterCount === 0) {
      setContextualFilters(filterOptions)
      return
    }

    const timer = window.setTimeout(() => {
      void getPublicTenderFilters(filters)
        .then(response => setContextualFilters(response.data))
        .catch(() => undefined)
    }, 400)

    return () => window.clearTimeout(timer)
  }, [activeFilterCount, filterOptions, filters])

  useEffect(
    () => () => {
      if (valueFilterTimerRef.current !== null) window.clearTimeout(valueFilterTimerRef.current)
    },
    []
  )

  useEffect(() => {
    try {
      setSavedTenderIds(new Set(JSON.parse(localStorage.getItem('care-atlas:saved-tenders') ?? '[]') as string[]))
    } catch {
      setSavedTenderIds(new Set())
    }
  }, [])

  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.keyword) next.set('keyword', filters.keyword)
    filters.category.forEach(value => next.append('category', value))
    filters.region.forEach(value => next.append('region', value))
    filters.subcategory.forEach(value => next.append('subcategory', value))
    filters.taxonomy.forEach(value => next.append('taxonomy', value))
    filters.keywords.forEach(value => next.append('keywords', value))
    filters.stage.forEach(value => next.append('stage', value))
    filters.procedureType.forEach(value => next.append('procedureType', value))
    filters.procurementType.forEach(value => next.append('procurementType', value))
    if (filters.publishedFrom) next.set('publishedFrom', filters.publishedFrom)
    if (filters.publishedTo) next.set('publishedTo', filters.publishedTo)
    if (filters.deadlineFrom) next.set('deadlineFrom', filters.deadlineFrom)
    if (filters.deadlineTo) next.set('deadlineTo', filters.deadlineTo)
    if (filters.framework) next.set('framework', 'true')
    if (filters.dynamicMarket) next.set('dynamicMarket', 'true')
    if (filters.smeSuitable) next.set('smeSuitable', 'true')
    if (filters.valueMinMinor !== undefined) next.set('valueMinMinor', String(filters.valueMinMinor))
    if (filters.valueMaxMinor !== undefined) next.set('valueMaxMinor', String(filters.valueMaxMinor))
    if (filters.sort !== DEFAULT_SORT) next.set('sort', filters.sort)
    if (page > 1) next.set('page', String(page))
    if (viewMode !== 'list') next.set('view', viewMode)
    if (activeTenderId) next.set('tender', activeTenderId)

    const query = next.toString()
    router.replace(query ? `/tenders?${query}` : '/tenders', { scroll: false })
  }, [activeTenderId, filters, page, router, viewMode])

  const openTenderWorkspace = useCallback(
    (tender: PublicTender, initialLeadKind?: TenderLeadKind) => {
      const modalData: TenderBoardPanelData = {
        tender,
        initialLeadKind
      }

      setActiveTenderId(tender.id)
      openModal(modalData, tenderBoardTemplate, {
        width: 'min(100vw, 760px)',
        headerConfig: {
          title: tender.title,
          subtitle: tender.buyer ?? 'Buyer not stated'
        }
      })
    },
    [openModal, tenderBoardTemplate]
  )

  useEffect(() => {
    if (!activeTenderId || initialTenderOpenedRef.current) return
    if (loading) return

    initialTenderOpenedRef.current = true
    const listedTender = tenders.find(tender => tender.id === activeTenderId)
    if (listedTender) {
      openTenderWorkspace(listedTender)
      return
    }

    void getPublicTender(activeTenderId)
      .then(response => openTenderWorkspace(response.data))
      .catch(() => setError('The tender link could not be opened. It may no longer be available.'))
  }, [activeTenderId, loading, openTenderWorkspace, tenders])

  function applyCurrentFilters(next?: Partial<AppliedTenderFilters>) {
    setPage(1)
    setFilters({
      keyword: keyword.trim(),
      category,
      region,
      subcategory,
      taxonomy,
      keywords,
      stage,
      procedureType,
      procurementType,
      publishedFrom: publishedFrom || undefined,
      publishedTo: publishedTo || undefined,
      deadlineFrom: deadlineFrom || undefined,
      deadlineTo: deadlineTo || undefined,
      framework: framework || undefined,
      dynamicMarket: dynamicMarket || undefined,
      smeSuitable: smeSuitable || undefined,
      valueMinMinor,
      valueMaxMinor,
      sort,
      ...next
    })
  }

  function clearFilters() {
    setKeyword('')
    setCategory([])
    setRegion([])
    setSubcategory([])
    setTaxonomy([])
    setKeywords([])
    setStage([])
    setProcedureType([])
    setProcurementType([])
    setPublishedFrom('')
    setPublishedTo('')
    setDeadlineFrom('')
    setDeadlineTo('')
    setFramework(false)
    setDynamicMarket(false)
    setSmeSuitable(false)
    setValueMinMinor(undefined)
    setValueMaxMinor(undefined)
    setSort(DEFAULT_SORT)
    setPage(1)
    setFilters({
      keyword: '',
      category: [],
      region: [],
      subcategory: [],
      taxonomy: [],
      keywords: [],
      stage: [],
      procedureType: [],
      procurementType: [],
      sort: DEFAULT_SORT
    })
  }

  function removeFilter(key: 'keyword' | 'category' | 'region' | 'subcategory' | 'taxonomy', label?: string) {
    if (key === 'keyword') setKeyword('')
    if (key === 'category') setCategory(current => current.filter(value => value !== label))
    if (key === 'region') setRegion(current => current.filter(value => value !== label))
    if (key === 'subcategory') setSubcategory(current => current.filter(value => value !== label))
    if (key === 'taxonomy') {
      const slug = taxonomyNodes.find(node => node.label === label)?.slug ?? label
      setTaxonomy(current => current.filter(value => value !== slug))
      setPage(1)
      setFilters(current => ({ ...current, taxonomy: current.taxonomy.filter(value => value !== slug) }))
      return
    }

    setPage(1)
    setFilters(current => ({
      ...current,
      [key]: key === 'keyword' ? '' : current[key].filter(value => value !== label)
    }))
  }

  function toggleFilter(key: 'category' | 'region' | 'subcategory', value: string, apply = true) {
    const setter = key === 'category' ? setCategory : key === 'region' ? setRegion : setSubcategory
    setter(current => {
      const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value]
      if (apply) {
        setPage(1)
        setFilters(filtersCurrent => ({ ...filtersCurrent, [key]: next }))
      }
      return next
    })
  }

  function toggleTaxonomy(value: string, apply = true) {
    setTaxonomy(current => {
      const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value]
      if (apply) {
        setPage(1)
        setFilters(filtersCurrent => ({ ...filtersCurrent, taxonomy: next }))
      }
      return next
    })
  }

  function toggleAdvancedList(
    key: 'keywords' | 'stage' | 'procedureType' | 'procurementType',
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
    apply = true
  ) {
    setter(current => {
      const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value]
      if (apply) {
        setPage(1)
        setFilters(filtersCurrent => ({ ...filtersCurrent, [key]: next }))
      }
      return next
    })
  }

  function changeDate(field: 'publishedFrom' | 'publishedTo' | 'deadlineFrom' | 'deadlineTo', value: string) {
    const setters = {
      publishedFrom: setPublishedFrom,
      publishedTo: setPublishedTo,
      deadlineFrom: setDeadlineFrom,
      deadlineTo: setDeadlineTo
    }
    setters[field](value)
    setPage(1)
    setFilters(current => ({ ...current, [field]: value || undefined }))
  }

  function changeBoolean(field: 'framework' | 'dynamicMarket' | 'smeSuitable', value: boolean) {
    const setters = { framework: setFramework, dynamicMarket: setDynamicMarket, smeSuitable: setSmeSuitable }
    setters[field](value)
    setPage(1)
    setFilters(current => ({ ...current, [field]: value || undefined }))
  }

  function changeValue(field: 'valueMinMinor' | 'valueMaxMinor', value: number) {
    if (field === 'valueMinMinor') setValueMinMinor(value)
    else setValueMaxMinor(value)

    if (valueFilterTimerRef.current !== null) window.clearTimeout(valueFilterTimerRef.current)
    valueFilterTimerRef.current = window.setTimeout(() => {
      setPage(1)
      setFilters(current => ({ ...current, [field]: value }))
      valueFilterTimerRef.current = null
    }, 350)
  }

  function toggleSaved(tender: PublicTender) {
    setSavedTenderIds(current => {
      const next = new Set(current)
      if (next.has(tender.id)) next.delete(tender.id)
      else {
        next.add(tender.id)
        setSaveNotice('Saved on this device. Sign in to OrbitMirai when you need a permanent shortlist across devices.')
      }
      localStorage.setItem('care-atlas:saved-tenders', JSON.stringify([...next]))
      return next
    })
  }

  const paginationLabel = pagination
    ? `${pagination.total.toLocaleString('en-GB')} opportunities · Page ${pagination.currentPage} of ${pagination.lastPage}`
    : tenders.length
      ? `${tenders.length.toLocaleString('en-GB')} opportunities`
      : 'Tender opportunities'

  const paginationControls = (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        disabled={!pagination || pagination.currentPage <= 1 || loading}
        onClick={() => setPage(current => Math.max(1, current - 1))}
        aria-label='Previous tender page'
        title='Previous tender page'
        className='border-brand-200 text-brand-700 hover:bg-brand-50 focus:ring-brand-500/20 flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-45'
      >
        <SiteIcon name='arrow' className='h-4 w-4 rotate-180' />
      </button>
      <button
        type='button'
        disabled={!pagination || pagination.currentPage >= pagination.lastPage || loading}
        onClick={() => setPage(current => current + 1)}
        aria-label='Next tender page'
        title='Next tender page'
        className='border-brand-200 text-brand-700 hover:bg-brand-50 focus:ring-brand-500/20 flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition disabled:cursor-not-allowed disabled:opacity-45'
      >
        <SiteIcon name='arrow' className='h-4 w-4' />
      </button>
    </div>
  )

  return (
    <div className='min-w-0 space-y-4 overflow-x-hidden'>
      {error && !loading && <p className='bg-error-50 text-error-700 rounded-lg p-3 text-sm font-medium'>{error}</p>}
      {saveNotice && (
        <p role='status' className='border-brand-200 bg-brand-50 text-brand-900 rounded-lg border p-3 text-sm'>
          {saveNotice}{' '}
          <a
            href={process.env.NEXT_PUBLIC_ORBIT_MIRAI_SIGNUP_URL ?? 'https://app.orbitmirai.com/sign-up'}
            className='font-semibold underline'
          >
            Create or open your account
          </a>
          .
        </p>
      )}

      <section className='min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white'>
        <TenderBoardFilters
          keyword={keyword}
          regionsSelected={region}
          subcategoriesSelected={subcategory}
          sort={sort}
          viewMode={viewMode}
          regions={regions}
          subcategories={subcategories}
          activeFilterCount={activeFilterCount}
          loading={loading}
          onKeywordChange={setKeyword}
          onRegionToggle={value => toggleFilter('region', value)}
          onSubcategoryToggle={value => toggleFilter('subcategory', value)}
          onSortChange={value => {
            setSort(value)
            applyCurrentFilters({ sort: value })
          }}
          onViewModeChange={setViewMode}
          onClear={clearFilters}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          onSubmit={() => applyCurrentFilters()}
        />

        <div className='flex flex-col gap-3 border-b border-gray-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <p className='text-sm font-semibold text-gray-950'>{paginationLabel}</p>
            {activeFilterLabels.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {activeFilterLabels.map(filter => (
                  <button
                    key={`${filter.key}-${filter.label}`}
                    type='button'
                    onClick={() => removeFilter(filter.key, filter.label)}
                    className='bg-brand-50 text-brand-800 hover:bg-brand-100 focus:ring-brand-500/20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold focus:ring-4 focus:outline-hidden'
                  >
                    {filter.label}
                    <SiteIcon name='close' className='h-3 w-3' />
                  </button>
                ))}
              </div>
            )}
          </div>
          {paginationControls}
        </div>

        <div className='grid lg:grid-cols-[300px_minmax(0,1fr)]'>
          <aside className='hidden border-r border-gray-200 bg-gray-50 p-4 lg:block'>
            <FilterPanel
              region={region}
              subcategory={subcategory}
              taxonomy={taxonomy}
              keywords={keywords}
              stage={stage}
              procedureType={procedureType}
              procurementType={procurementType}
              regions={regions}
              subcategories={subcategories}
              taxonomyNodes={taxonomyNodes}
              keywordOptions={keywordOptions}
              stages={stages}
              procedureTypes={procedureTypes}
              procurementTypes={procurementTypes}
              publishedFrom={publishedFrom}
              publishedTo={publishedTo}
              deadlineFrom={deadlineFrom}
              deadlineTo={deadlineTo}
              framework={framework}
              dynamicMarket={dynamicMarket}
              smeSuitable={smeSuitable}
              valueMinMinor={valueMinMinor}
              valueMaxMinor={valueMaxMinor}
              valueBounds={filterOptions.ranges?.value}
              resultCount={contextualFilters.total}
              facets={contextualFilters.facets}
              activeFilterCount={activeFilterCount}
              onRegionToggle={value => toggleFilter('region', value)}
              onSubcategoryToggle={value => toggleFilter('subcategory', value)}
              onTaxonomyToggle={value => toggleTaxonomy(value)}
              onKeywordToggle={value => toggleAdvancedList('keywords', value, setKeywords)}
              onStageToggle={value => toggleAdvancedList('stage', value, setStage)}
              onProcedureTypeToggle={value => toggleAdvancedList('procedureType', value, setProcedureType)}
              onProcurementTypeToggle={value => toggleAdvancedList('procurementType', value, setProcurementType)}
              onDateChange={changeDate}
              onBooleanChange={changeBoolean}
              onValueChange={changeValue}
              onClear={clearFilters}
            />
          </aside>
          <TenderBoardList
            loading={loading}
            tenders={tenders}
            viewMode={viewMode}
            onOpenDetails={tender => openTenderWorkspace(tender)}
            onOpenForm={openTenderWorkspace}
            savedTenderIds={savedTenderIds}
            onToggleSaved={toggleSaved}
          />
        </div>

        <footer className='flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-gray-600'>{paginationLabel}</p>
          {paginationControls}
        </footer>
      </section>

      {mobileFiltersOpen && (
        <div className='fixed inset-0 z-9999 lg:hidden'>
          <button
            type='button'
            aria-label='Close tender filters'
            className='absolute inset-0 bg-gray-950/40'
            onClick={() => setMobileFiltersOpen(false)}
          />
          <aside
            role='dialog'
            aria-modal='true'
            aria-labelledby='mobile-tender-filters-title'
            className='absolute top-0 right-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl'
          >
            <div className='flex items-center justify-between border-b border-gray-200 p-4'>
              <h2 id='mobile-tender-filters-title' className='font-semibold text-gray-950'>
                Tender filters
              </h2>
              <button
                type='button'
                onClick={() => setMobileFiltersOpen(false)}
                aria-label='Close filters'
                className='focus:ring-brand-500/20 flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
              >
                <SiteIcon name='close' className='h-5 w-5' />
              </button>
            </div>
            <div className='flex-1 overflow-y-auto p-4'>
              <FilterPanel
                region={region}
                subcategory={subcategory}
                taxonomy={taxonomy}
                keywords={keywords}
                stage={stage}
                procedureType={procedureType}
                procurementType={procurementType}
                regions={regions}
                subcategories={subcategories}
                taxonomyNodes={taxonomyNodes}
                keywordOptions={keywordOptions}
                stages={stages}
                procedureTypes={procedureTypes}
                procurementTypes={procurementTypes}
                publishedFrom={publishedFrom}
                publishedTo={publishedTo}
                deadlineFrom={deadlineFrom}
                deadlineTo={deadlineTo}
                framework={framework}
                dynamicMarket={dynamicMarket}
                smeSuitable={smeSuitable}
                valueMinMinor={valueMinMinor}
                valueMaxMinor={valueMaxMinor}
                valueBounds={filterOptions.ranges?.value}
                resultCount={contextualFilters.total}
                facets={contextualFilters.facets}
                activeFilterCount={activeFilterCount}
                onRegionToggle={value => toggleFilter('region', value, false)}
                onSubcategoryToggle={value => toggleFilter('subcategory', value, false)}
                onTaxonomyToggle={value => toggleTaxonomy(value, false)}
                onKeywordToggle={value => toggleAdvancedList('keywords', value, setKeywords, false)}
                onStageToggle={value => toggleAdvancedList('stage', value, setStage, false)}
                onProcedureTypeToggle={value => toggleAdvancedList('procedureType', value, setProcedureType, false)}
                onProcurementTypeToggle={value =>
                  toggleAdvancedList('procurementType', value, setProcurementType, false)
                }
                onDateChange={changeDate}
                onBooleanChange={changeBoolean}
                onValueChange={changeValue}
                onClear={clearFilters}
              />
            </div>
            <div className='border-t border-gray-200 p-4'>
              <Button
                fullWidth
                onClick={() => {
                  applyCurrentFilters()
                  setMobileFiltersOpen(false)
                }}
              >
                Apply filters
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
