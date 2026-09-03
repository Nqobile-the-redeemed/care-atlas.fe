'use client'

import React from 'react'

interface StandaloneEmailInputProps {
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export function StandaloneEmailInput({
  name,
  value,
  onChange,
  placeholder = 'Enter your email address',
  label = 'Email',
  error,
  className,
  required,
  disabled
}: StandaloneEmailInputProps) {
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
        {label}
      </label>
      <input
        id={name}
        type='email'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`flex min-h-11 items-center rounded-lg border-2 px-4 py-2.5 ${borderColor} text-gray-mediumGray focus:text-black-textBlack focus:border-blue-duskBlue hover:border-blue-duskBlue bg-gray-100 placeholder:text-slate-400 focus:bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:text-white ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete='email'
      />
      {error && (
        <p id={`${name}-error`} className={`text-sm ${textColor}`} role='alert' aria-live='polite'>
          {error}
        </p>
      )}
    </div>
  )
}
