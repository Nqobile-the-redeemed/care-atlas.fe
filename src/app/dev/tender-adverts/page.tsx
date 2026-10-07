import { notFound } from 'next/navigation'

import { TenderAdvertDevPage } from '@/components/site/tender-board/TenderAdvertDevPage'

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
}

export const dynamic = 'force-dynamic'

export default function Page() {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_TENDER_ADVERT_DEV !== 'true') {
    notFound()
  }

  return <TenderAdvertDevPage />
}
