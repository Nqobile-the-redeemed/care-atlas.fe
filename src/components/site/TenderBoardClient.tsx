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
  type TenderKeywordGroup,
  type TenderLeadKind,
  type TenderPagination,
  type TenderTaxonomyNode
} from '@/lib/api/tenders'
import { preloadRecaptcha } from '@/lib/recaptcha'
import { useHalfScreenModal } from '@/context/HalfScreenModalContext'
import { trackEvent } from '@/components/analytics/trackEvent'

import { SiteIcon } from './SiteIcon'
import { Button, ButtonLink } from './ui'
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
const SAVE_SIGNUP_PROMPTED_KEY = 'care-atlas:save-signup-prompted'
const TENDER_AUDIENCES = [
  { value: 'adults', label: 'Adults' },
  { value: 'children', label: 'Children and families' }
] as const

type AppliedTenderFilters = Pick<TenderBoardFiltersState, 'keyword'> & {
  audience: string[]
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
  includeValueUnspecified: boolean
  sort: 'deadline' | 'newest'
}

type FilterPanelProps = {
  audience: string[]
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
  keywordGroups: TenderKeywordGroup[]
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
  valueBounds?: {
    minMinor: number | null
    maxMinor: number | null
    suggestedMaxMinor?: number | null
    stepsMinor?: number[]
    currency: string
    knownCount?: number
    unspecifiedCount?: number
  }
  includeValueUnspecified: boolean
  resultCount?: number
  facets?: TenderFilters['facets']
  activeFilterCount: number
  onAudienceToggle: (value: string) => void
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
  onIncludeValueUnspecifiedChange: (value: boolean) => void
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

function savedTenderSignupHref(tenderId: string) {
  const configured = process.env.NEXT_PUBLIC_ORBIT_MIRAI_SIGNUP_URL ?? 'https://app.orbitmirai.com/sign-up'
  const target = new URL(configured, window.location.origin)
  target.searchParams.set('package', 'tender_basics')
  target.searchParams.set('source', 'care_atlas')
  target.searchParams.set('returnTo', '/saved-tenders')
  target.searchParams.set('tender', tenderId)
  return target.toString()
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
  const floor = Math.min(0, minimum)
  if (maximum <= floor) return [floor]

  const cappedMaximum = Math.min(maximum, 5_000_000_000)
  const candidates = [0, 10_000_000, 50_000_000, 100_000_000, 500_000_000, cappedMaximum]

  return Array.from(new Set(candidates.filter(value => value >= floor && value <= cappedMaximum))).sort(
    (left, right) => left - right
  )
}

function normalizedValueStops(valueBounds?: FilterPanelProps['valueBounds']) {
  const maximum = Math.max(valueBounds?.suggestedMaxMinor ?? valueBounds?.maxMinor ?? 0, 0)
  const suppliedStops = valueBounds?.stepsMinor ?? []
  const candidates = suppliedStops.length > 0 ? [0, ...suppliedStops, maximum] : valueStops(0, maximum)

  return Array.from(new Set(candidates.filter(value => Number.isFinite(value) && value >= 0 && value <= maximum))).sort(
    (left, right) => left - right
  )
}

function TenderValueRange({
  stops,
  selectedMinimum,
  selectedMaximum,
  resultCount,
  onChange
}: {
  stops: number[]
  selectedMinimum: number
  selectedMaximum: number
  resultCount?: number
  onChange: (field: 'valueMinMinor' | 'valueMaxMinor', value: number) => void
}) {
  const lastIndex = Math.max(0, stops.length - 1)
  const nearestIndex = (value: number) =>
    stops.reduce(
      (nearest, stop, index) => (Math.abs(stop - value) < Math.abs(stops[nearest] - value) ? index : nearest),
      0
    )
  const minimumIndex = nearestIndex(selectedMinimum)
  const maximumIndex = nearestIndex(selectedMaximum)
  const minimumPercent = lastIndex === 0 ? 0 : (minimumIndex / lastIndex) * 100
  const maximumPercent = lastIndex === 0 ? 100 : (maximumIndex / lastIndex) * 100

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
            {maximumIndex === lastIndex ? 'Any value' : compactMoneyMinor(selectedMaximum)}
          </strong>
        </div>
      </div>

      {resultCount !== undefined && (
        <p className='mt-2 text-xs font-medium text-gray-600' aria-live='polite'>
          {resultCount.toLocaleString('en-GB')} matching {resultCount === 1 ? 'opportunity' : 'opportunities'}
        </p>
      )}

      <div className='relative mt-3 h-9 touch-none'>
        <div
          className='absolute top-2.5 right-2 left-2 h-1.5 cursor-pointer rounded-full bg-gray-200'
          aria-hidden='true'
          onPointerDown={event => {
            const bounds = event.currentTarget.getBoundingClientRect()
            const percent = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
            jumpTo(stops[Math.round(percent * lastIndex)])
          }}
        >
          <span
            className='bg-brand-600 absolute h-1.5 rounded-full'
            style={{ left: `${minimumPercent}%`, right: `${100 - maximumPercent}%` }}
          />
        </div>
        <input
          type='range'
          min={0}
          max={lastIndex}
          step={1}
          value={minimumIndex}
          onChange={event => {
            const index = Math.min(Number(event.target.value), maximumIndex)
            onChange('valueMinMinor', stops[index])
          }}
          aria-label='Minimum contract value'
          className={`pointer-events-none absolute inset-0 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[-11px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md ${minimumIndex >= maximumIndex - 1 ? 'z-30' : 'z-20'}`}
        />
        <input
          type='range'
          min={0}
          max={lastIndex}
          step={1}
          value={maximumIndex}
          onChange={event => {
            const index = Math.max(Number(event.target.value), minimumIndex)
            onChange('valueMaxMinor', stops[index])
          }}
          aria-label='Maximum contract value'
          className='pointer-events-none absolute inset-0 z-20 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:mt-[-11px] [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md'
        />
      </div>

      <div
        className='mt-1 grid gap-1'
        style={{ gridTemplateColumns: `repeat(${stops.length}, minmax(0, 1fr))` }}
        aria-label='Contract value shortcuts'
      >
        {stops.map((value, index) => (
          <button
            key={`${value}-${index}`}
            type='button'
            onClick={() => jumpTo(value)}
            className='focus:ring-brand-500/20 min-w-0 rounded-md px-0 py-1 text-[10px] font-medium text-gray-500 tabular-nums hover:bg-white hover:text-gray-950 focus:ring-4 focus:outline-hidden'
            aria-label={`Set nearest contract value to ${compactMoneyMinor(value)}`}
          >
            {compactMoneyMinor(value)}
            {index === lastIndex ? '+' : ''}
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
  contentClassName,
  defaultOpen = false,
  children
}: {
  title: string
  selectedLabel?: string
  optionCount?: number
  contentClassName?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen || Boolean(selectedLabel))

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
      {isOpen && (
        <div className={`space-y-2 pr-1 pb-3 ${contentClassName ?? 'max-h-64 overflow-y-auto'}`}>{children}</div>
      )}
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
            <span className='line-clamp-2 flex-1'>
              {TENDER_AUDIENCES.find(audienceOption => audienceOption.value === option)?.label ??
                option.replaceAll('_', ' ')}
            </span>
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

function KeywordGroupList({
  groups,
  selected,
  counts,
  onToggle
}: {
  groups: TenderKeywordGroup[]
  selected: string[]
  counts?: Array<{ value: string | boolean; count: number }>
  onToggle: (value: string) => void
}) {
  return (
    <div className='space-y-2'>
      {groups.map(group => {
        const selectedCount = group.options.filter(option => selected.includes(option)).length

        return (
          <details key={group.slug} className='rounded-lg border border-gray-200 bg-gray-50'>
            <summary className='flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-gray-800'>
              <span>{group.label}</span>
              <span className='text-xs font-normal text-gray-500'>
                {selectedCount ? `${selectedCount} selected` : `${group.options.length} options`}
              </span>
            </summary>
            <div className='border-t border-gray-200 bg-white p-1'>
              <FilterCheckboxList
                name={`keywords-${group.slug}`}
                value={selected}
                options={group.options}
                onToggle={onToggle}
                counts={counts}
              />
            </div>
          </details>
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
  audience,
  region,
  subcategory,
  taxonomy,
  keywords,
  regions,
  subcategories,
  taxonomyNodes,
  keywordOptions,
  keywordGroups,
  publishedFrom,
  publishedTo,
  deadlineFrom,
  deadlineTo,
  smeSuitable,
  valueMinMinor,
  valueMaxMinor,
  valueBounds,
  includeValueUnspecified,
  resultCount,
  facets,
  activeFilterCount,
  onAudienceToggle,
  onRegionToggle,
  onSubcategoryToggle,
  onTaxonomyToggle,
  onKeywordToggle,
  onDateChange,
  onBooleanChange,
  onValueChange,
  onIncludeValueUnspecifiedChange,
  onClear
}: FilterPanelProps) {
  const rangeStops = normalizedValueStops(valueBounds)
  const minimum = rangeStops[0] ?? 0
  const maximum = rangeStops.at(-1) ?? minimum
  const advancedFilterCount =
    taxonomy.length +
    subcategory.length +
    Number(Boolean(publishedFrom)) +
    Number(Boolean(publishedTo)) +
    Number(Boolean(deadlineFrom)) +
    Number(Boolean(deadlineTo)) +
    Number(smeSuitable) +
    Number(valueMinMinor !== undefined || valueMaxMinor !== undefined)

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
          title='Care categories'
          selectedLabel={keywords.length ? `${keywords.length} selected` : undefined}
          optionCount={keywordOptions.length}
          contentClassName='overflow-visible'
          defaultOpen
        >
          {keywordGroups.length > 0 ? (
            <KeywordGroupList
              groups={keywordGroups}
              selected={keywords}
              onToggle={onKeywordToggle}
              counts={facets?.keywords}
            />
          ) : (
            <FilterCheckboxList
              name='keywords'
              value={keywords}
              options={keywordOptions}
              onToggle={onKeywordToggle}
              counts={facets?.keywords}
            />
          )}
        </FilterGroup>
        <FilterGroup
          title='People supported'
          selectedLabel={
            audience.length === 2
              ? 'Adults and children'
              : TENDER_AUDIENCES.find(option => option.value === audience[0])?.label
          }
          optionCount={TENDER_AUDIENCES.length}
          contentClassName='overflow-visible'
        >
          <FilterCheckboxList
            name='audience'
            value={audience}
            options={TENDER_AUDIENCES.map(option => option.value)}
            onToggle={onAudienceToggle}
          />
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
          title='Advanced filters'
          selectedLabel={advancedFilterCount ? `${advancedFilterCount} active` : undefined}
          contentClassName='overflow-visible'
        >
          <div className='space-y-4 pb-4'>
            <div>
              <p className='mb-2 text-xs font-semibold tracking-[0.06em] text-gray-700 uppercase'>
                Care service hierarchy
              </p>
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
            </div>
            <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2'>
              <label className='min-w-0 text-xs font-medium text-gray-700'>
                Published from
                <input
                  type='date'
                  value={publishedFrom}
                  onChange={event => onDateChange('publishedFrom', event.target.value)}
                  max={publishedTo || undefined}
                  className='mt-1 block h-11 w-full min-w-0 appearance-none rounded-lg border border-gray-300 bg-white px-3 text-base sm:text-sm'
                />
              </label>
              <label className='min-w-0 text-xs font-medium text-gray-700'>
                Published to
                <input
                  type='date'
                  value={publishedTo}
                  onChange={event => onDateChange('publishedTo', event.target.value)}
                  min={publishedFrom || undefined}
                  className='mt-1 block h-11 w-full min-w-0 appearance-none rounded-lg border border-gray-300 bg-white px-3 text-base sm:text-sm'
                />
              </label>
              <label className='min-w-0 text-xs font-medium text-gray-700'>
                Closing from
                <input
                  type='date'
                  value={deadlineFrom}
                  onChange={event => onDateChange('deadlineFrom', event.target.value)}
                  max={deadlineTo || undefined}
                  className='mt-1 block h-11 w-full min-w-0 appearance-none rounded-lg border border-gray-300 bg-white px-3 text-base sm:text-sm'
                />
              </label>
              <label className='min-w-0 text-xs font-medium text-gray-700'>
                Closing to
                <input
                  type='date'
                  value={deadlineTo}
                  onChange={event => onDateChange('deadlineTo', event.target.value)}
                  min={deadlineFrom || undefined}
                  className='mt-1 block h-11 w-full min-w-0 appearance-none rounded-lg border border-gray-300 bg-white px-3 text-base sm:text-sm'
                />
              </label>
            </div>

            {maximum > minimum && (
              <div>
                <p className='mb-2 text-xs font-semibold text-gray-700'>Contract value</p>
                <TenderValueRange
                  stops={rangeStops}
                  selectedMinimum={valueMinMinor ?? minimum}
                  selectedMaximum={valueMaxMinor ?? maximum}
                  resultCount={resultCount}
                  onChange={onValueChange}
                />
                {(valueBounds?.unspecifiedCount ?? 0) > 0 && (
                  <label className='mt-2 flex cursor-pointer items-start gap-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-700'>
                    <input
                      type='checkbox'
                      checked={includeValueUnspecified}
                      onChange={event => onIncludeValueUnspecifiedChange(event.target.checked)}
                      className='text-brand-600 mt-0.5 h-4 w-4 border-gray-300'
                    />
                    Include {valueBounds?.unspecifiedCount?.toLocaleString('en-GB')} opportunities where the value is
                    not stated
                  </label>
                )}
              </div>
            )}

            <div className='space-y-2'>
              <label className='flex cursor-pointer items-center gap-2 text-sm text-gray-700'>
                <input
                  type='checkbox'
                  checked={smeSuitable}
                  onChange={event => onBooleanChange('smeSuitable', event.target.checked)}
                  className='text-brand-600 h-4 w-4 border-gray-300'
                />
                Suitable for SMEs
              </label>
            </div>
          </div>
        </FilterGroup>
      </div>
    </div>
  )
}

export function TenderBoardClient({ initialTender }: { initialTender?: PublicTender }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openModal } = useHalfScreenModal()
  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') ?? '')
  const [category, setCategory] = useState(() => searchParams.getAll('category'))
  const [audience, setAudience] = useState(() =>
    searchParams.getAll('audience').filter(value => TENDER_AUDIENCES.some(option => option.value === value))
  )
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
  const pendingValueFiltersRef = useRef<{ valueMinMinor?: number; valueMaxMinor?: number }>({
    valueMinMinor,
    valueMaxMinor
  })
  const [includeValueUnspecified, setIncludeValueUnspecified] = useState(
    () => searchParams.get('includeValueUnspecified') !== 'false'
  )
  const [sort, setSort] = useState<'deadline' | 'newest'>(() =>
    searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  )
  const [filters, setFilters] = useState<AppliedTenderFilters>(() => ({
    keyword: searchParams.get('keyword')?.trim() ?? '',
    audience: searchParams.getAll('audience').filter(value => TENDER_AUDIENCES.some(option => option.value === value)),
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
    includeValueUnspecified: searchParams.get('includeValueUnspecified') !== 'false',
    sort: searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  }))
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page') ?? 1) || 1))
  const [viewMode, setViewMode] = useState<TenderBoardViewMode>(() =>
    searchParams.get('view') === 'grid' ? 'grid' : 'list'
  )
  const [activeTenderId, setActiveTenderId] = useState(() => initialTender?.id ?? searchParams.get('tender') ?? '')
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
  const [savedTenderPrompt, setSavedTenderPrompt] = useState<PublicTender | null>(null)
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set())

  const regions = useMemo(() => [...filterOptions.regions].sort(), [filterOptions.regions])
  const subcategories = useMemo(() => [...(filterOptions.subcategories ?? [])].sort(), [filterOptions.subcategories])
  const taxonomyNodes = useMemo(() => filterOptions.taxonomy ?? [], [filterOptions.taxonomy])
  const keywordOptions = useMemo(() => [...(filterOptions.keywords ?? [])].sort(), [filterOptions.keywords])
  const keywordGroups = useMemo(() => filterOptions.keywordGroups ?? [], [filterOptions.keywordGroups])
  const stages = useMemo(() => [...(filterOptions.stages ?? [])].sort(), [filterOptions.stages])
  const procedureTypes = useMemo(() => [...(filterOptions.procedureTypes ?? [])].sort(), [filterOptions.procedureTypes])
  const procurementTypes = useMemo(
    () => [...(filterOptions.procurementTypes ?? [])].sort(),
    [filterOptions.procurementTypes]
  )
  const activeFilterCount =
    Number(Boolean(filters.keyword)) +
    filters.audience.length +
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
    Number(filters.valueMinMinor !== undefined || filters.valueMaxMinor !== undefined) +
    Number(
      (filters.valueMinMinor !== undefined || filters.valueMaxMinor !== undefined) && !filters.includeValueUnspecified
    )

  const activeFilterLabels = [
    filters.keyword ? { key: 'keyword', label: `Search: ${filters.keyword}` } : null,
    ...filters.audience.map(value => ({
      key: 'audience' as const,
      label: TENDER_AUDIENCES.find(option => option.value === value)?.label ?? value
    })),
    ...filters.keywords.map(label => ({ key: 'keywords' as const, label })),
    ...filters.subcategory.map(label => ({ key: 'subcategory' as const, label })),
    ...filters.category.map(label => ({ key: 'category' as const, label })),
    ...filters.taxonomy.map(slug => ({
      key: 'taxonomy' as const,
      label: taxonomyNodes.find(node => node.slug === slug)?.label ?? slug
    })),
    ...filters.region.map(label => ({ key: 'region' as const, label }))
  ].filter(
    (
      item
    ): item is {
      key: 'keyword' | 'audience' | 'keywords' | 'category' | 'region' | 'subcategory' | 'taxonomy'
      label: string
    } => item !== null
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
    if (!savedTenderPrompt) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [savedTenderPrompt])

  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.keyword) next.set('keyword', filters.keyword)
    filters.audience.forEach(value => next.append('audience', value))
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
    if (!filters.includeValueUnspecified) next.set('includeValueUnspecified', 'false')
    if (filters.sort !== DEFAULT_SORT) next.set('sort', filters.sort)
    if (page > 1) next.set('page', String(page))
    if (viewMode !== 'list') next.set('view', viewMode)
    if (activeTenderId && !initialTender) next.set('tender', activeTenderId)

    const query = next.toString()
    const routePath = initialTender ? `/tenders/${encodeURIComponent(initialTender.id)}` : '/tenders'
    router.replace(query ? `${routePath}?${query}` : routePath, { scroll: false })
  }, [activeTenderId, filters, initialTender, page, router, viewMode])

  const openTenderWorkspace = useCallback(
    (tender: PublicTender, initialLeadKind?: TenderLeadKind) => {
      const modalData: TenderBoardPanelData = {
        tender,
        initialLeadKind
      }

      setActiveTenderId(tender.id)
      trackEvent('tender_opened', { has_lead_form: Boolean(initialLeadKind) })
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
    const listedTender =
      initialTender?.id === activeTenderId ? initialTender : tenders.find(tender => tender.id === activeTenderId)
    if (listedTender) {
      openTenderWorkspace(listedTender)
      return
    }

    void getPublicTender(activeTenderId)
      .then(response => openTenderWorkspace(response.data))
      .catch(() => setError('The tender link could not be opened. It may no longer be available.'))
  }, [activeTenderId, initialTender, loading, openTenderWorkspace, tenders])

  function applyCurrentFilters(next?: Partial<AppliedTenderFilters>) {
    const nextFilters = {
      keyword: keyword.trim(),
      audience,
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
      includeValueUnspecified,
      sort,
      ...next
    }

    setPage(1)
    setFilters(nextFilters)
    trackEvent('tender_search', {
      has_keyword: Boolean(nextFilters.keyword),
      category_count: nextFilters.category.length,
      region_count: nextFilters.region.length,
      subcategory_count: nextFilters.subcategory.length,
      sort: nextFilters.sort
    })
  }

  function clearFilters() {
    setKeyword('')
    setAudience([])
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
    pendingValueFiltersRef.current = { valueMinMinor: undefined, valueMaxMinor: undefined }
    setIncludeValueUnspecified(true)
    setSort(DEFAULT_SORT)
    setPage(1)
    setFilters({
      keyword: '',
      audience: [],
      category: [],
      region: [],
      subcategory: [],
      taxonomy: [],
      keywords: [],
      stage: [],
      procedureType: [],
      procurementType: [],
      includeValueUnspecified: true,
      sort: DEFAULT_SORT
    })
    trackEvent('tender_filters_cleared')
  }

  function removeFilter(
    key: 'keyword' | 'audience' | 'keywords' | 'category' | 'region' | 'subcategory' | 'taxonomy',
    label?: string
  ) {
    if (key === 'keyword') setKeyword('')
    if (key === 'audience') {
      const value = TENDER_AUDIENCES.find(option => option.label === label)?.value ?? label
      setAudience(current => current.filter(item => item !== value))
      setPage(1)
      setFilters(current => ({ ...current, audience: current.audience.filter(item => item !== value) }))
      return
    }
    if (key === 'keywords') setKeywords(current => current.filter(value => value !== label))
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
    key: 'audience' | 'keywords' | 'stage' | 'procedureType' | 'procurementType',
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
    const pairedField =
      field === 'publishedFrom'
        ? 'publishedTo'
        : field === 'publishedTo'
          ? 'publishedFrom'
          : field === 'deadlineFrom'
            ? 'deadlineTo'
            : 'deadlineFrom'
    const pairedValue = {
      publishedFrom,
      publishedTo,
      deadlineFrom,
      deadlineTo
    }[pairedField]
    const invalidPair = Boolean(
      value && pairedValue && (field.endsWith('From') ? value > pairedValue : value < pairedValue)
    )

    setters[field](value)
    if (invalidPair) setters[pairedField]('')
    setPage(1)
    setFilters(current => ({
      ...current,
      [field]: value || undefined,
      ...(invalidPair ? { [pairedField]: undefined } : {})
    }))
  }

  function changeBoolean(field: 'framework' | 'dynamicMarket' | 'smeSuitable', value: boolean) {
    const setters = { framework: setFramework, dynamicMarket: setDynamicMarket, smeSuitable: setSmeSuitable }
    setters[field](value)
    setPage(1)
    setFilters(current => ({ ...current, [field]: value || undefined }))
  }

  function changeValue(field: 'valueMinMinor' | 'valueMaxMinor', value: number) {
    const maximum = normalizedValueStops(filterOptions.ranges?.value).at(-1)
    const normalized =
      field === 'valueMinMinor' && value <= 0
        ? undefined
        : field === 'valueMaxMinor' && maximum !== null && maximum !== undefined && value >= maximum
          ? undefined
          : value

    if (field === 'valueMinMinor') setValueMinMinor(normalized)
    else setValueMaxMinor(normalized)
    pendingValueFiltersRef.current = { ...pendingValueFiltersRef.current, [field]: normalized }

    if (valueFilterTimerRef.current !== null) window.clearTimeout(valueFilterTimerRef.current)
    valueFilterTimerRef.current = window.setTimeout(() => {
      setPage(1)
      setFilters(current => ({ ...current, ...pendingValueFiltersRef.current }))
      valueFilterTimerRef.current = null
    }, 350)
  }

  function changeIncludeValueUnspecified(value: boolean) {
    setIncludeValueUnspecified(value)
    setPage(1)
    setFilters(current => ({ ...current, includeValueUnspecified: value }))
  }

  function toggleSaved(tender: PublicTender) {
    setSavedTenderIds(current => {
      const next = new Set(current)
      if (next.has(tender.id)) next.delete(tender.id)
      else {
        next.add(tender.id)
        setSaveNotice('Saved on this device. Sign in to OrbitMirai when you need a permanent shortlist across devices.')
        if (window.sessionStorage.getItem(SAVE_SIGNUP_PROMPTED_KEY) !== 'true') {
          window.sessionStorage.setItem(SAVE_SIGNUP_PROMPTED_KEY, 'true')
          setSavedTenderPrompt(tender)
        }
      }
      trackEvent(next.has(tender.id) ? 'tender_saved' : 'tender_unsaved')
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

      {savedTenderPrompt && (
        <div className='fixed inset-0 z-60 flex items-end justify-center sm:items-center sm:p-6'>
          <button
            type='button'
            aria-label='Close saved tender signup prompt'
            className='absolute inset-0 bg-gray-950/45'
            onClick={() => setSavedTenderPrompt(null)}
          />
          <section
            role='dialog'
            aria-modal='true'
            aria-labelledby='saved-tender-prompt-title'
            className='relative z-10 w-full rounded-t-lg border border-b-0 border-gray-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-lg sm:border sm:p-6'
          >
            <div className='flex items-start justify-between gap-4'>
              <span className='bg-brand-50 text-brand-700 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg'>
                <SiteIcon name='check' className='h-5 w-5' />
              </span>
              <button
                type='button'
                onClick={() => setSavedTenderPrompt(null)}
                aria-label='Close signup prompt'
                className='focus:ring-brand-500/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 focus:ring-4 focus:outline-hidden'
              >
                <SiteIcon name='close' className='h-5 w-5' />
              </button>
            </div>
            <p className='text-brand-700 mt-4 text-xs font-semibold tracking-[0.08em] uppercase'>Tender saved</p>
            <h2 id='saved-tender-prompt-title' className='mt-1 text-xl font-semibold text-gray-950'>
              Keep your shortlist across devices
            </h2>
            <p className='mt-2 line-clamp-2 text-sm font-medium text-gray-800'>{savedTenderPrompt.title}</p>
            <p className='mt-2 text-sm leading-6 text-gray-600'>
              This tender is saved in this browser. Create your free Orbit Mirai account to keep it permanently, track
              deadlines and receive relevant tender alerts.
            </p>
            <div className='mt-5 grid gap-2'>
              <ButtonLink
                href={savedTenderSignupHref(savedTenderPrompt.id)}
                fullWidth
                leftIcon={<SiteIcon name='user' className='h-4 w-4' />}
              >
                Create free account
              </ButtonLink>
              <Button variant='secondary' fullWidth onClick={() => setSavedTenderPrompt(null)}>
                Continue browsing
              </Button>
            </div>
          </section>
        </div>
      )}

      <section className='min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white'>
        <TenderBoardFilters
          keyword={keyword}
          regionsSelected={region}
          keywordsSelected={keywords}
          audienceSelected={audience}
          sort={sort}
          viewMode={viewMode}
          regions={regions}
          keywordOptions={keywordOptions}
          activeFilterCount={activeFilterCount}
          loading={loading}
          onKeywordChange={setKeyword}
          onRegionToggle={value => toggleFilter('region', value)}
          onKeywordToggle={value => toggleAdvancedList('keywords', value, setKeywords)}
          onAudienceToggle={value => toggleAdvancedList('audience', value, setAudience)}
          onSortChange={value => {
            setSort(value)
            applyCurrentFilters({ sort: value })
          }}
          onViewModeChange={mode => {
            setViewMode(mode)
            trackEvent('tender_view_changed', { view_mode: mode })
          }}
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
              audience={audience}
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
              keywordGroups={keywordGroups}
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
              includeValueUnspecified={includeValueUnspecified}
              resultCount={contextualFilters.total}
              facets={contextualFilters.facets}
              activeFilterCount={activeFilterCount}
              onAudienceToggle={value => toggleAdvancedList('audience', value, setAudience)}
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
              onIncludeValueUnspecifiedChange={changeIncludeValueUnspecified}
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
            className='absolute top-0 right-0 flex h-[100dvh] w-full max-w-sm flex-col overflow-hidden bg-white shadow-2xl'
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
            <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4'>
              <FilterPanel
                audience={audience}
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
                keywordGroups={keywordGroups}
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
                includeValueUnspecified={includeValueUnspecified}
                resultCount={contextualFilters.total}
                facets={contextualFilters.facets}
                activeFilterCount={activeFilterCount}
                onAudienceToggle={value => toggleAdvancedList('audience', value, setAudience, false)}
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
                onIncludeValueUnspecifiedChange={changeIncludeValueUnspecified}
                onClear={clearFilters}
              />
            </div>
            <div className='shrink-0 border-t border-gray-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
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
