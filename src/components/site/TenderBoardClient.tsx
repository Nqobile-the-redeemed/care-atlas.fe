'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  getPublicTenderFilters,
  getPublicTender,
  getPublicTenders,
  type PublicTender,
  type TenderFilters,
  type TenderLeadKind,
  type TenderPagination
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
const DEFAULT_SORT: 'deadline' | 'newest' = 'deadline'

type AppliedTenderFilters = Pick<TenderBoardFiltersState, 'keyword'> & {
  category: string[]
  region: string[]
  subcategory: string[]
  sort: 'deadline' | 'newest'
}

type FilterPanelProps = {
  category: string[]
  region: string[]
  subcategory: string[]
  categories: string[]
  regions: string[]
  subcategories: string[]
  activeFilterCount: number
  onCategoryToggle: (value: string) => void
  onRegionToggle: (value: string) => void
  onSubcategoryToggle: (value: string) => void
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
  onToggle
}: {
  name: string
  value: string[]
  options: string[]
  onToggle: (value: string) => void
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
  onCategoryToggle,
  onRegionToggle,
  onSubcategoryToggle,
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
        <FilterGroup
          title='Tender service type'
          selectedLabel={subcategory.length ? `${subcategory.length} selected` : undefined}
          optionCount={subcategories.length}
        >
          {subcategories.length > 0 ? (
            <FilterCheckboxList
              name='service-type'
              value={subcategory}
              options={subcategories}
              onToggle={onSubcategoryToggle}
            />
          ) : (
            <p className='text-sm text-gray-500'>Service subcategories are not available from the API yet.</p>
          )}
        </FilterGroup>
        <FilterGroup
          title='Tender category'
          selectedLabel={category.length ? `${category.length} selected` : undefined}
          optionCount={categories.length}
        >
          <FilterCheckboxList
            name='tender-category'
            value={category}
            options={categories}
            onToggle={onCategoryToggle}
          />
        </FilterGroup>
        <FilterGroup
          title='Region or location'
          selectedLabel={region.length ? `${region.length} selected` : undefined}
          optionCount={regions.length}
        >
          <FilterCheckboxList name='region' value={region} options={regions} onToggle={onRegionToggle} />
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
  const [category, setCategory] = useState(() => searchParams.getAll('category'))
  const [region, setRegion] = useState(() => searchParams.getAll('region'))
  const [subcategory, setSubcategory] = useState(() => searchParams.getAll('subcategory'))
  const [sort, setSort] = useState<'deadline' | 'newest'>(() =>
    searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  )
  const [filters, setFilters] = useState<AppliedTenderFilters>(() => ({
    keyword: searchParams.get('keyword')?.trim() ?? '',
    category: searchParams.getAll('category'),
    region: searchParams.getAll('region'),
    subcategory: searchParams.getAll('subcategory'),
    sort: searchParams.get('sort') === 'newest' ? 'newest' : DEFAULT_SORT
  }))
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get('page') ?? 1) || 1))
  const [viewMode, setViewMode] = useState<TenderBoardViewMode>(() =>
    searchParams.get('view') === 'grid' ? 'grid' : 'list'
  )
  const [activeTenderId, setActiveTenderId] = useState(() => searchParams.get('tender') ?? '')
  const initialTenderOpenedRef = useRef(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [pagination, setPagination] = useState<TenderPagination | null>(null)
  const [filterOptions, setFilterOptions] = useState<TenderFilters>({ categories: [], regions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set())

  const categories = useMemo(() => [...filterOptions.categories].sort(), [filterOptions.categories])
  const regions = useMemo(() => [...filterOptions.regions].sort(), [filterOptions.regions])
  const subcategories = useMemo(() => [...(filterOptions.subcategories ?? [])].sort(), [filterOptions.subcategories])
  const activeFilterCount =
    Number(Boolean(filters.keyword)) + filters.category.length + filters.region.length + filters.subcategory.length

  const activeFilterLabels = [
    filters.keyword ? { key: 'keyword', label: `Search: ${filters.keyword}` } : null,
    ...filters.subcategory.map(label => ({ key: 'subcategory' as const, label })),
    ...filters.category.map(label => ({ key: 'category' as const, label })),
    ...filters.region.map(label => ({ key: 'region' as const, label }))
  ].filter((item): item is { key: 'keyword' | 'category' | 'region' | 'subcategory'; label: string } => item !== null)

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
    void getPublicTenderFilters()
      .then(response => setFilterOptions(response.data))
      .catch(() => setFilterOptions({ categories: [], regions: [] }))
  }, [])

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
      sort,
      ...next
    })
  }

  function clearFilters() {
    setKeyword('')
    setCategory([])
    setRegion([])
    setSubcategory([])
    setSort(DEFAULT_SORT)
    setPage(1)
    setFilters({ keyword: '', category: [], region: [], subcategory: [], sort: DEFAULT_SORT })
  }

  function removeFilter(key: 'keyword' | 'category' | 'region' | 'subcategory', label?: string) {
    if (key === 'keyword') setKeyword('')
    if (key === 'category') setCategory(current => current.filter(value => value !== label))
    if (key === 'region') setRegion(current => current.filter(value => value !== label))
    if (key === 'subcategory') setSubcategory(current => current.filter(value => value !== label))

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
          categoriesSelected={category}
          regionsSelected={region}
          subcategoriesSelected={subcategory}
          sort={sort}
          viewMode={viewMode}
          categories={categories}
          regions={regions}
          subcategories={subcategories}
          activeFilterCount={activeFilterCount}
          loading={loading}
          onKeywordChange={setKeyword}
          onCategoryToggle={value => toggleFilter('category', value)}
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
                    key={filter.key}
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
              category={category}
              region={region}
              subcategory={subcategory}
              categories={categories}
              regions={regions}
              subcategories={subcategories}
              activeFilterCount={activeFilterCount}
              onCategoryToggle={value => toggleFilter('category', value)}
              onRegionToggle={value => toggleFilter('region', value)}
              onSubcategoryToggle={value => toggleFilter('subcategory', value)}
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
                category={category}
                region={region}
                subcategory={subcategory}
                categories={categories}
                regions={regions}
                subcategories={subcategories}
                activeFilterCount={activeFilterCount}
                onCategoryToggle={value => toggleFilter('category', value, false)}
                onRegionToggle={value => toggleFilter('region', value, false)}
                onSubcategoryToggle={value => toggleFilter('subcategory', value, false)}
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
