import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { TenderNavigatorPage } from '@/components/site/TenderNavigatorPage'
import { ApiError } from '@/lib/api/client'
import { getPublicTender } from '@/lib/api/tenders'
import { noIndexMetadata, publicPageMetadata } from '@/lib/seo'
import { cleanTenderText } from '@/lib/tenders/tenderShare'

const getSharedTender = cache((id: string) => getPublicTender(id))

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  try {
    const response = await getSharedTender(id)
    const tender = response.data
    const title = cleanTenderText(tender.title) || 'Tender opportunity'
    const description =
      cleanTenderText(tender.summary, 160) ||
      `View this tender opportunity from ${cleanTenderText(tender.buyer) || 'a UK buyer'} on Care Atlas.`

    return publicPageMetadata({
      title: `${title} | Care Atlas`,
      description,
      path: `/tenders/${encodeURIComponent(id)}`,
      type: 'article'
    })
  } catch {
    return noIndexMetadata('Tender opportunity | Care Atlas', 'This tender opportunity is not currently available.')
  }
}

export default async function SharedTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const response = await getSharedTender(id)
    return <TenderNavigatorPage initialTender={response.data} />
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()

    return <TenderNavigatorPage initialTenderId={id} />
  }
}
