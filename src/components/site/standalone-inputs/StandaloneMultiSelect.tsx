'use client'

import React, { useState, useRef, useEffect } from 'react'

import { randomBlueShade, getContrastColor } from './utils/colorUtils'

import type { MultiSelectOption, AddNewOptionProps, AddOptionRequest, CreatedOptionResponse } from './utils/types'

interface StandaloneMultiSelectProps extends AddNewOptionProps {
  name: string
  value: MultiSelectOption[]
  onChange: (value: MultiSelectOption[]) => void
  options: MultiSelectOption[]
  placeholder?: string
  label?: string
  error?: string
  className?: string
  allowCreate?: boolean
  onCreateOption?: (newOption: MultiSelectOption) => void
  headerAction?: React.ReactNode
}

type ColorPair = {
  pastel: string
  deep: string
}

const colorPairs: ColorPair[] = [
  { pastel: '#E3F2FD', deep: '#1976D2' },
  { pastel: '#E8F4FD', deep: '#1565C0' },
  { pastel: '#E1F5FE', deep: '#0277BD' },
  { pastel: '#F3E5F5', deep: '#512DA8' },
  { pastel: '#E0F2F1', deep: '#00695C' },
  { pastel: '#E8EAF6', deep: '#303F9F' },
  { pastel: '#F1F8E9', deep: '#388E3C' },
  { pastel: '#FFF3E0', deep: '#F57C00' },
  { pastel: '#FCE4EC', deep: '#C2185B' },
  { pastel: '#F9FBE7', deep: '#689F38' },
  { pastel: '#FFF8E1', deep: '#FBC02D' },
  { pastel: '#EFEBE9', deep: '#5D4037' }
]

export function StandaloneMultiSelect({
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  className,
  allowCreate = false,
  onCreateOption,
  enableAddNewOption = false,
  addOptionEndpoint,
  headerAction
}: StandaloneMultiSelectProps) {
  const [searchValue, setSearchValue] = useState('')
  const [listExpanded, setListExpanded] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<MultiSelectOption[]>(options)
  const [localOptions, setLocalOptions] = useState<MultiSelectOption[]>(options)
  const [highlightIndex, setHighlightIndex] = useState<number>(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addBtnBg, setAddBtnBg] = useState<string>(randomBlueShade())
  const [addBtnText, setAddBtnText] = useState<string>(getContrastColor(addBtnBg))
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const messageType = error ? 'error' : 'neutral'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setListExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    debounceRef.current = setTimeout(() => {
      const filtered = localOptions.filter(option => {
        const optionText = option.name || option.label || ''
        const searchText = searchValue || ''

        return optionText.toLowerCase().includes(searchText.toLowerCase())
      })

      setFilteredOptions(filtered)

      if (filtered.length) {
        setHighlightIndex(prev => {
          const next = Math.min(prev, filtered.length - 1)

          return next < 0 ? 0 : next
        })
      } else {
        setHighlightIndex(-1)
      }
    }, 150)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }
  }, [searchValue, localOptions])

  const canShowAddButton = (() => {
    const entered = (searchValue || '').trim()

    if (!entered) return false
    const exists = localOptions.some(opt => (opt.name || opt.label || '').toLowerCase() === entered.toLowerCase())

    return !!enableAddNewOption && listExpanded && !exists && !isAdding
  })()

  useEffect(() => {
    if (listExpanded && canShowAddButton) {
      const bg = randomBlueShade()

      setAddBtnBg(bg)
      setAddBtnText(getContrastColor(bg))
    }
  }, [listExpanded, canShowAddButton])

  const borderColor = {
    error: 'border-red-500',
    warning: 'border-yellow-500',
    success: 'border-green-500',
    neutral: 'border-gray-mediumGray'
  }[messageType]

  const textColor = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    neutral: 'text-gray-600'
  }[messageType]

  const handleRemoveOption = (option: MultiSelectOption) => {
    const updatedValue = value.filter(item => (item.code || item.value) !== (option.code || option.value))

    onChange(updatedValue)
  }

  const toggleDropDown = () => setListExpanded(prev => !prev)

  const handleOptionSelect = (option: MultiSelectOption) => {
    if (option.disabled) return
    const isSelected = value.some(item => (item.code || item.value) === (option.code || option.value))

    if (!isSelected) {
      onChange([...value, option])
    }

    setSearchValue('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === 'ArrowDown') {
      if (!listExpanded) setListExpanded(true)
      setHighlightIndex(prev => {
        const next = prev < 0 ? 0 : Math.min(prev + 1, filteredOptions.length - 1)

        return next
      })
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setHighlightIndex(prev => {
        const next = prev <= 0 ? 0 : prev - 1

        return next
      })
      e.preventDefault()
    } else if (e.key === 'Enter') {
      if (listExpanded && highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
        const opt = filteredOptions[highlightIndex]

        if (opt && !opt.disabled) handleOptionSelect(opt)
      }
    } else if (e.key === 'Escape') {
      setListExpanded(false)
    }
  }

  const buildOptionFromResponse = (resp: CreatedOptionResponse, fallbackName: string): MultiSelectOption => {
    const name = resp.name || resp.label || fallbackName
    const value = resp.value || (resp.id != null ? String(resp.id) : undefined)
    const code = resp.code || fallbackName.toLowerCase().replace(/\s+/g, '-')

    return { name, value, code, image: resp.image }
  }

  const handleAddNewOption = async () => {
    if (!addOptionEndpoint) return
    const name = (searchValue || '').trim()

    if (!name) return
    setIsAdding(true)
    setAddError(null)

    const payload: AddOptionRequest = { name, description: null, is_active: true }

    try {
      const res = await fetch(addOptionEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add option')
      }

      const created: CreatedOptionResponse = data?.data || data
      const newOpt = buildOptionFromResponse(created, name)

      setLocalOptions(prev => [...prev, newOpt])
      onChange([...value, newOpt])
      setSearchValue('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsAdding(false)
    }
  }

  const handleCreateOption = () => {
    if (searchValue.trim() && allowCreate) {
      const newOption: MultiSelectOption = {
        code: searchValue.toLowerCase().replace(/\s+/g, '-'),
        name: searchValue.trim()
      }

      setLocalOptions(prev => [...prev, newOption])
      onChange([...value, newOption])

      if (onCreateOption) {
        onCreateOption(newOption)
      }

      setSearchValue('')
    }
  }

  return (
    <div ref={dropdownRef} className={`relative flex w-full flex-col gap-2 ${className || ''}`}>
      {label && (
        <label
          className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
          htmlFor={name}
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-lg border-2 px-4 py-2.5 ${borderColor} focus-within:border-blue-duskBlue hover:border-blue-duskBlue bg-gray-100 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-blue-400 dark:focus-within:bg-slate-950 dark:hover:border-slate-500`}
      >
        <input
          id={name}
          placeholder={placeholder}
          value={searchValue}
          onClick={() => setListExpanded(true)}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className='text-gray-mediumGray focus:text-black-textBlack w-full border-none bg-transparent focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:text-white'
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-expanded={listExpanded}
          aria-haspopup='listbox'
          aria-controls={`${name}-listbox`}
          aria-activedescendant={
            listExpanded && highlightIndex >= 0 && highlightIndex < filteredOptions.length
              ? `${name}-option-${highlightIndex}`
              : undefined
          }
          role='combobox'
          autoComplete='off'
        />
        {canShowAddButton && (
          <button
            type='button'
            onClick={handleAddNewOption}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleAddNewOption()
            }}
            className='ml-2 rounded-md px-2 py-1 text-xs font-medium hover:opacity-90 focus:ring-2 focus:outline-none'
            aria-label='Add new option'
            style={{ backgroundColor: addBtnBg, color: addBtnText }}
            disabled={isAdding}
          >
            {isAdding ? 'Adding…' : `+ add: "${searchValue}"`}
          </button>
        )}
        <button type='button' onClick={toggleDropDown} aria-label='Toggle Dropdown'>
          <svg className='text-gray-mediumGray h-5 w-5 dark:text-slate-300' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d={
                listExpanded
                  ? 'M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  : 'M14.707 10.707a1 1 0 01-1.414 0L10 7.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
              }
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>

      <div className='mt-2 flex flex-wrap gap-2'>
        {value.map((option: MultiSelectOption, index: number) => {
          const colors = colorPairs[index % colorPairs.length]

          return (
            <div
              key={option.code || option.value}
              className='flex items-center gap-2 rounded-full px-3 py-1.5'
              style={{
                backgroundColor: colors.pastel,
                color: colors.deep
              }}
            >
              {option.image && option.image.trim() !== '' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={option.image} alt={option.name || option.label || ''} className='h-4 w-4 rounded-full' />
              )}
              <span className='text-sm font-medium'>{option.name || option.label}</span>
              <button
                type='button'
                onClick={() => handleRemoveOption(option)}
                className='transition-opacity hover:opacity-75'
                style={{ color: colors.deep }}
                aria-label='Remove item'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {listExpanded && (
        <div
          id={`${name}-listbox`}
          className='absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900'
          role='listbox'
        >
          {headerAction && (
            <div className='border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800'>
              {headerAction}
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => {
              const isSelected = value.some(item => (item.code || item.value) === (option.code || option.value))
              const isDisabled = Boolean(option.disabled)
              const isActive = idx === highlightIndex

              return (
                <button
                  key={option.code || option.value}
                  type='button'
                  onClick={() => handleOptionSelect(option)}
                  disabled={isDisabled}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  id={`${name}-option-${idx}`}
                  role='option'
                  aria-selected={isSelected}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left ${
                    isSelected
                      ? 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300'
                      : isDisabled
                        ? 'cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-slate-800 dark:text-slate-500'
                        : isActive
                          ? 'bg-blue-50 text-gray-900 dark:bg-blue-500/15 dark:text-blue-200'
                          : 'text-gray-900 hover:bg-gray-100 dark:text-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {option.image && option.image.trim() !== '' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={option.image} alt={option.name || option.label || ''} className='h-4 w-4 rounded-full' />
                  )}
                  <div className='min-w-0'>
                    <div>{option.name || option.label}</div>
                    {option.description ? <div className='text-xs opacity-80'>{option.description}</div> : null}
                  </div>
                  {isSelected && (
                    <svg className='ml-auto h-4 w-4 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                  {!isSelected && isDisabled ? <span className='ml-auto text-xs uppercase'>Unavailable</span> : null}
                </button>
              )
            })
          ) : (
            <>
              {allowCreate && searchValue.trim() ? (
                <button
                  type='button'
                  onClick={handleCreateOption}
                  className='flex w-full items-center gap-2 border-t border-gray-200 px-4 py-2 text-left text-green-700 hover:bg-green-50 dark:border-slate-700 dark:text-green-300 dark:hover:bg-green-500/10'
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                  <span>Create &quot;{searchValue}&quot;</span>
                </button>
              ) : (
                <div className='px-4 py-2 text-gray-500 dark:text-slate-400'>No options found</div>
              )}
            </>
          )}
          {allowCreate &&
            searchValue.trim() &&
            filteredOptions.length > 0 &&
            !filteredOptions.some(
              option => (option.name || option.label || '').toLowerCase() === searchValue.toLowerCase()
            ) && (
              <button
                type='button'
                onClick={handleCreateOption}
                className='flex w-full items-center gap-2 border-t border-gray-200 px-4 py-2 text-left text-green-700 hover:bg-green-50 dark:border-slate-700 dark:text-green-300 dark:hover:bg-green-500/10'
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                <span>Create &quot;{searchValue}&quot;</span>
              </button>
            )}
        </div>
      )}

      {(error || addError) && (
        <p id={`${name}-error`} className={`text-xs font-medium ${textColor}`} role='alert'>
          {error || addError}
          {addError && (
            <button type='button' className='ml-2 underline' onClick={handleAddNewOption}>
              Retry
            </button>
          )}
        </p>
      )}
    </div>
  )
}
