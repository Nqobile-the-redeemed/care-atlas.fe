import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Cookie Policy | Care Atlas',
  description: 'Cookie policy placeholder for Care Atlas analytics, booking and form tracking readiness.'
}

const sections = [
  {
    title: 'Essential cookies',
    body: 'Essential cookies may be needed for security, form behaviour, consent preferences and basic website functionality.'
  },
  {
    title: 'Analytics readiness',
    body: 'The frontend is prepared for analytics integration, but production tracking should only be enabled with appropriate consent and configuration.'
  },
  {
    title: 'Booking and embedded tools',
    body: 'Future calendar booking, CRM, video or form integrations may set their own cookies. These should be listed before launch.'
  },
  {
    title: 'Managing preferences',
    body: 'A production cookie banner or preference centre can be added to allow users to manage non-essential cookies.'
  }
]

export default function CookiePolicyPage() {
  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='max-w-4xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Legal
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Cookie Policy</h1>
        <p className='mt-5 text-lg leading-8 text-gray-600'>
          This placeholder explains how cookie and analytics wording can be completed once production integrations are
          confirmed.
        </p>
        <div className='mt-10 space-y-8'>
          {sections.map(section => (
            <section key={section.title}>
              <h2 className='text-2xl font-semibold text-gray-950'>{section.title}</h2>
              <p className='mt-3 text-base leading-8 text-gray-700'>{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </section>
  )
}
