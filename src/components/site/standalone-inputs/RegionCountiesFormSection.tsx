'use client'

import React, { useMemo, useRef, useEffect } from 'react'

import { StandaloneMultiSelect } from './StandaloneMultiSelect'
import {
  ALL_REGIONS,
  getAllRegionOptions,
  getCountyOptionsForRegions,
  findCountyByCode,
  findRegionByCode
} from '@/lib/geography'
import type { Option, MultiSelectOption } from './utils/types'
import type { UkRegionCode } from '@/lib/geography'

interface RegionCountiesFormSectionProps {
  selectedRegions: string[]
  selectedCounties: string[]
  onRegionsChange: (codes: string[]) => void
  onCountiesChange: (codes: string[]) => void
  regionLabel?: string
  countyLabel?: string
  regionError?: string
  countyError?: string
  className?: string
  id?: string
}

function codeArraysToOptionList(codes: string[], resolver: (c: string) => Option | undefined): MultiSelectOption[] {
  return codes.map(c => resolver(c)).filter((o): o is MultiSelectOption => Boolean(o))
}

function optionListToCodes(opts: MultiSelectOption[]): string[] {
  return opts.map(o => o.code || String(o.value)).filter(Boolean)
}

export function RegionCountiesFormSection({
  selectedRegions,
  selectedCounties,
  onRegionsChange,
  onCountiesChange,
  regionLabel = 'Regions',
  countyLabel = 'Counties',
  regionError,
  countyError,
  className = '',
  id
}: RegionCountiesFormSectionProps) {
  const previousRegions = useRef<Set<string>>(new Set(selectedRegions))

  const regionOptions = useMemo<MultiSelectOption[]>(() => getAllRegionOptions(), [])

  const countyOptions = useMemo<MultiSelectOption[]>(() => {
    const regionCodes = selectedRegions.filter((c): c is UkRegionCode => ALL_REGIONS.some(r => r.code === c))

    return getCountyOptionsForRegions(regionCodes)
  }, [selectedRegions])

  // Auto-prune counties whose owning region is no longer selected
  useEffect(() => {
    const current = new Set(selectedRegions)
    const prev = previousRegions.current

    let deselectedAny = false

    prev.forEach(code => {
      if (!current.has(code)) {
        deselectedAny = true
      }
    })
    previousRegions.current = current

    if (deselectedAny) {
      const stillAllowed = new Set(countyOptions.map(o => o.code))
      const filtered = selectedCounties.filter(code => stillAllowed.has(code))

      if (filtered.length !== selectedCounties.length) {
        onCountiesChange(filtered)
      }
    }
  }, [selectedRegions, countyOptions, selectedCounties, onCountiesChange])

  const allSelected = selectedRegions.length > 0 && ALL_REGIONS.every(r => selectedRegions.includes(r.code))

  function toggleAllRegions() {
    if (allSelected) {
      onRegionsChange([])
    } else {
      onRegionsChange(ALL_REGIONS.map(r => r.code))
    }
  }

  const selectedRegionOptions = useMemo(
    () => codeArraysToOptionList(selectedRegions, code => findRegionByCode(code as UkRegionCode)),
    [selectedRegions]
  )

  const selectedCountyOptions = useMemo(
    () => codeArraysToOptionList(selectedCounties, code => findCountyByCode(code)),
    [selectedCounties]
  )

  return (
    <div className={`grid gap-5 md:grid-cols-2 ${className}`} id={id}>
      <div className='relative'>
        <StandaloneMultiSelect
          name={`${id ? id + '-' : ''}regions`}
          label={regionLabel}
          placeholder={selectedRegions.length ? 'Add more regions…' : 'Type to search regions'}
          options={regionOptions}
          value={selectedRegionOptions}
          onChange={next => onRegionsChange(optionListToCodes(next))}
          error={regionError}
          headerAction={
            <button
              type='button'
              onClick={toggleAllRegions}
              className='text-brand-700 hover:bg-brand-50 inline-flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium dark:text-blue-300 dark:hover:bg-blue-500/10'
            >
              <span>{allSelected ? 'Unselect all regions' : 'Select all regions'}</span>
              <span className='text-xs opacity-80'>
                {selectedRegions.length}/{ALL_REGIONS.length}
              </span>
            </button>
          }
        />
      </div>

      <div className='relative'>
        {selectedRegions.length === 0 ? (
          <div className='flex flex-col gap-2'>
            {countyLabel && (
              <label className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'>
                {countyLabel}
              </label>
            )}
            <div
              aria-disabled
              aria-live='polite'
              className='border-gray-mediumGray/60 flex items-center justify-between rounded-lg border-2 bg-gray-50 px-4 py-3 text-sm text-gray-500 italic dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
            >
              <span>Select a region to see available counties</span>
            </div>
            {countyError && (
              <p className='text-xs font-medium text-red-500' role='alert'>
                {countyError}
              </p>
            )}
          </div>
        ) : (
          <StandaloneMultiSelect
            name={`${id ? id + '-' : ''}counties`}
            label={countyLabel}
            placeholder={
              selectedCounties.length
                ? 'Add more counties…'
                : countyOptions.length
                  ? 'Type to search counties'
                  : 'No counties available in the selected regions'
            }
            options={countyOptions}
            value={selectedCountyOptions}
            onChange={next => onCountiesChange(optionListToCodes(next))}
            error={countyError}
          />
        )}
      </div>
    </div>
  )
}
