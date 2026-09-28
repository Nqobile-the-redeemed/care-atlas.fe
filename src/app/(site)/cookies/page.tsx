import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'
import { publicPageMetadata } from '@/lib/seo'

export const metadata: Metadata = publicPageMetadata({
  title: 'Cookie Policy | Care Atlas',
  description: 'Cookie policy for Care Atlas analytics, booking and form tracking readiness.',
  path: '/cookies'
})

const sections = [
  {
    title: 'Essential cookies',
    body: 'These are required for website security, form protection, basic functionality and storing your cookie choices. They cannot be disabled through the preference centre.'
  },
  {
    title: 'Analytics cookies',
    body: 'With your permission, analytics cookies can help us understand how people use Care Atlas and improve tender discovery. They remain disabled unless you opt in.'
  },
  {
    title: 'Functional and third-party services',
    body: 'Optional embedded services may need functional storage. Security services used to protect public forms may process limited technical information as strictly necessary.'
  },
  {
    title: 'Managing preferences',
    body: 'You can accept, reject or customise optional cookies from the first-visit notice. Use Cookie settings in the footer at any time to change or withdraw your choice.'
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
          Care Atlas uses essential storage to keep the website secure and working. Optional cookies are only enabled
          after you choose to allow them, and you can change that choice at any time.
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
