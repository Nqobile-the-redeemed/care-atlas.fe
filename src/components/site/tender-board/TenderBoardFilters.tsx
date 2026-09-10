'use client'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

import { inputClass } from './constants'

export type TenderBoardViewMode = 'list' | 'grid'

type TenderBoardFiltersProps = {
  keyword: string
  category: string
  region: string
  subcategory: string
  sort: 'deadline' | 'newest'
  viewMode: TenderBoardViewMode
  categories: string[]
  regions: string[]
  subcategories: string[]
  activeFilterCount: number
  loading?: boolean
  onKeywordChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onRegionChange: (value: string) => void
  onSubcategoryChange: (value: string) => void
  onSortChange: (value: 'deadline' | 'newest') => void
  onViewModeChange: (value: TenderBoardViewMode) => void
  onClear: () => void
  onSubmit: () => void
  onOpenMobileFilters: () => void
}

export function TenderBoardFilters({
  keyword,
  category,
  region,
  subcategory,
  sort,
  viewMode,
  categories,
  regions,
  subcategories,
  activeFilterCount,
  loading = false,
  onKeywordChange,
  onCategoryChange,
  onRegionChange,
  onSubcategoryChange,
  onSortChange,
  onViewModeChange,
  onClear,
  onOpenMobileFilters,
  onSubmit
}: TenderBoardFiltersProps) {
  const hasActiveFilters = activeFilterCount > 0

  return (
    <form
      className='border-b border-gray-200 bg-gray-50 p-4'
      onSubmit={event => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]'>
        <label className='relative'>
          <span className='sr-only'>Search tenders</span>
          <SiteIcon name='search' className='absolute top-3.5 left-3 h-4 w-4 text-gray-400' />
          <input
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
            placeholder='Search tender title, buyer or keyword'
            className={`${inputClass} w-full pl-10`}
          />
        </label>
        <Button
          type='button'
          variant='secondary'
          className='lg:hidden'
          leftIcon={<SiteIcon name='filter' className='h-4 w-4' />}
          onClick={onOpenMobileFilters}
        >
          Filters{hasActiveFilters ? ` (${activeFilterCount})` : ''}
        </Button>
        <Button type='submit' loading={loading} leftIcon={<SiteIcon name='search' className='h-4 w-4' />}>
          Search
        </Button>
      </div>

      <div className='mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        <div className='hidden flex-wrap items-center gap-2 lg:flex'>
          <select
            value={subcategory}
            onChange={event => onSubcategoryChange(event.target.value)}
            aria-label='Service type'
            className={`${inputClass} w-56`}
          >
            <option value=''>All care services</option>
            {subcategories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={event => onCategoryChange(event.target.value)}
            aria-label='Tender category'
            className={`${inputClass} w-56`}
          >
            <option value=''>All tender categories</option>
            {categories.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={region}
            onChange={event => onRegionChange(event.target.value)}
            aria-label='Region'
            className={`${inputClass} w-52`}
          >
            <option value=''>All regions</option>
            {regions.map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button
              type='button'
              onClick={onClear}
              className='text-brand-700 hover:bg-brand-50 focus:ring-brand-500/20 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:outline-hidden'
            >
              Clear all
            </button>
          )}
        </div>
        <div className='flex items-center justify-between gap-3'>
          <label className='flex items-center gap-2 text-sm text-gray-600'>
            <span>Sort</span>
            <select
              value={sort}
              onChange={event => onSortChange(event.target.value as 'deadline' | 'newest')}
              className='focus:border-brand-500 focus:ring-brand-500/10 h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
            >
              <option value='deadline'>Closing soon</option>
              <option value='newest'>Newest</option>
            </select>
          </label>
          <div className='flex rounded-lg border border-gray-200 bg-white p-1' aria-label='Tender view mode'>
            {(['list', 'grid'] as const).map(mode => (
              <button
                key={mode}
                type='button'
                aria-label={mode === 'list' ? 'Show tenders as a list' : 'Show tenders as a grid'}
                title={mode === 'list' ? 'List view' : 'Grid view'}
                aria-pressed={viewMode === mode}
                onClick={() => onViewModeChange(mode)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                  viewMode === mode ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <SiteIcon name={mode} className='h-4 w-4' />
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
