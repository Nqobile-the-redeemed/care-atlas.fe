import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Care Atlas',
  description:
    'Privacy policy for Care Atlas explaining how contact, booking, recruitment, tender, payment and Google user data is collected, used, stored and shared.'
}

const lastUpdated = '17 September 2026'

const policySections = [
  {
    title: '1. Who we are',
    body: [
      `${site.legalName} trading as ${site.name} provides care consultancy, recruitment, training, tender navigation, technology support and related services for UK care providers, founders, candidates and professionals.`,
      `For privacy questions, data access requests or deletion requests, contact us at ${site.email}.`
    ]
  },
  {
    title: '2. Personal information we collect',
    body: [
      'We collect information you choose to provide through our website forms, booking flows, enquiry pages, tender tools, checkout pages, email, telephone and related service communications.',
      'This may include your name, email address, phone number, organisation name, role, location, service interests, care setting, booking preferences, messages, consultation requirements, recruitment details, CV or work history information, training enquiries, tender preferences, payment status, consent records and communication history.',
      'We may also collect technical information such as IP address, browser type, device information, referring page, pages visited, date and time of visit, cookie identifiers, security logs and form submission metadata.'
    ]
  },
  {
    title: '3. Google user data and Google API Services',
    body: [
      'If you choose to sign in with Google or connect a Google service to Care Atlas, we only request the Google permissions needed to provide the feature you are using.',
      'Depending on the feature, this may include basic Google account profile information such as your name, email address and profile image, or other Google user data that you explicitly authorise through the Google consent screen.',
      'We use Google user data only to provide or improve user-facing Care Atlas features that are visible to you, such as account sign-in, calendar booking, file upload, workflow automation or communication features that you have requested.',
      'We do not sell Google user data, use it for advertising, use it for credit or lending decisions, transfer it to data brokers, or use it to build unrelated products.',
      'Human access to Google user data is limited to situations where you have asked for support, it is necessary for security or abuse investigation, it is required by law, or the data has been aggregated for internal operations in accordance with applicable privacy law.',
      'Our use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.'
    ]
  },
  {
    title: '4. How we use personal information',
    body: [
      'We use personal information to respond to enquiries, arrange consultations, deliver services, manage bookings, assess recruitment or candidate interest, provide tender information, process purchases, send requested resources, provide customer support, maintain website security, improve our services and meet legal or regulatory obligations.',
      'Where you opt in to marketing or service updates, we may send relevant updates about Care Atlas services, training, tenders, resources or events. You can unsubscribe or ask us to stop marketing at any time.'
    ]
  },
  {
    title: '5. Lawful bases for processing',
    body: [
      'We process personal information where it is necessary to take steps before entering into a contract, perform a contract, comply with legal obligations, pursue our legitimate interests in operating and improving Care Atlas, protect website security, respond to enquiries, or where you have given consent.',
      'Where we rely on consent, you can withdraw that consent at any time by contacting us.'
    ]
  },
  {
    title: '6. When we share information',
    body: [
      'We share personal information only where necessary to operate our services, respond to your request, comply with law, protect our rights, or work with trusted suppliers acting on our behalf.',
      'Suppliers may include hosting providers, website analytics providers, CRM and enquiry systems, email providers, payment processors, calendar or booking tools, recruitment systems, document storage services, professional advisers, and technology delivery partners including Cosmonaut Labs where relevant.',
      'We require service providers to protect personal information and use it only for the services they provide to us. We do not sell personal information.'
    ]
  },
  {
    title: '7. Payments and checkout',
    body: [
      'If you purchase a product or service through Care Atlas, payment details are handled by our payment processor. We receive information such as purchase status, transaction reference, product purchased, billing contact details and any information needed to deliver the service.',
      'We do not store full card numbers on our website.'
    ]
  },
  {
    title: '8. Cookies, analytics and similar technologies',
    body: [
      'We may use cookies and similar technologies to run the website, remember preferences, protect forms from abuse, understand website performance and improve the user experience.',
      'Where required, non-essential analytics or marketing cookies will be used only with appropriate consent. More detail is available on our Cookie Policy page.'
    ]
  },
  {
    title: '9. How long we keep information',
    body: [
      'We keep personal information only for as long as needed for the purpose it was collected, including to provide services, manage enquiries, keep business records, meet legal obligations, resolve disputes and protect legitimate business interests.',
      'Typical enquiry and service records may be retained for up to six years where needed for accounting, contractual or legal purposes. Recruitment or candidate information is normally retained only for as long as it remains relevant to the opportunity or consent given, unless a longer period is required by law.'
    ]
  },
  {
    title: '10. Security',
    body: [
      'We use reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse, alteration or disclosure.',
      'These measures include access controls, secure hosting, encrypted transport where supported, limited staff access, supplier due diligence and monitoring for security issues. No online system is completely risk free, so we encourage users to avoid sending unnecessary sensitive information through general enquiry forms.'
    ]
  },
  {
    title: '11. International transfers',
    body: [
      'Some suppliers may process personal information outside the United Kingdom. Where this happens, we use appropriate safeguards required by UK data protection law, such as adequacy regulations, standard contractual clauses, supplier security commitments or equivalent protections.'
    ]
  },
  {
    title: '12. Your rights',
    body: [
      'Depending on your circumstances, you may have rights to access your personal information, correct inaccurate information, request deletion, restrict processing, object to processing, request data portability, withdraw consent and complain to a data protection authority.',
      `To exercise these rights, contact ${site.email}. We may need to verify your identity before responding. You also have the right to complain to the UK Information Commissioner's Office at ico.org.uk.`
    ]
  },
  {
    title: '13. Deleting or disconnecting Google data',
    body: [
      'You can revoke Care Atlas access to your Google account from your Google Account permissions page. You can also ask us to delete Google user data associated with your Care Atlas use by contacting us.',
      'When deletion is requested, we will delete or anonymise the relevant information unless we need to retain limited records for legal, security, accounting or dispute-resolution purposes.'
    ]
  },
  {
    title: '14. Children',
    body: [
      'Care Atlas services are intended for adults, care providers, professionals, organisations and candidates. Our website is not directed at children under 13, and we do not knowingly collect personal information from children under 13.'
    ]
  },
  {
    title: '15. Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. The latest version will be published on this page with the updated date. If we make material changes to how we use personal information or Google user data, we will take reasonable steps to notify affected users where required.'
    ]
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
          This Privacy Policy explains how {site.name} collects, uses, stores and shares personal information when you
          visit our website, contact us, use our forms, book services, make purchases, apply for roles or connect a
          Google account.
        </p>
        <dl className='mt-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 sm:grid-cols-2'>
          <div>
            <dt className='font-semibold text-gray-950'>Last updated</dt>
            <dd className='mt-1'>{lastUpdated}</dd>
          </div>
          <div>
            <dt className='font-semibold text-gray-950'>Contact</dt>
            <dd className='mt-1'>
              <a className='text-brand-700 font-semibold hover:underline' href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
        </dl>
        <div className='mt-10 space-y-8'>
          {policySections.map(section => (
            <section key={section.title}>
              <h2 className='text-2xl font-semibold text-gray-950'>{section.title}</h2>
              <div className='mt-3 space-y-4'>
                {section.body.map(paragraph => (
                  <p className='text-base leading-8 text-gray-700' key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </section>
  )
}
