'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { getPublicTenders, type PublicTender, type TenderLeadKind } from '@/lib/api/tenders'
import { preloadRecaptcha } from '@/lib/recaptcha'
import { useHalfScreenModal } from '@/context/HalfScreenModalContext'

import {
  TenderBoardFilters,
  TenderBoardHalfScreenContent,
  TenderBoardList,
  type TenderBoardFiltersState,
  type TenderBoardPanelData
} from './tender-board'

export function TenderBoardClient() {
  const { openModal } = useHalfScreenModal()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [filters, setFilters] = useState<TenderBoardFiltersState>({ keyword: '', category: '', region: '' })
  const [tenders, setTenders] = useState<PublicTender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = useMemo(() => Array.from(new Set(tenders.flatMap(tender => tender.categories))).sort(), [tenders])
  const regions = useMemo(() => Array.from(new Set(tenders.flatMap(tender => tender.regions))).sort(), [tenders])

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
      const response = await getPublicTenders(filters)
      setTenders(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender list could not be loaded.')
      setTenders([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    preloadRecaptcha()
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
          onSubmit={() => setFilters({ keyword: keyword.trim(), category, region })}
        />

        <TenderBoardList
          loading={loading}
          tenders={tenders}
          onOpenDetails={tender => openTenderWorkspace(tender)}
          onOpenForm={openTenderWorkspace}
        />
      </section>
    </div>
  )
}
