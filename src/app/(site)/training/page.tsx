import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetailPage } from '@/components/site/ServiceDetailPage'
import { getServiceBySlug } from '@/data/site'
import { publicPageMetadata } from '@/lib/seo'

const service = getServiceBySlug('care-training-organisations-individuals')

export const metadata: Metadata = publicPageMetadata({
  title: service?.seo.title ?? 'Care Training | Care Atlas',
  description: service?.seo.description ?? 'Care training enquiries for organisations and individuals.',
  path: '/training'
})

export default function TrainingPage() {
  if (!service) {
    notFound()
  }

  return <ServiceDetailPage service={service} />
}
