import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetailPage } from '@/components/site/ServiceDetailPage'
import { getServiceBySlug } from '@/data/site'

const service = getServiceBySlug('care-training-organisations-individuals')

export const metadata: Metadata = {
  title: service?.seo.title ?? 'Care Training | Care Atlas',
  description: service?.seo.description ?? 'Care training enquiries for organisations and individuals.'
}

export default function TrainingPage() {
  if (!service) {
    notFound()
  }

  return <ServiceDetailPage service={service} />
}
