'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { activityPage, recordActivity, startActivity } from '@/lib/marketingActivity'

export default function ActivityTracking() {
  const pathname = usePathname()
  useEffect(() => startActivity(), [])
  useEffect(() => {
    recordActivity('page_viewed')
    const page = activityPage(pathname ?? '/')
    if (page === 'tenders') recordActivity('tender_board_viewed')
    if (page === 'settings') recordActivity('settings_viewed')
    if (page === 'billing') recordActivity('billing_viewed')
  }, [pathname])
  return null
}
