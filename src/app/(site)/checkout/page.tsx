import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CheckoutClient } from '@/components/site/CheckoutClient'
import { Container } from '@/components/site/ui'
import { getPopularProducts, getProductBySlug } from '@/data/products'
import { getServiceBySlug } from '@/data/site'

export const metadata: Metadata = {
  title: 'Checkout | Care Atlas',
  description:
    'Review and purchase Care Atlas consultations, service packages and recurring care provider support products.'
}

type CheckoutPageProps = {
  searchParams?: Promise<{
    product?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  const productSlug = params?.product
  const product = productSlug ? getProductBySlug(productSlug) : undefined

  if (productSlug && !product) {
    notFound()
  }

  const service = product ? getServiceBySlug(product.serviceSlug) : undefined

  return (
    <section className='bg-gray-50 py-16 sm:py-20'>
      <Container>
        <CheckoutClient product={product} service={service} popularProducts={getPopularProducts()} />
      </Container>
    </section>
  )
}
