'use client'

import React from 'react'

interface CheckboxOption {
  code: string
  name: string
}

interface StandaloneMultiSelectCheckboxProps {
  name: string
  selectedValues: string[]
  onChange: (selectedValues: string[]) => void
  options: CheckboxOption[]
  label?: string
  error?: string
  className?: string
  maxHeight?: string
}

export function StandaloneMultiSelectCheckbox({
  name,
  selectedValues,
  onChange,
  options,
  label,
  error,
  className,
  maxHeight = 'max-h-40'
}: StandaloneMultiSelectCheckboxProps) {
  const messageType = error ? 'error' : 'neutral'

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
    neutral: 'text-mediumGray'
  }[messageType]

  const handleOptionToggle = (optionCode: string) => {
    if (selectedValues.includes(optionCode)) {
      onChange(selectedValues.filter(code => code !== optionCode))
    } else {
      onChange([...selectedValues, optionCode])
    }
  }

  return (
    <div className={`flex flex-grow flex-col gap-2 ${className || ''}`}>
      <label
        htmlFor={name}
        className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
      >
        {label || name}
      </label>

      <div
        className={`space-y-2 ${maxHeight} overflow-y-auto border-2 ${borderColor} focus-within:border-blue-duskBlue hover:border-blue-duskBlue rounded-lg bg-gray-100 p-3 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:focus-within:border-blue-400 dark:focus-within:bg-slate-950 dark:hover:border-slate-500`}
        role='group'
        aria-labelledby={name}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.length > 0 ? (
          options.map(option => (
            <label
              key={option.code}
              className='flex cursor-pointer items-center gap-2 rounded p-1 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700'
            >
              <input
                type='checkbox'
                checked={selectedValues.includes(option.code)}
                onChange={() => handleOptionToggle(option.code)}
                className='text-blue-duskBlue focus:ring-blue-duskBlue rounded border-gray-300 focus:ring-2 dark:border-slate-600 dark:bg-slate-900'
                aria-describedby={`${name}-${option.code}-label`}
              />
              <span
                id={`${name}-${option.code}-label`}
                className='text-gray-mediumGray hover:text-black-textBlack text-sm transition-colors dark:text-slate-200 dark:hover:text-white'
              >
                {option.name}
              </span>
            </label>
          ))
        ) : (
          <div className='py-2 text-center text-sm text-gray-500 dark:text-slate-400'>No options available</div>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className={`text-sm ${textColor}`} role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}
