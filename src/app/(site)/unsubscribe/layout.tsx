import type { Metadata } from 'next'

import { noIndexMetadata } from '@/lib/seo'

export const metadata: Metadata = noIndexMetadata(
  'Notification Preferences | Care Atlas',
  'Manage Care Atlas notification preferences.'
)

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return children
}
