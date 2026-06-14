import type { Metadata } from 'next'
import { ButtonLink, Container, CtaBand } from '@/components/site/ui'
import { getProductBySlug } from '@/data/products'
import { getServiceBySlug } from '@/data/site'
import { SiteIcon } from '@/components/site/SiteIcon'

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
            <p className='border-success-200 bg-success-50 text-success-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Payment successful
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Your Care Atlas payment is complete.</h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Thank you. Care Atlas can now confirm the order internally, match it to your service request and follow up
              with next steps.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book Follow-up Call
              </ButtonLink>
              <ButtonLink href='/services' variant='secondary'>
                View Services
              </ButtonLink>
            </div>
          </div>
          <div className='border-brand-100 bg-brand-25 rounded-lg border p-6'>
            <div className='flex items-center gap-4'>
              <span className='bg-success-600 flex h-11 w-11 items-center justify-center rounded-lg text-white'>
                <SiteIcon name='check' className='h-5 w-5' />
              </span>
              <div>
                <p className='text-sm font-semibold text-gray-500'>Order summary</p>
                <h2 className='text-2xl font-semibold text-gray-950'>{product?.name ?? 'Care Atlas product'}</h2>
              </div>
            </div>
            <dl className='mt-6 grid gap-3'>
              <div className='rounded-lg bg-white p-4'>
                <dt className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Service</dt>
                <dd className='mt-1 text-sm font-semibold text-gray-900'>{service?.title ?? 'Care Atlas service'}</dd>
              </div>
              <div className='rounded-lg bg-white p-4'>
                <dt className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Stripe session</dt>
                <dd className='mt-1 text-sm font-semibold break-all text-gray-900'>
                  {params?.session_id ?? 'Returned by Stripe Checkout'}
                </dd>
              </div>
            </dl>
          </div>
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
