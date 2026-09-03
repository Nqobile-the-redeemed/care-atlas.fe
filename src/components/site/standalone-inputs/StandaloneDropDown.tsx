'use client'

import React, { useState, useRef, useEffect } from 'react'

import { randomBlueShade, getContrastColor } from './utils/colorUtils'
import { SiteIcon } from '../SiteIcon'

import type { Option } from './utils/types'
import type { AddNewOptionProps, AddOptionRequest, CreatedOptionResponse } from './utils/types'

interface StandaloneDropDownProps extends AddNewOptionProps {
  name: string
  value: string | number
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  label?: string
  error?: string
  className?: string
  disabled?: boolean
  allowCreate?: boolean
  onCreateOption?: (newOption: Option) => void
  required?: boolean
}

export function StandaloneDropDown({
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  className,
  disabled,
  allowCreate = false,
  onCreateOption,
  enableAddNewOption = false,
  addOptionEndpoint
}: StandaloneDropDownProps) {
  const [searchValue, setSearchValue] = useState('')
  const [listExpanded, setListExpanded] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options)
  const [localOptions, setLocalOptions] = useState<Option[]>(options)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addBtnBg, setAddBtnBg] = useState<string>(randomBlueShade())
  const [addBtnText, setAddBtnText] = useState<string>(getContrastColor(addBtnBg))

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
    const filtered = localOptions.filter(option => {
      const optionText = option.name || option.label || ''
      const searchText = searchValue || ''

      return optionText.toLowerCase().includes(searchText.toLowerCase())
    })

    setFilteredOptions(filtered)
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
    error: 'border-red-500 focus-within:border-red-500',
    warning: 'border-yellow-500 focus-within:border-yellow-500',
    success: 'border-green-500 focus-within:border-green-500',
    neutral: 'border-gray-mediumGray focus-within:border-blue-duskBlue'
  }[messageType]

  const textColor = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    neutral: 'text-gray-600'
  }[messageType]

  const selectedOption = localOptions.find(
    option => String(option.code || option.name || option.value || '') === String(value)
  )
  const displayValue = selectedOption
    ? selectedOption.name || selectedOption.label || selectedOption.code || selectedOption.value
    : ''

  const toggleDropDown = () => setListExpanded(prev => !prev)

  const handleOptionSelect = (option: Option) => {
    if (disabled) return
    const selectedValue = option.value || option.code || option.name || ''

    onChange(String(selectedValue))
    setSearchValue('')
    setListExpanded(false)
  }

  const handleCreateOption = () => {
    if (searchValue.trim() && allowCreate) {
      const newOption: Option = {
        code: searchValue.toLowerCase().replace(/\s+/g, '-'),
        name: searchValue.trim()
      }

      setLocalOptions(prev => [...prev, newOption])
      onChange(newOption.code || newOption.name || '')

      if (onCreateOption) {
        onCreateOption(newOption)
      }

      setSearchValue('')
      setListExpanded(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    setSearchValue(e.target.value)
    if (!listExpanded) {
      setListExpanded(true)
    }
  }

  const buildOptionFromResponse = (resp: CreatedOptionResponse, fallbackName: string): Option => {
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
      const selectedValue = newOpt.value || newOpt.code || newOpt.name || ''

      onChange(String(selectedValue))
      setSearchValue('')
      setListExpanded(false)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div ref={dropdownRef} className={`relative flex w-full flex-col gap-2 ${className || ''}`}>
      <label
        className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
        htmlFor={name}
      >
        {label || name}
      </label>

      <div
        className={`flex min-h-11 items-center rounded-lg border-2 px-4 py-2.5 ${borderColor} focus-within:text-black-textBlack hover:border-blue-duskBlue bg-gray-100 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-within:border-blue-400 dark:focus-within:bg-slate-950 dark:focus-within:text-white dark:hover:border-slate-500 ${error ? 'hover:border-red-500' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input
          id={name}
          placeholder={placeholder || 'Select an option'}
          value={listExpanded ? searchValue : displayValue}
          onClick={() => {
            if (disabled) return
            setListExpanded(true)
          }}
          onChange={handleInputChange}
          className='text-gray-mediumGray focus:text-black-textBlack w-full border-none bg-transparent focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:text-white'
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-expanded={listExpanded}
          aria-haspopup='listbox'
          aria-controls={`${name}-listbox`}
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
        <button
          type='button'
          onClick={disabled ? () => undefined : toggleDropDown}
          aria-label='Toggle Dropdown'
          disabled={disabled}
        >
          <SiteIcon
            name={listExpanded ? 'expandIn' : 'expandOut'}
            className='text-gray-mediumGray h-5 w-5 dark:text-slate-300'
          />
        </button>
      </div>

      {selectedOption && !listExpanded && (
        <div className='mt-2 flex flex-wrap gap-2'>
          <div className='flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200'>
            {selectedOption.image && selectedOption.image.trim() !== '' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedOption.image}
                alt={selectedOption.name || selectedOption.label || ''}
                className='h-4 w-4 rounded-full'
              />
            )}
            <span className='text-sm font-medium'>{selectedOption.name || selectedOption.label}</span>
          </div>
        </div>
      )}

      {listExpanded && (
        <div
          id={`${name}-listbox`}
          className='absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-900'
          role='listbox'
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => {
              const isSelected = String(option.value || option.name || option.code || '') === String(value)

              return (
                <button
                  key={String(option.code || option.value || option.name || '')}
                  type='button'
                  onClick={() => handleOptionSelect(option)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-800 ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-200'
                      : 'text-gray-900 dark:text-slate-100'
                  }`}
                >
                  {option.image && option.image.trim() !== '' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={option.image} alt={option.name || option.label || ''} className='h-4 w-4 rounded-full' />
                  )}
                  <span>{option.name || option.label}</span>
                  {isSelected && <SiteIcon name='check' className='ml-auto h-4 w-4 text-blue-600' />}
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
                  <SiteIcon name='plus' className='h-4 w-4' />
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
                <SiteIcon name='plus' className='h-4 w-4' />
                <span>Create &quot;{searchValue}&quot;</span>
              </button>
            )}
        </div>
      )}

      {(error || addError) && (
        <p
          id={`${name}-error`}
          className={`text-xs font-medium ${textColor} flex items-center gap-1`}
          role='alert'
          aria-live='polite'
        >
          <SiteIcon name='alertCircle' className='h-3 w-3' />
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
