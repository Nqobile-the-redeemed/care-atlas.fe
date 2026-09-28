import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getPublicTender } from '@/lib/api/tenders'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params

  try {
    const response = await getPublicTender(id)
    const tender = response.data

    return {
      title: `${tender.title} | Care Atlas`,
      description: tender.summary || `View this tender opportunity from ${tender.buyer ?? 'a UK buyer'} on Care Atlas.`,
      alternates: { canonical: `/tenders/${id}` },
      openGraph: {
        title: tender.title,
        description: tender.summary,
        url: `/tenders/${id}`,
        type: 'article'
      }
    }
  } catch {
    return {
      title: 'Tender opportunity | Care Atlas',
      description: 'View this tender opportunity on Care Atlas.',
      alternates: { canonical: `/tenders/${id}` }
    }
  }
}

export default async function SharedTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/tenders?tender=${encodeURIComponent(id)}`)
}
