'use client'

import { useEffect, useState } from 'react'

type UseMediaQueryOptions = {
  ssrDefault?: boolean
}

export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { ssrDefault = false } = options
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return ssrDefault
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQueryList = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    setMatches(mediaQueryList.matches)

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange)
      return () => mediaQueryList.removeEventListener('change', handleChange)
    }

    if (typeof mediaQueryList.addListener === 'function') {
      mediaQueryList.addListener(handleChange)
      return () => mediaQueryList.removeListener(handleChange)
    }

    return
  }, [query])

  return matches
}
