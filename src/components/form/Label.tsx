import React, { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { formatInputLabel } from '@/lib/formatInputLabel'

interface LabelProps {
  htmlFor?: string
  children: ReactNode
  className?: string
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  const content = typeof children === 'string' ? formatInputLabel(children) : children

  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        // Default classes that apply by default
        'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',

        // User-defined className that can override the default margin
        className
      )}
    >
      {content}
    </label>
  )
}

export default Label
