'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

type ModalHeaderConfig = {
  title?: string
  subtitle?: string
}

export interface ModalTemplate<TData = unknown> {
  id: string
  component: React.ComponentType<{
    data: TData
    onClose: () => void
  }>
  headerConfig?: ModalHeaderConfig
}

export type SheetSnap = 'expanded' | 'minimized' | 'closed' | null

type HalfScreenModalState = {
  isOpen: boolean
  data: unknown | null
  template: ModalTemplate | null
  width: string
  headerConfig?: ModalHeaderConfig
  sheetSnap: SheetSnap
}

type HalfScreenModalContextProps = HalfScreenModalState & {
  openModal: <TData>(
    data: TData,
    template: ModalTemplate<TData>,
    options?: {
      width?: string
      headerConfig?: ModalHeaderConfig
    }
  ) => void
  closeModal: () => void
  minimizeModal: () => void
  maximizeModal: () => void
  updateModalData: <TData>(data: TData) => void
  setModalWidth: (width: string) => void
}

const CLOSE_ANIMATION_MS = 300
const DEFAULT_MODAL_WIDTH = 'min(100vw, 760px)'

const HalfScreenModalContext = createContext<HalfScreenModalContextProps | undefined>(undefined)

export function HalfScreenModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<HalfScreenModalState>({
    isOpen: false,
    data: null,
    template: null,
    width: DEFAULT_MODAL_WIDTH,
    headerConfig: undefined,
    sheetSnap: null
  })
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const openModal = useCallback(
    <TData,>(
      data: TData,
      template: ModalTemplate<TData>,
      options?: {
        width?: string
        headerConfig?: ModalHeaderConfig
      }
    ) => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }

      setModalState({
        isOpen: true,
        data,
        template: template as ModalTemplate,
        width: options?.width ?? DEFAULT_MODAL_WIDTH,
        headerConfig: options?.headerConfig ?? template.headerConfig,
        sheetSnap: 'expanded'
      })
    },
    []
  )

  const closeModal = useCallback(() => {
    setModalState(prevState => ({
      ...prevState,
      isOpen: false,
      sheetSnap: 'closed'
    }))

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = setTimeout(() => {
      setModalState(prevState => ({
        ...prevState,
        data: null,
        template: null,
        headerConfig: undefined,
        sheetSnap: null
      }))
      closeTimeoutRef.current = null
    }, CLOSE_ANIMATION_MS)
  }, [])

  const minimizeModal = useCallback(() => {
    setModalState(prevState => {
      if (!prevState.isOpen || prevState.sheetSnap === 'closed') return prevState
      return { ...prevState, sheetSnap: 'minimized' }
    })
  }, [])

  const maximizeModal = useCallback(() => {
    setModalState(prevState => {
      if (!prevState.isOpen || prevState.sheetSnap === 'closed') return prevState
      return { ...prevState, sheetSnap: 'expanded' }
    })
  }, [])

  const updateModalData = useCallback(<TData,>(data: TData) => {
    setModalState(prevState => ({
      ...prevState,
      data
    }))
  }, [])

  const setModalWidth = useCallback((width: string) => {
    setModalState(prevState => ({
      ...prevState,
      width
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...modalState,
      openModal,
      closeModal,
      minimizeModal,
      maximizeModal,
      updateModalData,
      setModalWidth
    }),
    [closeModal, maximizeModal, minimizeModal, modalState, openModal, setModalWidth, updateModalData]
  )

  return <HalfScreenModalContext.Provider value={value}>{children}</HalfScreenModalContext.Provider>
}

export function useHalfScreenModal() {
  const context = useContext(HalfScreenModalContext)

  if (!context) {
    throw new Error('useHalfScreenModal must be used within a HalfScreenModalProvider')
  }

  return context
}
