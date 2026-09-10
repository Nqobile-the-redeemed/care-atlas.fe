'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  getPublicTenderFilters,
  getPublicTenders,
  type PublicTender,
  type TenderFilters,
  type TenderLeadKind,
  type TenderPagination
} from '@/lib/api/tenders'
import { preloadRecaptcha } from '@/lib/recaptcha'
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

const CARE_ATLAS_INDUSTRY = 'Health and Social Care'
const TENDERS_PER_PAGE = 15
const DEFAULT_SORT: 'deadline' | 'newest' = 'deadline'

type AppliedTenderFilters = TenderBoardFiltersState & {
  subcategory: string
  sort: 'deadline' | 'newest'
}

type FilterPanelProps = {
  category: string
  region: string
  subcategory: string
  categories: string[]
  regions: string[]
  subcategories: string[]
  activeFilterCount: number
  onCategoryChange: (value: string) => void
  onRegionChange: (value: string) => void
  onSubcategoryChange: (value: string) => void
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

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className='border-b border-gray-200 py-4 last:border-b-0'>
      <summary className='flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-950'>
        {title}
        <SiteIcon name='chevron' className='h-4 w-4 text-gray-400' />
      </summary>
      <div className='mt-3 space-y-2'>{children}</div>
    </details>
  )
}

function FilterRadioList({
  name,
  value,
  options,
  emptyLabel,
  onChange
}: {
  name: string
  value: string
  options: string[]
  emptyLabel: string
  onChange: (value: string) => void
}) {
  return (
    <div className='space-y-1'>
      {[emptyLabel, ...options].map(option => {
        const optionValue = option === emptyLabel ? '' : option
        const checked = value === optionValue

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
              checked ? 'bg-brand-50 text-brand-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
            }`}
          >
            <input
              type='radio'
              name={name}
              checked={checked}
              onChange={() => onChange(optionValue)}
              className='text-brand-600 focus:ring-brand-500/20 h-4 w-4 border-gray-300'
            />
            <span className='line-clamp-2'>{option}</span>
          </label>
        )
      })}
    </div>
  )
}

function FilterPanel({
  category,
  region,
  subcategory,
  categories,
  regions,
  subcategories,
  activeFilterCount,
  onCategoryChange,
  onRegionChange,
  onSubcategoryChange,
  onClear
}: FilterPanelProps) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white'>
      <div className='flex items-center justify-between gap-3 border-b border-gray-200 p-4'>
        <div>
          <h2 className='font-semibold text-gray-950'>Filters</h2>
          <p className='text-xs text-gray-500'>{activeFilterCount} active</p>
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
        <FilterGroup title='Tender service type'>
          {subcategories.length > 0 ? (
            <FilterRadioList
              name='service-type'
              value={subcategory}
              options={subcategories}
              emptyLabel='All care service types'
              onChange={onSubcategoryChange}
            />
          ) : (
            <p className='text-sm text-gray-500'>Service subcategories are not available from the API yet.</p>
          )}
        </FilterGroup>
        <FilterGroup title='Tender category'>
          <FilterRadioList
            name='tender-category'
            value={category}
            options={categories}
            emptyLabel='All categories'
            onChange={onCategoryChange}
          />
        </FilterGroup>
        <FilterGroup title='Region or location'>
          <FilterRadioList
            name='region'
            value={region}
            options={regions}
            emptyLabel='All regions'
            onChange={onRegionChange}
          />
        </FilterGroup>
        <FilterGroup title='Other filters'>
          <p className='text-sm leading-6 text-gray-500'>
            Publication date, closing date, procurement status and contract type need API fields before they can be
            exposed here safely.
          </p>
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
  const [category, setCategory] = useState(() => searchParams.get('category') ?? '')
  const [region, setRegion] = useState(() => searchParams.get('region') ?? '')
  const [subcategory, setSubcategory] = useState(() => searchParams.get('subcategory') ?? '')
  const [sort, setSort] = useState<'deadline' | 'newest'>(() =>
    searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  )
  const [filters, setFilters] = useState<AppliedTenderFilters>(() => ({
    keyword: searchParams.get('keyword')?.trim() ?? '',
    category: searchParams.get('category') ?? '',
    region: searchParams.get('region') ?? '',
    subcategory: searchParams.get('subcategory') ?? '',
    sort: searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  }))
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page') ?? 1) || 1))
  const [viewMode, setViewMode] = useState<TenderBoardViewMode>(() =>
    searchParams.get('view') === 'grid' ? 'grid' : 'list'
  )
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [pagination, setPagination] = useState<TenderPagination | null>(null)
  const [filterOptions, setFilterOptions] = useState<TenderFilters>({ categories: [], regions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = useMemo(() => [...filterOptions.categories].sort(), [filterOptions.categories])
  const regions = useMemo(() => [...filterOptions.regions].sort(), [filterOptions.regions])
  const subcategories = useMemo(() => [...(filterOptions.subcategories ?? [])].sort(), [filterOptions.subcategories])
  const activeFilterCount = [filters.keyword, filters.category, filters.region, filters.subcategory].filter(
    Boolean
  ).length

  const activeFilterLabels = [
    filters.keyword ? { key: 'keyword', label: `Search: ${filters.keyword}` } : null,
    filters.subcategory ? { key: 'subcategory', label: filters.subcategory } : null,
    filters.category ? { key: 'category', label: filters.category } : null,
    filters.region ? { key: 'region', label: filters.region } : null
  ].filter((item): item is { key: keyof TenderBoardFiltersState | 'subcategory'; label: string } => item !== null)

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
        industry: CARE_ATLAS_INDUSTRY,
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
    void getPublicTenderFilters({ industry: CARE_ATLAS_INDUSTRY })
      .then(response => setFilterOptions(response.data))
      .catch(() => setFilterOptions({ categories: [], regions: [] }))
  }, [])

  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.keyword) next.set('keyword', filters.keyword)
    if (filters.category) next.set('category', filters.category)
    if (filters.region) next.set('region', filters.region)
    if (filters.subcategory) next.set('subcategory', filters.subcategory)
    if (filters.sort !== DEFAULT_SORT) next.set('sort', filters.sort)
    if (page > 1) next.set('page', String(page))
    if (viewMode !== 'list') next.set('view', viewMode)

    const query = next.toString()
    router.replace(query ? `/tenders?${query}` : '/tenders', { scroll: false })
  }, [filters, page, router, viewMode])

  function openTenderWorkspace(tender: PublicTender, initialLeadKind?: TenderLeadKind) {
    const modalData: TenderBoardPanelData = {
      tender,
      initialLeadKind
    }

    openModal(modalData, tenderBoardTemplate, {
      width: 'min(100vw, 760px)',
      headerConfig: {
        title: tender.title,
        subtitle: tender.buyer ?? 'Buyer not stated'
      }
    })
  }

  function applyCurrentFilters(next?: Partial<AppliedTenderFilters>) {
    setPage(1)
    setFilters({
      keyword: keyword.trim(),
      category,
      region,
      subcategory,
      sort,
      ...next
    })
  }

  function clearFilters() {
    setKeyword('')
    setCategory('')
    setRegion('')
    setSubcategory('')
    setSort(DEFAULT_SORT)
    setPage(1)
    setFilters({ keyword: '', category: '', region: '', subcategory: '', sort: DEFAULT_SORT })
  }

  function removeFilter(key: keyof TenderBoardFiltersState | 'subcategory') {
    if (key === 'keyword') setKeyword('')
    if (key === 'category') setCategory('')
    if (key === 'region') setRegion('')
    if (key === 'subcategory') setSubcategory('')

    setPage(1)
    setFilters(current => ({ ...current, [key]: '' }))
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
    <div className='space-y-4'>
      {error && !loading && <p className='bg-error-50 text-error-700 rounded-lg p-3 text-sm font-medium'>{error}</p>}

      <section className='rounded-lg border border-gray-200 bg-white'>
        <TenderBoardFilters
          keyword={keyword}
          category={category}
          region={region}
          subcategory={subcategory}
          sort={sort}
          viewMode={viewMode}
          categories={categories}
          regions={regions}
          subcategories={subcategories}
          activeFilterCount={activeFilterCount}
          loading={loading}
          onKeywordChange={setKeyword}
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
          onSubcategoryChange={value => {
            setSubcategory(value)
            applyCurrentFilters({ subcategory: value })
          }}
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
                    key={filter.key}
                    type='button'
                    onClick={() => removeFilter(filter.key)}
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
              category={category}
              region={region}
              subcategory={subcategory}
              categories={categories}
              regions={regions}
              subcategories={subcategories}
              activeFilterCount={activeFilterCount}
              onCategoryChange={value => {
                setCategory(value)
                applyCurrentFilters({ category: value })
              }}
              onRegionChange={value => {
                setRegion(value)
                applyCurrentFilters({ region: value })
              }}
              onSubcategoryChange={value => {
                setSubcategory(value)
                applyCurrentFilters({ subcategory: value })
              }}
              onClear={clearFilters}
            />
          </aside>
          <TenderBoardList
            loading={loading}
            tenders={tenders}
            viewMode={viewMode}
            onOpenDetails={tender => openTenderWorkspace(tender)}
            onOpenForm={openTenderWorkspace}
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
                category={category}
                region={region}
                subcategory={subcategory}
                categories={categories}
                regions={regions}
                subcategories={subcategories}
                activeFilterCount={activeFilterCount}
                onCategoryChange={setCategory}
                onRegionChange={setRegion}
                onSubcategoryChange={setSubcategory}
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
