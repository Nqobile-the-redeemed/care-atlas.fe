'use client'

import React from 'react'

import { SiteIcon } from '../SiteIcon'

interface StandaloneTextInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: string
  error?: string
  className?: string
  required?: boolean
  valueType?: 'gbp' | 'percentage' | 'unit'
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
}

export function StandaloneTextInput({
  name,
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  error,
  className,
  valueType,
  min,
  max,
  step,
  disabled,
  readOnly,
  required,
  autoComplete
}: StandaloneTextInputProps) {
  const messageType = error ? 'error' : 'neutral'

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
    neutral: 'text-mediumGray'
  }[messageType]

  const isNumeric = !!valueType
  const isDateLike = type === 'date' || type === 'datetime-local'

  const formatValue = (val: number | string): string => {
    if (!isNumeric) return String(val)

    const num = Number(val)
    if (isNaN(num)) return String(val)

    if (valueType === 'gbp') return num.toFixed(2)
    if (valueType === 'percentage') return num.toFixed(1)
    return Math.round(num).toString()
  }

  const getSuffix = () => {
    if (valueType === 'gbp') return ' GBP'
    if (valueType === 'percentage') return '%'
    return ''
  }

  const handleIncrement = () => {
    const current = parseFloat(value) || 0
    const effectiveStep = step || (valueType === 'gbp' ? 1 : valueType === 'percentage' ? 0.5 : 1)
    let next = current + effectiveStep

    const effectiveMax = max !== undefined ? max : valueType === 'percentage' ? 100 : undefined
    if (effectiveMax !== undefined && next > effectiveMax) next = effectiveMax

    onChange(formatValue(next))
  }

  const handleDecrement = () => {
    const current = parseFloat(value) || 0
    const effectiveStep = step || (valueType === 'gbp' ? 1 : valueType === 'percentage' ? 0.5 : 1)
    let next = current - effectiveStep

    const effectiveMin = min !== undefined ? min : 0
    if (next < effectiveMin) next = effectiveMin

    onChange(formatValue(next))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (!isNumeric) {
      onChange(rawValue)
      return
    }

    if (rawValue === '') {
      onChange('')
      return
    }

    if (/^-?\d*\.?\d*$/.test(rawValue)) {
      onChange(rawValue)
    }
  }

  const handleBlur = () => {
    if (isNumeric && value !== '') {
      let num = parseFloat(value)
      if (!isNaN(num)) {
        const effectiveMin = min !== undefined ? min : 0
        const effectiveMax = max !== undefined ? max : valueType === 'percentage' ? 100 : undefined

        if (num < effectiveMin) num = effectiveMin
        if (effectiveMax !== undefined && num > effectiveMax) num = effectiveMax

        onChange(formatValue(num))
      }
    }
  }

  return (
    <div className={`flex flex-grow flex-col gap-2 ${className || ''}`}>
      <label
        htmlFor={name}
        className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
      >
        {required && <span className='mr-1 text-red-500'>*</span>}
        {label || name}
      </label>

      <div
        className={`relative flex items-center rounded-lg border-2 transition-colors ${borderColor} text-gray-mediumGray focus-within:text-black-textBlack hover:border-blue-duskBlue bg-gray-100 focus-within:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-within:border-blue-400 dark:focus-within:bg-slate-950 dark:focus-within:text-white dark:hover:border-slate-500 ${error ? 'hover:border-red-500' : ''}`}
      >
        {isNumeric && (
          <button
            type='button'
            onClick={handleDecrement}
            className={`p-3 text-gray-500 hover:text-blue-600 focus:outline-none dark:text-slate-400 dark:hover:text-blue-300 ${error ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300' : ''}`}
            aria-label={`Decrease ${label || name}`}
            disabled={disabled || readOnly}
          >
            <SiteIcon name='minus' className='h-4 w-4' />
          </button>
        )}

        <div className='relative flex flex-1 items-center justify-center'>
          <input
            id={name}
            type={isNumeric ? 'text' : type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoComplete={autoComplete}
            className={`w-full border-none bg-transparent py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500 ${isNumeric ? 'pl-2 text-center' : 'px-4'} ${isNumeric && getSuffix() ? 'pr-12' : isNumeric ? 'pr-2' : 'px-4'} ${isDateLike ? 'accent-blue-600 dark:[color-scheme:dark]' : ''} ${error ? 'pr-10' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : readOnly ? 'cursor-default' : ''} `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
            aria-label={isNumeric ? `${label || name} in ${valueType === 'gbp' ? 'GBP' : valueType}` : undefined}
          />
          {error && !isNumeric && (
            <div className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2'>
              <SiteIcon name='alertCircle' className='h-5 w-5 text-red-500' />
            </div>
          )}
          {isNumeric && getSuffix() && (
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-500 select-none dark:text-slate-400'>
              {getSuffix()}
            </span>
          )}
        </div>

        {isNumeric && (
          <button
            type='button'
            onClick={handleIncrement}
            className={`p-3 text-gray-500 hover:text-blue-600 focus:outline-none dark:text-slate-400 dark:hover:text-blue-300 ${error ? 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300' : ''}`}
            aria-label={`Increase ${label || name}`}
            disabled={disabled || readOnly}
          >
            <SiteIcon name='plus' className='h-4 w-4' />
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className={`text-sm ${textColor} flex items-center gap-1`}
          role='alert'
          aria-live='polite'
        >
          <SiteIcon name='alertCircle' className='h-3 w-3' />
          {error}
        </p>
      )}
    </div>
  )
}
