import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Care Atlas',
  description:
    'Terms and Conditions for Care Atlas website use, consultancy, recruitment, training, tender, technology, booking and payment services.'
}

const lastUpdated = '17 September 2026'

const termsSections = [
  {
    title: '1. About these terms',
    body: [
      `These Terms and Conditions apply when you access ${site.name} websites, submit enquiries, book consultations, purchase products or services, request recruitment support, use tender tools, attend training, or engage us for consultancy or technology support.`,
      `Care Atlas is operated by ${site.legalName}. If you have any questions about these terms, contact us at ${site.email}.`,
      'By using this website or purchasing services from us, you agree to these terms. If you enter into a separate written agreement with us, that agreement will take priority where it conflicts with these website terms.'
    ]
  },
  {
    title: '2. Website information',
    body: [
      'The content on this website is provided for general information about care consultancy, supported living, regulation, recruitment, training, tender opportunities, technology support and related services.',
      'Website content is not legal, financial, clinical, regulatory or professional advice tailored to your organisation. You should take specific advice before acting on important business, care, employment, safeguarding, regulatory, property, tax or legal decisions.',
      'We aim to keep information accurate and up to date, but we do not guarantee that all website content is complete, current or suitable for your specific circumstances.'
    ]
  },
  {
    title: '3. Enquiries, accounts and information you provide',
    body: [
      'When you submit a form, create an account, make a booking or contact us, you must provide accurate information and keep it updated where relevant.',
      'You are responsible for making sure any information, documents, policies, evidence, candidate details, tender information or operational material you provide to us is accurate, lawful and shared with appropriate permission.',
      'We may decline, suspend or stop work where information is incomplete, misleading, unlawful, unsafe, inappropriate, outside our scope, or where continuing would create a conflict of interest or unacceptable risk.'
    ]
  },
  {
    title: '4. Consultations and professional services',
    body: [
      'Consultations and consultancy services are delivered according to the scope described on the relevant service page, booking page, proposal, invoice or written agreement.',
      'Unless we agree otherwise in writing, outputs may include advice notes, readiness reviews, document comments, action plans, checklists, training materials, templates or recommendations. We do not guarantee approval by regulators, commissioners, funders, landlords, housing benefit teams, employers or other third parties.',
      'You remain responsible for your service decisions, regulatory compliance, operational delivery, staff management, safeguarding practice, employment decisions, policies, submissions and implementation of any recommendations.'
    ]
  },
  {
    title: '5. Bookings, availability and rescheduling',
    body: [
      'Booking times are subject to availability and confirmation. A booking is not confirmed until we issue confirmation or accept payment where payment is required before the session.',
      'If you need to reschedule, you should tell us as soon as reasonably possible. We may set reasonable limits on rescheduling, especially for short-notice changes or repeated changes.',
      'If you miss a booked consultation or provide insufficient information for us to prepare or deliver the service, we may treat the session as used or charge reasonable costs, unless we agree otherwise.'
    ]
  },
  {
    title: '6. Fees, payments and VAT',
    body: [
      'Prices may be shown as fixed fees, starting prices, monthly retainers, quote-based services or package fees. Unless stated otherwise, prices are in pounds sterling and may be subject to VAT.',
      'Payment terms will be shown at checkout, on the invoice, in the proposal or in a written agreement. You must pay fees by the due date and without set-off unless required by law.',
      'For quote-based work, the final fee depends on scope, urgency, volume, complexity, document quality, number of services or sites, stakeholder input and any agreed changes.'
    ]
  },
  {
    title: '7. Cancellations, refunds and cooling-off rights',
    body: [
      'Cancellation and refund rights depend on the service purchased, whether you are acting as a consumer or business, whether work has started, and any written terms agreed at purchase.',
      'Digital products, templates, document reviews, consultations, training places, urgent work and bespoke services may have limited refund rights once access is provided, preparation has started, a session has taken place, or bespoke work has begun.',
      'Where consumer cooling-off rights apply, we will honour them in line with applicable law. If you ask us to begin work during a cooling-off period, you may be required to pay for work already performed if you later cancel.'
    ]
  },
  {
    title: '8. Recruitment and candidate services',
    body: [
      'Recruitment-related content, candidate forms and employer enquiries are used to assess interest and potential fit. Submission of details does not guarantee work, placement, interview, introduction, employment or engagement.',
      'Employers remain responsible for safer recruitment checks, right-to-work checks, references, DBS checks, professional registration checks, supervision, employment decisions, contracts, pay, onboarding, training and workplace compliance.',
      'Candidates are responsible for providing accurate information about their identity, experience, qualifications, availability, right to work and suitability for roles.'
    ]
  },
  {
    title: '9. Tender Navigator and opportunity information',
    body: [
      'Tender, procurement and opportunity information is provided to help users identify and assess potential opportunities. We do not guarantee that tender information is complete, current, accurate, suitable or still open when viewed.',
      'You are responsible for checking original buyer portals, deadlines, requirements, eligibility, submission instructions, clarification responses and contract terms before acting on any opportunity.',
      'Any support we provide with tender readiness, bid planning or documentation does not guarantee shortlisting, award, funding, commissioner approval or commercial success.'
    ]
  },
  {
    title: '10. Training, resources, templates and digital materials',
    body: [
      'Training content, resources, checklists, templates and example documents are provided for general educational and operational support. They must be adapted to your organisation, service model, regulator, commissioner, local authority, staff team and current law or guidance.',
      'Unless we agree otherwise, materials we provide are for your internal business use only. You must not resell, publish, share, license, copy for third parties, or present them as your own commercial product.',
      'We may update, withdraw or replace resources from time to time.'
    ]
  },
  {
    title: '11. Technology services and third-party platforms',
    body: [
      'Technology support may involve websites, forms, automations, booking flows, CRM workflows, integrations, analytics, payment systems, email systems, hosting providers or delivery partners such as Cosmonaut Labs.',
      'Third-party platforms are governed by their own terms, pricing, service levels, privacy policies and availability. We are not responsible for third-party outages, policy changes, account restrictions, pricing changes or platform decisions.',
      'Where technology work is commissioned, ownership, licensing, support, maintenance, hosting, access credentials, handover, warranties and data processing terms should be confirmed in the relevant proposal or written agreement.'
    ]
  },
  {
    title: '12. Acceptable use',
    body: [
      'You must not misuse our website, forms, systems, materials or services. This includes attempting unauthorised access, submitting malicious code, scraping where prohibited, interfering with availability, impersonating others, infringing rights, uploading unlawful content, or using our services for fraudulent, harmful, discriminatory or unlawful purposes.',
      'We may block access, refuse service, remove content, cancel bookings or report activity where we reasonably believe misuse has occurred.'
    ]
  },
  {
    title: '13. Intellectual property',
    body: [
      'The Care Atlas name, branding, website content, design, text, graphics, service materials, frameworks, templates and resources are owned by us or our licensors unless stated otherwise.',
      'You may view website content for your own internal evaluation of our services. You must not copy, reproduce, adapt, distribute, sell, publish or commercially exploit our content without written permission, except where permitted by law or expressly agreed with us.'
    ]
  },
  {
    title: '14. Confidentiality and data protection',
    body: [
      'Each party should protect confidential information received from the other and use it only for the relevant enquiry, service, proposal, contract or support purpose.',
      'We handle personal information according to our Privacy Policy. Where a separate data processing agreement is required for a service, we will agree it separately.'
    ]
  },
  {
    title: '15. Disclaimers and limits of liability',
    body: [
      'Nothing in these terms excludes or limits liability where it would be unlawful to do so, including liability for death or personal injury caused by negligence, fraud, fraudulent misrepresentation, or rights that cannot be excluded under applicable law.',
      'Subject to the previous sentence, we are not liable for indirect loss, loss of profit, loss of revenue, loss of business, loss of goodwill, loss of opportunity, loss of anticipated savings, business interruption, or loss caused by third-party platforms, regulators, commissioners, employers, candidates, funders, landlords or public bodies.',
      'Where liability can lawfully be limited, our total liability for a claim relating to a paid service will be limited to the amount you paid us for the service giving rise to the claim, unless a separate written agreement states otherwise.'
    ]
  },
  {
    title: '16. Delays and events outside our control',
    body: [
      'We are not responsible for delay or failure caused by events outside our reasonable control, including third-party outages, illness, emergencies, cyber incidents, public authority action, strikes, transport disruption, severe weather, power failure or delays in you providing information or decisions.',
      'Where this happens, we will take reasonable steps to reduce the impact and resume work when practical.'
    ]
  },
  {
    title: '17. Changes to services or terms',
    body: [
      'We may update website content, services, pricing, availability and these terms from time to time. The latest version will be published on this page with the updated date.',
      'Terms that applied when you purchased a service will usually continue to apply to that purchase unless we agree a change with you or a legal change requires an update.'
    ]
  },
  {
    title: '18. Governing law and disputes',
    body: [
      'These terms are governed by the laws of England and Wales. The courts of England and Wales will have jurisdiction, except where consumer law gives you the right to bring a claim elsewhere.',
      'If a dispute arises, we encourage you to contact us first so we can try to resolve it promptly and fairly.'
    ]
  }
]

export default function TermsPage() {
  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='max-w-4xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Legal
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Terms and Conditions</h1>
        <p className='mt-5 text-lg leading-8 text-gray-600'>
          These terms explain the rules for using the {site.name} website and for requesting or purchasing our care
          consultancy, recruitment, training, tender, technology and related services.
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
          {termsSections.map(section => (
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
