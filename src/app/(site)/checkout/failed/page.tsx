import type { Metadata } from 'next'
import { ButtonLink, Container, CtaBand } from '@/components/site/ui'
import { getProductBySlug } from '@/data/products'
import { getServiceBySlug } from '@/data/site'

export const metadata: Metadata = {
  title: 'Payment Failed | Care Atlas',
  description: 'Return page for failed or incomplete Care Atlas checkout attempts.'
}

type PaymentFailedPageProps = {
  searchParams?: Promise<{
    product?: string
    reason?: string
  }>
}

export default async function PaymentFailedPage({ searchParams }: PaymentFailedPageProps) {
  const params = await searchParams
  const product = params?.product ? getProductBySlug(params.product) : undefined
  const service = product ? getServiceBySlug(product.serviceSlug) : undefined
  const retryHref = product ? `/checkout?product=${product.slug}` : '/checkout'

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='max-w-4xl'>
          <p className='border-error-200 bg-error-50 text-error-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
            Payment not completed
          </p>
          <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>The payment could not be completed.</h1>
          <p className='mt-5 text-lg leading-8 text-gray-600'>
            Please try again or contact Care Atlas if you need a different payment route, invoice, quote or service
            agreement before proceeding.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
              <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Product</p>
              <p className='mt-2 text-lg font-semibold text-gray-950'>{product?.name ?? 'Care Atlas service'}</p>
            </div>
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
              <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Status</p>
              <p className='mt-2 text-lg font-semibold text-gray-950'>{params?.reason ?? 'Payment failed'}</p>
            </div>
          </div>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <ButtonLink href={retryHref} variant='primary'>
              Try Checkout Again
            </ButtonLink>
            <ButtonLink href={service ? `${service.href}#service-enquiry` : '/contact'} variant='secondary'>
              Request Support
            </ButtonLink>
          </div>
        </Container>
      </section>

      <CtaBand
        title='Need help before paying?'
        body='Use the enquiry route if pricing, scope, procurement process or payment method needs to be agreed first.'
        primary={{ label: 'Contact Care Atlas', href: '/contact' }}
        secondary={{ label: 'View Services', href: '/services' }}
      />
    </>
  )
}
