'use client'

import { SiteIcon } from '../SiteIcon'

import { inputClass } from './constants'

type TenderBoardFiltersProps = {
  keyword: string
  category: string
  region: string
  categories: string[]
  regions: string[]
  onKeywordChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onRegionChange: (value: string) => void
  onSubmit: () => void
}

export function TenderBoardFilters({
  keyword,
  category,
  region,
  categories,
  regions,
  onKeywordChange,
  onCategoryChange,
  onRegionChange,
  onSubmit
}: TenderBoardFiltersProps) {
  return (
    <form
      className='border-b border-gray-200 bg-gray-50 p-4'
      onSubmit={event => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className='grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]'>
        <label className='relative'>
          <span className='sr-only'>Search tenders</span>
          <SiteIcon name='search' className='absolute top-3.5 left-3 h-4 w-4 text-gray-400' />
          <input
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
            placeholder='Search care, cleaning, supported living...'
            className={`${inputClass} w-full pl-10`}
          />
        </label>
        <select
          value={category}
          onChange={event => onCategoryChange(event.target.value)}
          aria-label='Category'
          className={inputClass}
        >
          <option value=''>All categories</option>
          {categories.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          value={region}
          onChange={event => onRegionChange(event.target.value)}
          aria-label='Region'
          className={inputClass}
        >
          <option value=''>All regions</option>
          {regions.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button
          type='submit'
          className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden'
        >
          <SiteIcon name='search' className='h-4 w-4' />
          Search
        </button>
      </div>
    </form>
  )
}
