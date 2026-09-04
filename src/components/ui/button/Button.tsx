import React, { ReactNode } from 'react'
import { buttonStyles } from '@/components/site/ui'

interface ButtonProps {
  children: ReactNode // Button text or content
  size?: 'sm' | 'md' // Button size
  variant?: 'primary' | 'outline' // Button variant
  startIcon?: ReactNode // Icon before the text
  endIcon?: ReactNode // Icon after the text
  onClick?: () => void // Click handler
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  fullWidth?: boolean
  disabled?: boolean // Disabled state
  className?: string // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  loading = false,
  fullWidth = false,
  className = '',
  disabled = false
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={buttonStyles({
        variant: variant === 'outline' ? 'secondary' : 'primary',
        size,
        fullWidth,
        className
      })}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : undefined}
    >
      {(loading || startIcon) && (
        <span className='flex min-w-4 items-center justify-center'>
          {loading ? (
            <span
              aria-hidden='true'
              className='h-4 w-4 rounded-full border-2 border-current border-r-transparent opacity-80 motion-safe:animate-spin'
            />
          ) : (
            startIcon
          )}
        </span>
      )}
      <span>{children}</span>
      {endIcon && !loading && <span className='flex min-w-4 items-center justify-center'>{endIcon}</span>}
    </button>
  )
}

export default Button
