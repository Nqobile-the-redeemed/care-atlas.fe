import type { Metadata } from 'next'
import { ButtonLink, Container, CtaBand } from '@/components/site/ui'
import { getProductBySlug } from '@/data/products'
import { getServiceBySlug } from '@/data/site'

export const metadata: Metadata = {
  title: 'Payment Cancelled | Care Atlas',
  description: 'Return page for cancelled Care Atlas checkout sessions.'
}

type PaymentCancelledPageProps = {
  searchParams?: Promise<{
    product?: string
  }>
}

export default async function PaymentCancelledPage({ searchParams }: PaymentCancelledPageProps) {
  const params = await searchParams
  const product = params?.product ? getProductBySlug(params.product) : undefined
  const service = product ? getServiceBySlug(product.serviceSlug) : undefined
  const retryHref = product ? `/checkout?product=${product.slug}` : '/checkout'

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='max-w-4xl'>
          <p className='border-warning-200 bg-warning-25 text-warning-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
            Payment cancelled
          </p>
          <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Checkout was cancelled.</h1>
          <p className='mt-5 text-lg leading-8 text-gray-600'>
            No payment has been confirmed. You can return to checkout, request a quote, or speak to Care Atlas before
            purchasing.
          </p>

          <div className='border-brand-100 bg-brand-25 mt-8 rounded-lg border p-6'>
            <h2 className='text-2xl font-semibold text-gray-950'>{product?.name ?? 'Selected Care Atlas product'}</h2>
            {product && <p className='mt-3 text-sm leading-6 text-gray-600'>{product.shortDescription}</p>}
            <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href={retryHref} variant='primary'>
                Return to Checkout
              </ButtonLink>
              <ButtonLink href={service ? `${service.href}#service-enquiry` : '/contact'} variant='secondary'>
                Request a Quote
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand
        title='Not ready to pay online?'
        body='Care Atlas can confirm scope, invoice route, payment timing and any service agreement terms before you proceed.'
        primary={{ label: 'Speak to Care Atlas', href: '/contact' }}
        secondary={{ label: 'View Services', href: '/services' }}
      />
    </>
  )
}
