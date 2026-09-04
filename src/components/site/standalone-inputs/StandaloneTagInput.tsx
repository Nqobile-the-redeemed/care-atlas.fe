'use client'

import React, { useState, KeyboardEvent } from 'react'

import { SiteIcon } from '../SiteIcon'

interface StandaloneTagInputProps {
  name: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
}

export function StandaloneTagInput({
  name,
  value = [],
  onChange,
  placeholder = 'Type and press Enter...',
  label,
  error,
  className
}: StandaloneTagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const addTag = () => {
    const trimmedInput = inputValue.trim().replace(/,/g, '')
    if (trimmedInput && !value.includes(trimmedInput)) {
      onChange([...value, trimmedInput])
      setInputValue('')
    }
  }

  const removeTag = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const borderColor = error ? 'border-red-500' : 'border-gray-mediumGray dark:border-slate-600'
  const textColor = error ? 'text-red-500' : 'text-gray-600 dark:text-slate-300'

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && (
        <label
          htmlFor={name}
          className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-lg border-2 px-4 py-2.5 ${borderColor} focus-within:border-blue-duskBlue hover:border-blue-duskBlue bg-gray-100 transition-colors focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-blue-400 dark:focus-within:bg-slate-950 dark:hover:border-slate-500`}
      >
        <input
          id={name}
          type='text'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className='text-gray-mediumGray focus:text-black-textBlack w-full border-none bg-transparent placeholder-gray-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:text-white'
        />
      </div>

      {value.length > 0 && (
        <div className='mt-1 flex flex-wrap gap-2'>
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 dark:bg-blue-500/20 dark:text-blue-200'
            >
              {tag}
              <button
                type='button'
                onClick={() => removeTag(index)}
                className='ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none dark:hover:bg-blue-500/20 dark:hover:text-blue-200'
              >
                <SiteIcon name='close' className='h-3 w-3' />
                <span className='sr-only'>Remove {tag}</span>
              </button>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p id={`${name}-error`} className={`text-xs font-medium ${textColor}`} role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
