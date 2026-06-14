import Image from 'next/image'

type CareAtlasLogoProps = {
  variant?: 'light' | 'dark'
  compact?: boolean
  className?: string
}

export function CareAtlasLogo({ variant = 'light', compact = false, className = '' }: CareAtlasLogoProps) {
  const isDark = variant === 'dark'
  const titleColor = isDark ? 'text-white' : 'text-gray-950'
  const subtitleColor = isDark ? 'text-blue-light-200' : 'text-brand-700'

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 ${
          isDark ? 'shadow-theme-sm ring-1 ring-white/20' : ''
        }`}
      >
        <Image
          src='/images/logo/care-atlas-logo.svg'
          alt={compact ? 'Care Atlas' : ''}
          aria-hidden={compact ? undefined : true}
          width={48}
          height={47}
          className='h-full w-full object-contain'
          unoptimized
        />
      </span>
      {!compact && (
        <span className='leading-tight'>
          <span className={`block text-lg font-semibold tracking-[0.03em] ${titleColor}`}>CARE ATLAS</span>
          <span className={`block text-xs font-medium ${subtitleColor}`}>Care consultancy and enablement</span>
        </span>
      )}
    </span>
  )
}
