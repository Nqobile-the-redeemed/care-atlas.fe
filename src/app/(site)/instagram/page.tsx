import { InstagramTenderLinks } from '@/components/site/InstagramTenderLinks'
import { publicPageMetadata } from '@/lib/seo'

export const metadata = publicPageMetadata({
  title: 'Instagram tender opportunities | Care Atlas',
  description: 'Find the tender from our Instagram posts and book a Care Atlas consultation.',
  path: '/instagram'
})

export default function InstagramPage() {
  return <InstagramTenderLinks />
}
