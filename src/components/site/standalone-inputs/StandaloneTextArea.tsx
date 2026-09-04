'use client'

import React from 'react'

import { SiteIcon } from '../SiteIcon'

interface StandaloneTextAreaProps {
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
  rows?: number
  required?: boolean
  disabled?: boolean
  minLength?: number
  maxLength?: number
}

export function StandaloneTextArea({
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  className,
  rows = 4,
  disabled,
  required,
  minLength,
  maxLength
}: StandaloneTextAreaProps) {
  const messageType = error ? 'error' : 'neutral'

  const borderColor = {
    error: 'border-red-500 focus:border-red-500',
    warning: 'border-yellow-500 focus:border-yellow-500',
    success: 'border-green-500 focus:border-green-500',
    neutral: 'border-gray-mediumGray focus:border-blue-duskBlue'
  }[messageType]

  const textColor = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    neutral: 'text-mediumGray'
  }[messageType]

  return (
    <div className={`flex flex-grow flex-col gap-2 ${className || ''}`}>
      <label
        htmlFor={name}
        className='font-neue text-gray-mediumGray text-xs font-semibold uppercase dark:text-slate-300'
      >
        {required && <span className='mr-1 text-red-500'>*</span>}
        {label || name}
      </label>
      <div className='relative'>
        <textarea
          id={name}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          className={`flex min-h-[120px] w-full items-center rounded-lg border-2 px-4 py-2.5 ${borderColor} text-gray-mediumGray focus:text-black-textBlack hover:border-blue-duskBlue bg-gray-100 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:text-white ${error ? 'hover:border-red-500' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''} resize-y`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <div className='pointer-events-none absolute top-3 right-3'>
            <SiteIcon name='alertCircle' className='h-5 w-5 text-red-500' />
          </div>
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
