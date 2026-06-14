import type { Metadata } from 'next'
import { CheckoutSummary, PaymentStatusMessage } from '@/components/site/CommerceBlocks'
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
          <PaymentStatusMessage
            tone='error'
            eyebrow='Payment not completed'
            title='The payment could not be completed.'
            body='Please try again or contact Care Atlas if you need a different payment route, invoice, quote or service agreement before proceeding.'
          />

          <div className='mt-8 space-y-4'>
            {product && <CheckoutSummary product={product} serviceTitle={service?.title} />}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
                <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Product</p>
                <p className='mt-2 text-lg font-semibold text-gray-950'>{product?.name ?? 'Care Atlas service'}</p>
              </div>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
                <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Status</p>
                <p className='mt-2 text-lg font-semibold text-gray-950'>{params?.reason ?? 'Payment failed'}</p>
              </div>
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
