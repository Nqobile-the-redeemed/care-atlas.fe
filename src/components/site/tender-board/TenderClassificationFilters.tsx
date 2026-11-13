'use client'

import {
  TENDER_CLASSIFICATION_DIMENSIONS,
  type TenderClassificationSelections,
  type TenderFilterOption,
  type TenderFilters
} from '@/lib/api/tenders'

export function emptyTenderClassificationSelections(): TenderClassificationSelections {
  return Object.fromEntries(
    TENDER_CLASSIFICATION_DIMENSIONS.map(({ key }) => [key, { include: [], exclude: [] }])
  ) as unknown as TenderClassificationSelections
}

export function readTenderClassificationSelections(params: Pick<URLSearchParams, 'getAll'>) {
  const selections = emptyTenderClassificationSelections()
  TENDER_CLASSIFICATION_DIMENSIONS.forEach(({ key, parameter }) => {
    selections[key] = {
      include: params.getAll(parameter),
      exclude: params.getAll(`exclude_${parameter}`)
    }
  })
  return selections
}

export function appendTenderClassificationUrlState(params: URLSearchParams, selections: TenderClassificationSelections) {
  TENDER_CLASSIFICATION_DIMENSIONS.forEach(({ key, parameter }) => {
    selections[key].include.forEach(value => params.append(parameter, value))
    selections[key].exclude.forEach(value => params.append(`exclude_${parameter}`, value))
  })
}

export function tenderClassificationSelectionCount(selections: TenderClassificationSelections) {
  return TENDER_CLASSIFICATION_DIMENSIONS.reduce(
    (count, { key }) => count + selections[key].include.length + selections[key].exclude.length,
    0
  )
}

export function TenderClassificationFilters({
  selections,
  options,
  facets,
  onChange
}: {
  selections: TenderClassificationSelections
  options: TenderFilters
  facets?: TenderFilters['facets']
  onChange: (value: TenderClassificationSelections) => void
}) {
  return (
    <div className='space-y-3'>
      {TENDER_CLASSIFICATION_DIMENSIONS.map(dimension => {
        const dimensionOptions = (options[dimension.optionKey] ?? []) as TenderFilterOption[]
        const counts = Object.fromEntries((facets?.[dimension.facetKey] ?? []).map(item => [String(item.value), item.count]))
        if (dimensionOptions.length === 0) return null
        return (
          <fieldset key={dimension.key} className='rounded-lg border border-gray-200 p-3'>
            <legend className='px-1 text-xs font-semibold text-gray-800'>{dimension.label}</legend>
            <p className='mb-2 text-xs text-gray-500'>{dimension.help}</p>
            <div className='max-h-48 space-y-2 overflow-y-auto'>
              {dimensionOptions.map(option => {
                const current = selections[dimension.key]
                const mode = current.include.includes(option.value)
                  ? 'include'
                  : current.exclude.includes(option.value)
                    ? 'exclude'
                    : 'any'
                return (
                  <label key={option.value} className='grid grid-cols-[1fr_auto] items-center gap-2 text-sm'>
                    <span>{option.label}{typeof counts[option.value] === 'number' ? ` (${counts[option.value]})` : ''}</span>
                    <select
                      aria-label={`${dimension.label}: ${option.label}`}
                      value={mode}
                      onChange={event => {
                        const nextMode = event.target.value
                        onChange({
                          ...selections,
                          [dimension.key]: {
                            include: nextMode === 'include' ? [...current.include.filter(value => value !== option.value), option.value] : current.include.filter(value => value !== option.value),
                            exclude: nextMode === 'exclude' ? [...current.exclude.filter(value => value !== option.value), option.value] : current.exclude.filter(value => value !== option.value)
                          }
                        })
                      }}
                      className='min-h-9 rounded-md border border-gray-300 bg-white px-2 text-xs'
                    >
                      <option value='any'>Any</option>
                      <option value='include'>Include</option>
                      <option value='exclude'>Exclude</option>
                    </select>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
