'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useHalfScreenModal } from '@/context/HalfScreenModalContext'

import { SiteIcon } from './SiteIcon'

const EXPANDED_WIDTH = 'min(100vw, 1120px)'

/**
 * Site half-screen drawer patterned after the ODF portal modal:
 * - provider-driven open/close lifecycle
 * - fixed z-axis layer with independent scroll from the underlying page
 * - non-blocking shell so the tender board remains usable while open
 */
export function HalfScreenModal() {
  const { isOpen, data, template, width, headerConfig, closeModal } = useHalfScreenModal()
  const [isExpanded, setIsExpanded] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
      return
    }

    closeButtonRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeModal, isOpen])

  const TemplateComponent = useMemo(() => template?.component ?? null, [template])
  const modalWidth = isExpanded ? EXPANDED_WIDTH : width
  const titleId = template ? `${template.id}-half-screen-title` : undefined

  if (!template || !TemplateComponent || !data) {
    return null
  }

  return (
    <div
      className='pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex justify-end'
      style={{
        top: 'var(--site-header-height, 72px)'
      }}
    >
      <section
        role='dialog'
        aria-labelledby={titleId}
        aria-hidden={!isOpen}
        className={`pointer-events-auto flex h-full max-w-full transform flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          width: modalWidth,
          height: 'calc(100dvh - var(--site-header-height, 72px))'
        }}
      >
        <header className='flex items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-4 py-4 md:px-6'>
          <div className='min-w-0'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Tender support</p>
            <h2 id={titleId} className='mt-1 truncate text-xl font-semibold text-gray-950'>
              {headerConfig?.title ?? 'Tender details'}
            </h2>
            {headerConfig?.subtitle && <p className='mt-1 text-sm text-gray-500'>{headerConfig.subtitle}</p>}
          </div>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={() => setIsExpanded(current => !current)}
              className='focus:ring-brand-500/10 rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:outline-hidden'
              aria-label={isExpanded ? 'Minimize drawer' : 'Expand drawer'}
            >
              {isExpanded ? (
                <SiteIcon name='expandIn' className='h-5 w-5' />
              ) : (
                <SiteIcon name='expandOut' className='h-5 w-5' />
              )}
            </button>
            <button
              ref={closeButtonRef}
              type='button'
              onClick={closeModal}
              className='focus:ring-brand-500/10 rounded-lg p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:outline-hidden'
              aria-label='Close tender details'
            >
              <SiteIcon name='close' className='h-5 w-5' />
            </button>
          </div>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto'>
          <TemplateComponent data={data} onClose={closeModal} />
        </div>
      </section>
    </div>
  )
}
