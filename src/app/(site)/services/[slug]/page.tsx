import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetailPage } from '@/components/site/ServiceDetailPage'
import { getServiceBySlug, services } from '@/data/site'

type ServicePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return services.map(service => ({
    slug: service.slug
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: 'Service Not Found | Care Atlas'
    }
  }

  return {
    title: service.seo.title,
    description: service.seo.description
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return <ServiceDetailPage service={service} />
}
