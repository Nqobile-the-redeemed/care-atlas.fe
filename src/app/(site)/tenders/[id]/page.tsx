import { redirect } from 'next/navigation'

export default async function SharedTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/tenders?tender=${encodeURIComponent(id)}`)
}
