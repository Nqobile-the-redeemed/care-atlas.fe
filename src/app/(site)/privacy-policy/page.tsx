import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Container } from '@/components/site/ui'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Care Atlas',
  description:
    'Privacy Policy for Care Atlas, including website data, account data, Google OAuth data, cookies, security, retention and deletion.',
  alternates: {
    canonical: 'https://www.careatlas.co.uk/privacy-policy'
  }
}

const lastUpdated = '17 September 2026'

const dataRows = [
  {
    category: 'Website and enquiry data',
    examples: 'Name, email, phone, organisation, role, message, service interest, contact preferences.',
    purpose: 'Respond to enquiries, arrange consultations, provide requested information and manage customer support.',
    basis: 'Legitimate interests, contract steps, consent where required.',
    retention: 'Normally up to 6 years where needed for business, legal, tax or dispute records.'
  },
  {
    category: 'Account and booking data',
    examples: 'Account details, booking preferences, consultation times, intake answers, booking references.',
    purpose: 'Create accounts, manage sessions, schedule services, prevent misuse and support users.',
    basis: 'Contract, legitimate interests, legal obligations.',
    retention: 'While the account or service relationship is active, then only as needed for legal, security or records.'
  },
  {
    category: 'Google OAuth data',
    examples: 'Google account identifier, email, name, profile image, OAuth tokens, authorised Calendar availability and event data.',
    purpose: 'Authenticate users where enabled, connect accounts, manage Google Calendar scheduling and support the integration.',
    basis: 'Consent, contract steps, legitimate interests.',
    retention: 'While Google access is connected, then only as needed for security, legal, accounting or dispute purposes.'
  },
  {
    category: 'Payment and purchase data',
    examples: 'Product purchased, transaction reference, billing contact details, payment status.',
    purpose: 'Process purchases, provide services, issue records and manage refunds or disputes.',
    basis: 'Contract, legal obligations, legitimate interests.',
    retention: 'Normally up to 6 years for accounting, tax and legal records.'
  },
  {
    category: 'Technical and security data',
    examples: 'IP address, browser, device, log data, error records, security events, form metadata.',
    purpose: 'Operate, secure, monitor, troubleshoot and improve the website and application.',
    basis: 'Legitimate interests, legal obligations.',
    retention: 'Kept only as long as needed for security, troubleshooting and operational records.'
  }
]

const sections: { title: string; body: ReactNode[] }[] = [
  {
    title: 'Who we are',
    body: [
      `${site.name} is the application and website available at https://www.careatlas.co.uk. Care Atlas provides care consultancy, recruitment, training, tender navigation, booking and related support for UK care providers, founders, candidates and professionals.`,
      'Care Atlas is the controller for personal information collected through this website and application unless a separate customer agreement says otherwise. The Care Atlas application is developed and technically supported by Cosmonaut Labs as a technology provider.',
      `TODO: Confirm and publish the full legal entity name, company number and registered office or registered contact address for the controller. The repository currently exposes the trading/app name "${site.name}" and contact email ${site.email}, but it does not contain verified company registration details.`,
      `For privacy questions, access requests or deletion requests, contact ${site.email}.`
    ]
  },
  {
    title: 'General website data',
    body: [
      'We collect information that visitors choose to send through contact forms, booking forms, tender enquiries, checkout flows, recruitment forms, newsletter forms, email, telephone and other communications.',
      'This may include contact details, organisation details, role, location, service requirements, consultation notes, recruitment details, training interests, tender preferences, payment status, consent records and communication history.',
      'We also collect limited technical data needed to operate and secure the website, such as IP address, browser type, device information, pages visited, timestamps, cookie identifiers, form metadata, error logs and security logs.'
    ]
  },
  {
    title: 'Account data',
    body: [
      'If account features are enabled, we process account details to create or connect an account, authenticate users, maintain sessions, prevent duplicate accounts, provide account-related support, protect the platform and keep appropriate audit records.',
      'Users are responsible for ensuring that any information, documents or third-party data they submit to Care Atlas is accurate and shared with appropriate authority.'
    ]
  },
  {
    title: 'Google Account and OAuth Data',
    body: [
      "Users may choose to sign in using Google where Google sign-in is enabled. In that case, Care Atlas may receive the user's Google account identifier, name, email address and profile image. Care Atlas uses this information to authenticate the user, create or connect their Care Atlas account, maintain their session, prevent duplicate accounts, provide account-related support and protect the platform.",
      'Care Atlas does not receive or store the user’s Google password.',
      'The current backend implementation also includes an authenticated Google Calendar connection for authorised Care Atlas users. This connection requests Google Calendar permissions for scheduling features: checking free or busy availability, creating consultation or training events, adding attendees, creating a Google Meet conference link, updating booking records and cancelling events when required.',
      'For the Calendar integration, Care Atlas may process the connected Google account email address, calendar identifier, free or busy availability, event title, event description, start and end time, time zone, attendee email addresses, meeting location, Google Meet link, event status and Google event identifiers.',
      'Care Atlas does not access Gmail, Google Drive, Contacts, Photos, Google Cloud resources, BigQuery data, App Optimize data, App Topology data, YouTube data or other Google content through the current implementation.',
      'Google-derived account information and Google Calendar data are not sold. They are not used for targeted advertising, retargeting, credit decisions, unrelated profiling, or to train general-purpose or unrelated AI or machine-learning models.',
      'Google-derived data is shared only with processors necessary to host, secure, maintain and support the application, with Google services required to provide the OAuth and Calendar functionality, with authorised Care Atlas staff or technical support providers where necessary, or when legally required.',
      <>
        Care Atlas&apos;s use and transfer of information received from Google APIs adheres to the{' '}
        <a
          className='text-brand-700 font-semibold hover:underline'
          href='https://developers.google.com/terms/api-services-user-data-policy'
          rel='noreferrer'
          target='_blank'
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </>
    ]
  },
  {
    title: 'Cookies and analytics',
    body: [
      'We may use cookies and similar technologies to operate the website, remember preferences, protect forms from misuse, understand website performance and improve the user experience.',
      <>
        Non-essential analytics or marketing cookies should only be used where appropriate consent has been obtained.
        More information is available on the{' '}
        <Link className='text-brand-700 font-semibold hover:underline' href='/cookies'>
          Cookie Policy
        </Link>
        .
      </>
    ]
  },
  {
    title: 'Sharing and processors',
    body: [
      'We share personal information only where needed to operate Care Atlas, provide requested services, process payments, host and secure the application, provide support, comply with law, protect rights or work with trusted providers acting on our behalf.',
      'Processors and service providers may include hosting providers, database providers, email providers, payment processors, CRM or enquiry tools, booking tools, analytics or error monitoring providers, security tooling, document storage providers, professional advisers and technology support providers including Cosmonaut Labs.',
      'We do not sell personal information or Google user data. We require service providers to protect personal information and use it only for the services they provide to us.'
    ]
  },
  {
    title: 'Security',
    body: [
      'We use appropriate technical and organisational measures to protect personal information and Google user data against unauthorised access, loss, misuse, alteration or disclosure.',
      'These measures include HTTPS, access controls, authentication controls, restricted staff access, secure credential handling, encrypted token storage where implemented by the backend, logging, monitoring, supplier due diligence and limiting access to people or providers who need it for support, security, legal or operational purposes.',
      'No online system is completely risk free. Users should avoid submitting unnecessary sensitive information through general website forms and should connect only the Google accounts or calendars needed for the feature they intend to use.'
    ]
  },
  {
    title: 'Retention',
    body: [
      'We keep personal information only for as long as needed for the purpose it was collected, including to provide services, maintain accounts, manage bookings, keep business records, meet legal obligations, resolve disputes and protect legitimate business interests.',
      'Google-derived account information is retained while the account is active and afterwards only where necessary for security, legal, accounting or dispute-resolution requirements.',
      'Google Calendar OAuth tokens and calendar connection records are retained while the Calendar connection remains active or while needed to manage bookings, maintain audit records, troubleshoot issues, meet legal obligations or resolve disputes.'
    ]
  },
  {
    title: 'User rights and deletion',
    body: [
      'Depending on your circumstances, you may have rights to access your personal information, correct inaccurate information, request deletion, restrict processing, object to processing, request data portability, withdraw consent and complain to a data protection authority.',
      `To exercise these rights, email ${site.email}. We may need to verify your identity before responding.`,
      <>
        Users may revoke Google access through their{' '}
        <a
          className='text-brand-700 font-semibold hover:underline'
          href='https://myaccount.google.com/permissions'
          rel='noreferrer'
          target='_blank'
        >
          Google Account permissions
        </a>
        .
      </>,
      `Revoking OAuth permission stops future Google access but may not automatically delete information already lawfully retained by Care Atlas. To request deletion of Google-derived data associated with Care Atlas, email ${site.email} with the Google account email address connected to Care Atlas.`,
      <>
        You also have the right to complain to the{' '}
        <a className='text-brand-700 font-semibold hover:underline' href='https://ico.org.uk' rel='noreferrer' target='_blank'>
          UK Information Commissioner&apos;s Office
        </a>
        .
      </>
    ]
  },
  {
    title: 'Changes to this policy',
    body: [
      'We may update this Privacy Policy from time to time. The latest version will be published on this page with the updated date.',
      'If we make material changes to how we use personal information or Google user data, we will take reasonable steps to notify affected users where required.'
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='max-w-5xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Legal
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Privacy Policy</h1>
        <p className='mt-5 max-w-3xl text-lg leading-8 text-gray-600'>
          This Privacy Policy explains how Care Atlas collects, uses, stores, shares, protects and deletes personal
          information, including information received through Google OAuth.
        </p>
        <dl className='mt-6 grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700 sm:grid-cols-2'>
          <div>
            <dt className='font-semibold text-gray-950'>Last updated</dt>
            <dd className='mt-1'>{lastUpdated}</dd>
          </div>
          <div>
            <dt className='font-semibold text-gray-950'>Privacy contact</dt>
            <dd className='mt-1'>
              <a className='text-brand-700 font-semibold hover:underline' href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </dd>
          </div>
        </dl>

        <section className='mt-10'>
          <h2 className='text-2xl font-semibold text-gray-950'>Data summary</h2>
          <div className='mt-4 overflow-x-auto rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200 text-left text-sm'>
              <thead className='bg-gray-50 text-gray-700'>
                <tr>
                  <th scope='col' className='px-4 py-3 font-semibold'>
                    Category
                  </th>
                  <th scope='col' className='px-4 py-3 font-semibold'>
                    Examples
                  </th>
                  <th scope='col' className='px-4 py-3 font-semibold'>
                    Purpose
                  </th>
                  <th scope='col' className='px-4 py-3 font-semibold'>
                    Lawful basis
                  </th>
                  <th scope='col' className='px-4 py-3 font-semibold'>
                    Retention
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white text-gray-700'>
                {dataRows.map(row => (
                  <tr key={row.category}>
                    <th scope='row' className='px-4 py-4 align-top font-semibold text-gray-950'>
                      {row.category}
                    </th>
                    <td className='px-4 py-4 align-top leading-6'>{row.examples}</td>
                    <td className='px-4 py-4 align-top leading-6'>{row.purpose}</td>
                    <td className='px-4 py-4 align-top leading-6'>{row.basis}</td>
                    <td className='px-4 py-4 align-top leading-6'>{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className='mt-10 space-y-8'>
          {sections.map(section => (
            <section key={section.title}>
              <h2 className='text-2xl font-semibold text-gray-950'>{section.title}</h2>
              <div className='mt-3 space-y-4'>
                {section.body.map((paragraph, index) => (
                  <p className='text-base leading-8 text-gray-700' key={`${section.title}-${index}`}>
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
