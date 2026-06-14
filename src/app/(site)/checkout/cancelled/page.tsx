import type { Metadata } from 'next'
import { CheckoutSummary, PaymentStatusMessage } from '@/components/site/CommerceBlocks'
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
          <PaymentStatusMessage
            tone='warning'
            eyebrow='Payment cancelled'
            title='Checkout was cancelled.'
            body='No payment has been confirmed. You can return to checkout, request a quote, or speak to Care Atlas before purchasing.'
          />

          <div className='mt-8 space-y-4'>
            {product ? (
              <CheckoutSummary product={product} serviceTitle={service?.title} />
            ) : (
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
                <p className='text-sm leading-6 text-gray-600'>
                  No payment has been taken and the order is not confirmed.
                </p>
              </div>
            )}
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
