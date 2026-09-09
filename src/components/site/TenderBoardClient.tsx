'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

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
import {
  TenderBoardFilters,
  TenderBoardHalfScreenContent,
  TenderBoardList,
  type TenderBoardFiltersState,
  type TenderBoardPanelData
} from './tender-board'

const CARE_ATLAS_INDUSTRY = 'Health and Social Care'
const TENDERS_PER_PAGE = 15

export function TenderBoardClient() {
  const { openModal } = useHalfScreenModal()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [filters, setFilters] = useState<TenderBoardFiltersState>({ keyword: '', category: '', region: '' })
  const [page, setPage] = useState(1)
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [pagination, setPagination] = useState<TenderPagination | null>(null)
  const [filterOptions, setFilterOptions] = useState<TenderFilters>({ categories: [], regions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = useMemo(() => [...filterOptions.categories].sort(), [filterOptions.categories])
  const regions = useMemo(() => [...filterOptions.regions].sort(), [filterOptions.regions])

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
        perPage: TENDERS_PER_PAGE
      })
      setTenders(response.data)
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
          categories={categories}
          regions={regions}
          onKeywordChange={setKeyword}
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
          onSubmit={() => {
            setPage(1)
            setFilters({ keyword: keyword.trim(), category, region })
          }}
        />

        <div className='flex flex-col gap-3 border-b border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm font-semibold text-gray-950'>{paginationLabel}</p>
          {paginationControls}
        </div>

        <TenderBoardList
          loading={loading}
          tenders={tenders}
          onOpenDetails={tender => openTenderWorkspace(tender)}
          onOpenForm={openTenderWorkspace}
        />

        <footer className='flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-gray-600'>{paginationLabel}</p>
          {paginationControls}
        </footer>
      </section>
    </div>
  )
}
