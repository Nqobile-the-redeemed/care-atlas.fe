import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy | Care Atlas',
  description: 'Privacy policy placeholder for Care Atlas contact, recruitment, booking and newsletter forms.'
}

const sections = [
  {
    title: 'Information we collect',
    body: 'Care Atlas forms are prepared to collect contact details, organisation details, service needs, recruitment preferences, CV upload placeholders, booking preferences and consent records.'
  },
  {
    title: 'How information is used',
    body: 'Information is intended to route enquiries, respond to consultation requests, manage recruitment interest, prepare training enquiries and support future CRM or booking workflows.'
  },
  {
    title: 'Data sharing',
    body: 'Technology enquiries may involve Cosmonaut Labs as the delivery partner. Production privacy wording should confirm processors, systems and lawful bases before launch.'
  },
  {
    title: 'Your rights',
    body: 'Visitors should be able to request access, correction, deletion or restriction of personal data once production data handling processes are confirmed.'
  }
]

export default function PrivacyPolicyPage() {
  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='max-w-4xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Legal
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Privacy Policy</h1>
        <p className='mt-5 text-lg leading-8 text-gray-600'>
          This is production-ready placeholder structure for legal review. It should be finalised with the organisation
          details, data processors, retention periods and lawful bases before live use.
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
