'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useHalfScreenModal } from '@/context/HalfScreenModalContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import { SiteIcon } from './SiteIcon'

const EXPANDED_WIDTH = 'min(100vw, 1120px)'

const OPENED_LIVE_TEXT = 'Tender details sheet opened'
const MINIMIZED_LIVE_TEXT = 'Sheet minimized, tap the title bar to expand'
const EXPANDED_LIVE_TEXT = 'Sheet expanded to full height'
const CLOSED_LIVE_TEXT = 'Sheet closed'

export function HalfScreenModal() {
  const { isOpen, data, template, width, headerConfig, sheetSnap, closeModal, minimizeModal, maximizeModal } =
    useHalfScreenModal()
  const isDesktop = useMediaQuery('(min-width: 768px)', { ssrDefault: true })
  const [isExpanded, setIsExpanded] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMinimizeButtonRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const lastAnnouncedSnap = useRef<string>('')

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
      return
    }

    if (!openerRef.current) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    }

    if (isDesktop) {
      closeButtonRef.current?.focus()
    } else {
      mobileMinimizeButtonRef.current?.focus()
    }
  }, [isOpen, isDesktop])

  useEffect(() => {
    if (!liveRegionRef.current || !isOpen) return
    if (sheetSnap === lastAnnouncedSnap.current) return
    lastAnnouncedSnap.current = sheetSnap ?? ''
    if (sheetSnap === 'expanded') {
      liveRegionRef.current.textContent =
        lastAnnouncedSnap.current === 'minimized' ? EXPANDED_LIVE_TEXT : OPENED_LIVE_TEXT
    } else if (sheetSnap === 'minimized') {
      liveRegionRef.current.textContent = MINIMIZED_LIVE_TEXT
    } else if (sheetSnap === 'closed') {
      liveRegionRef.current.textContent = CLOSED_LIVE_TEXT
    }
  }, [sheetSnap, isOpen])

  useEffect(() => {
    if (isOpen) return
    const id = window.setTimeout(() => {
      openerRef.current?.focus?.()
      openerRef.current = null
      lastAnnouncedSnap.current = ''
    }, 320)
    return () => window.clearTimeout(id)
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
  const subtitleId = template && headerConfig?.subtitle ? `${template.id}-half-screen-subtitle` : undefined

  if (!template || !TemplateComponent || !data) {
    return <div ref={liveRegionRef} aria-live='polite' aria-atomic='true' className='sr-only' />
  }

  const handleBackdropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (!isDesktop) {
      event.preventDefault()
      minimizeModal()
    }
  }

  const toggleMobileSnap = () => {
    if (sheetSnap === 'minimized') maximizeModal()
    else minimizeModal()
  }

  const mobileTranslateClass = (() => {
    if (!isOpen || sheetSnap === 'closed') return 'translate-y-full'
    if (sheetSnap === 'minimized') return 'translate-y-[calc(100%-8dvh)]'
    return 'translate-y-[15%]'
  })()

  const describedByIds = [subtitleId].filter(Boolean).join(' ') || undefined

  return (
    <>
      <div ref={liveRegionRef} aria-live='polite' aria-atomic='true' className='sr-only' />
      {!isDesktop && isOpen && (
        <div
          aria-hidden='true'
          onMouseDown={handleBackdropMouseDown}
          onClick={handleBackdropMouseDown as unknown as React.MouseEventHandler<HTMLDivElement>}
          className='pointer-events-auto fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 motion-reduce:duration-0'
        />
      )}
      {isDesktop ? (
        <div
          className='pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex justify-end'
          style={{
            top: 'var(--site-header-height, 72px)'
          }}
        >
          <section
            role='dialog'
            aria-labelledby={titleId}
            aria-describedby={describedByIds}
            aria-hidden={!isOpen}
            className={`pointer-events-auto flex h-full max-w-full transform flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:!duration-0 ${
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
                {headerConfig?.subtitle && (
                  <p id={subtitleId} className='mt-1 text-sm text-gray-500'>
                    {headerConfig.subtitle}
                  </p>
                )}
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
      ) : (
        <div className='pointer-events-none fixed inset-0 z-50' onMouseDown={handleBackdropMouseDown}>
          <section
            role='dialog'
            aria-modal='true'
            aria-labelledby={titleId}
            aria-describedby={describedByIds}
            aria-hidden={!isOpen}
            className={`pointer-events-auto absolute right-0 bottom-0 left-0 flex max-h-[85dvh] w-full flex-col overflow-hidden border-t border-gray-200 bg-white shadow-2xl transition-transform motion-reduce:!duration-0 ${mobileTranslateClass}`}
            style={{
              height: '85dvh',
              transitionDuration:
                sheetSnap === 'closed'
                  ? '250ms'
                  : sheetSnap === 'minimized' || lastAnnouncedSnap.current === 'minimized'
                    ? '300ms'
                    : '350ms',
              transitionTimingFunction: sheetSnap === 'closed' ? 'ease-in' : 'cubic-bezier(0.22, 1, 0.36, 1)',
              borderRadius: '1rem 1rem 0 0'
            }}
          >
            <header
              className={`flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 ${sheetSnap === 'minimized' ? 'cursor-pointer' : ''}`}
              onClick={sheetSnap === 'minimized' ? toggleMobileSnap : undefined}
              role={sheetSnap === 'minimized' ? 'button' : undefined}
              tabIndex={sheetSnap === 'minimized' ? 0 : undefined}
              onKeyDown={event => {
                if (sheetSnap !== 'minimized') return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleMobileSnap()
                }
              }}
            >
              <div className='min-w-0 flex-1'>
                <div className='mx-auto mb-2 h-1.5 w-12 rounded-full bg-gray-300 md:hidden' aria-hidden='true' />
                <p className='text-brand-600 text-[10px] font-semibold tracking-[0.08em] uppercase md:hidden'>
                  Tender support
                </p>
                <h2
                  id={titleId}
                  className={`text-lg font-semibold text-gray-950 ${sheetSnap === 'minimized' ? 'line-clamp-1' : 'truncate'}`}
                >
                  {headerConfig?.title ?? 'Tender details'}
                </h2>
                {headerConfig?.subtitle && sheetSnap !== 'minimized' && (
                  <p id={subtitleId} className='mt-1 truncate text-sm text-gray-500'>
                    {headerConfig.subtitle}
                  </p>
                )}
              </div>
              <div className='flex shrink-0 items-center gap-2'>
                <button
                  ref={mobileMinimizeButtonRef}
                  type='button'
                  onClick={toggleMobileSnap}
                  className='focus:ring-brand-500/10 inline-flex min-h-11 min-w-[92px] items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus:ring-4 focus:outline-hidden'
                  aria-label={sheetSnap === 'minimized' ? 'Expand sheet' : 'Minimize sheet'}
                >
                  {sheetSnap === 'minimized' ? (
                    <SiteIcon name='expandOut' className='h-4 w-4' />
                  ) : (
                    <SiteIcon name='expandIn' className='h-4 w-4' />
                  )}
                  <span>{sheetSnap === 'minimized' ? 'Expand' : 'Minimize'}</span>
                </button>
                <button
                  type='button'
                  onClick={closeModal}
                  className='focus:ring-brand-500/10 inline-flex min-h-11 min-w-[76px] items-center justify-center gap-1.5 rounded-lg bg-gray-100 px-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 focus:ring-4 focus:outline-hidden'
                  aria-label='Exit and close tender details'
                >
                  <SiteIcon name='close' className='h-4 w-4' />
                  <span>Exit</span>
                </button>
              </div>
            </header>

            {sheetSnap !== 'minimized' && (
              <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
                <TemplateComponent data={data} onClose={closeModal} />
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}
