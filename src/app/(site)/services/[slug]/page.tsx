import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/site/JsonLd'
import { ServiceDetailPage } from '@/components/site/ServiceDetailPage'
import { getServiceBySlug, services } from '@/data/site'
import { publicPageMetadata, serviceJsonLd } from '@/lib/seo'

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

  return publicPageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: service.href
  })
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <ServiceDetailPage service={service} />
    </>
  )
}
