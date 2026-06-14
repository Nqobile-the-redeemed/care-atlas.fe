import type { Metadata } from 'next'
import { CheckoutSummary, PaymentStatusMessage } from '@/components/site/CommerceBlocks'
import { ButtonLink, Container, CtaBand } from '@/components/site/ui'
import { getProductBySlug } from '@/data/products'
import { getServiceBySlug } from '@/data/site'

export const metadata: Metadata = {
  title: 'Payment Successful | Care Atlas',
  description: 'Confirmation page for successful Care Atlas service, consultation or package payments.'
}

type PaymentSuccessPageProps = {
  searchParams?: Promise<{
    product?: string
    session_id?: string
  }>
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const params = await searchParams
  const product = params?.product ? getProductBySlug(params.product) : undefined
  const service = product ? getServiceBySlug(product.serviceSlug) : undefined

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <PaymentStatusMessage
              tone='success'
              eyebrow='Payment successful'
              title='Your Care Atlas payment is complete.'
              body='Thank you. Care Atlas can now confirm the order internally, match it to your service request and follow up with next steps.'
            />
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book Follow-up Call
              </ButtonLink>
              <ButtonLink href='/services' variant='secondary'>
                View Services
              </ButtonLink>
            </div>
          </div>
          {product ? (
            <div className='space-y-4'>
              <CheckoutSummary product={product} serviceTitle={service?.title} />
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
                <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Stripe session</p>
                <p className='mt-2 text-sm font-semibold break-all text-gray-900'>
                  {params?.session_id ?? 'Returned by Stripe Checkout'}
                </p>
              </div>
            </div>
          ) : (
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
              <p className='text-sm leading-6 text-gray-600'>
                Stripe Checkout returned successfully. The backend webhook should remain the source of truth for order
                status, fulfillment and confirmation.
              </p>
            </div>
          )}
        </Container>
      </section>

      <CtaBand
        title='Need to send extra context?'
        body='Use the contact form to share documents, timelines, service details or questions linked to this payment.'
        primary={{ label: 'Contact Care Atlas', href: '/contact' }}
        secondary={
          service ? { label: 'View Service', href: service.href } : { label: 'View Services', href: '/services' }
        }
      />
    </>
  )
}
