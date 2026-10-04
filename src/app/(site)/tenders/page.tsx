import { TenderNavigatorPage } from '@/components/site/TenderNavigatorPage'
import { publicPageMetadata } from '@/lib/seo'

export const metadata = publicPageMetadata({
  title: 'Tender Navigator | Care Atlas',
  description:
    'Browse current UK care, supported living and housing tenders for free, then book a Care Atlas bid-support meeting.',
  path: '/tenders'
})

export default function TendersPage() {
  return <TenderNavigatorPage />
}
