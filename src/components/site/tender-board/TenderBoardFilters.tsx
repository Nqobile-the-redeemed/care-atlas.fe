'use client'

import { useEffect, useRef, useState } from 'react'

import { SiteIcon } from '../SiteIcon'
import { Button } from '../ui'

import { inputClass } from './constants'

export type TenderBoardViewMode = 'list' | 'grid'

type TenderBoardFiltersProps = {
  keyword: string
  regionsSelected: string[]
  keywordsSelected: string[]
  audienceSelected: string[]
  sort: 'deadline' | 'newest'
  viewMode: TenderBoardViewMode
  regions: string[]
  keywordOptions: string[]
  activeFilterCount: number
  loading?: boolean
  onKeywordChange: (value: string) => void
  onRegionToggle: (value: string) => void
  onKeywordToggle: (value: string) => void
  onAudienceToggle: (value: string) => void
  onSortChange: (value: 'deadline' | 'newest') => void
  onViewModeChange: (value: TenderBoardViewMode) => void
  onClear: () => void
  onSubmit: () => void
  onOpenMobileFilters: () => void
}

type MultiSelectOption = {
  value: string
  label: string
}

function MultiSelectDropdown({
  label,
  allLabel,
  options,
  selected,
  onToggle
}: {
  label: string
  allLabel: string
  options: MultiSelectOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const selectedLabels = options.filter(option => selected.includes(option.value)).map(option => option.label)
  const summary =
    selectedLabels.length === 0
      ? allLabel
      : selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`

  return (
    <div ref={rootRef} className='relative min-w-0'>
      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className={`${inputClass} flex w-full min-w-0 items-center justify-between gap-3 text-left lg:w-56`}
      >
        <span className='min-w-0 truncate'>
          <span className='sr-only'>{label}: </span>
          {summary}
        </span>
        <SiteIcon name='chevron' className={`h-4 w-4 shrink-0 text-gray-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role='listbox'
          aria-label={label}
          aria-multiselectable='true'
          className='absolute top-full left-0 z-40 mt-2 grid w-[min(44rem,calc(100vw-2rem))] gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-xl sm:grid-cols-2 lg:grid-cols-3'
        >
          {options.map(option => {
            const checked = selected.includes(option.value)
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  checked ? 'bg-brand-50 text-brand-800' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <input
                  type='checkbox'
                  checked={checked}
                  onChange={() => onToggle(option.value)}
                  className='text-brand-600 focus:ring-brand-500/20 mt-0.5 h-4 w-4 border-gray-300'
                />
                <span>{option.label}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function TenderBoardFilters({
  keyword,
  regionsSelected,
  keywordsSelected,
  audienceSelected,
  sort,
  viewMode,
  regions,
  keywordOptions,
  activeFilterCount,
  loading = false,
  onKeywordChange,
  onRegionToggle,
  onKeywordToggle,
  onAudienceToggle,
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
      <div className='grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]'>
        <label className='relative min-w-0'>
          <span className='sr-only'>Search tenders</span>
          <SiteIcon name='search' className='absolute top-3.5 left-3 h-4 w-4 text-gray-400' />
          <input
            value={keyword}
            onChange={event => onKeywordChange(event.target.value)}
            placeholder='Search title, description, buyer, borough, region or reference'
            className={`${inputClass} w-full min-w-0 pl-10`}
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
          <MultiSelectDropdown
            label='Care categories'
            allLabel='All care categories'
            options={keywordOptions.map(value => ({ value, label: value }))}
            selected={keywordsSelected}
            onToggle={onKeywordToggle}
          />
          <MultiSelectDropdown
            label='People supported'
            allLabel='Adults, children or both'
            options={[
              { value: 'adults', label: 'Adults' },
              { value: 'children', label: 'Children and families' }
            ]}
            selected={audienceSelected}
            onToggle={onAudienceToggle}
          />
          <MultiSelectDropdown
            label='Regions'
            allLabel='All regions'
            options={regions.map(value => ({ value, label: value }))}
            selected={regionsSelected}
            onToggle={onRegionToggle}
          />
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
        <div className='flex flex-wrap items-center justify-between gap-3'>
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
