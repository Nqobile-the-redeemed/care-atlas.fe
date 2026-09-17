import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | Care Atlas',
  description:
    'Privacy policy for the Care Atlas application explaining what personal information and Google user data is accessed, used, shared, protected, retained and deleted.'
}

const lastUpdated = '17 September 2026'

const policySections = [
  {
    title: '1. Who we are',
    body: [
      `${site.legalName} trading as ${site.name} provides care consultancy, recruitment, training, tender navigation, technology support and related services for UK care providers, founders, candidates and professionals. This Privacy Policy applies to the Care Atlas application and website at https://www.careatlas.co.uk and https://careatlas.co.uk, including Google-connected features configured in Google Cloud under the Orbit Mirai project or related technical configuration.`,
      'Application name: Care Atlas. Technical Google Cloud project or internal application reference: Orbit Mirai. Developer and organisation responsible for the application: CARE ATLAS.',
      `For privacy questions, data access requests or deletion requests, contact us at ${site.email}.`
    ]
  },
  {
    title: '2. Our role as controller or processor',
    body: [
      'For website visitors, prospects, customers, candidates, trainees, account users and people who contact us directly, CARE ATLAS normally acts as the data controller for the personal information described in this policy.',
      'Where a business customer asks Care Atlas to process data from its own systems, Google Cloud project, BigQuery environment, documents, tenders, service records or other business systems, Care Atlas may act as a processor or service provider for that customer. In that situation, the customer remains responsible for deciding what data is connected, uploaded or authorised, and Care Atlas processes that data only to provide the requested service or application functionality.',
      'Customers and authorised users are responsible for ensuring they have the right to connect Google accounts, Google Cloud projects, BigQuery resources, operational records, candidate information, staff information, service-user information or other third-party data to Care Atlas.'
    ]
  },
  {
    title: '3. Categories of personal information we collect',
    body: [
      'We collect information you choose to provide through our website forms, booking flows, enquiry pages, tender tools, checkout pages, email, telephone and related service communications.',
      'This may include your name, email address, phone number, organisation name, role, location, service interests, care setting, booking preferences, messages, consultation requirements, recruitment details, CV or work history information, training enquiries, tender preferences, payment status, consent records and communication history.',
      'We may collect business and professional information such as company name, job title, employer, sector, service type, regulatory interests, tender interests, project requirements, procurement details, consultation notes, support requests, contract records and invoice or purchase information.',
      'We may collect customer-provided content where you choose to upload, submit, connect or authorise it. This may include documents, policies, operational data, tender information, care-business data, Google Cloud project data, BigQuery data, configuration data, analytics outputs, reports, messages, files or other materials you provide for a service.',
      'We may also collect technical information such as IP address, browser type, device information, operating system, approximate location derived from IP address, referring page, pages visited, date and time of visit, cookie identifiers, security logs, authentication logs, usage events, error logs and form submission metadata.'
    ]
  },
  {
    title: '4. Sources of information',
    body: [
      'We collect information directly from you when you contact us, submit forms, create an account, make a booking, purchase a service, connect Google permissions, upload documents, attend training, apply for a role, subscribe to updates or communicate with us.',
      'We may receive information from your organisation, employer, colleagues, authorised account administrators, delivery partners, payment providers, booking providers, CRM tools, recruitment tools, analytics tools, security tools and Google APIs that you authorise.',
      'We may also generate information from your use of Care Atlas, including support history, audit records, usage logs, error reports, preference records and service delivery notes.'
    ]
  },
  {
    title: '5. Google user data accessed by Care Atlas',
    body: [
      'If you choose to sign in with Google or connect a Google account to Care Atlas, the application may access the Google user data shown on the Google OAuth consent screen.',
      'For sign-in and account identification, Care Atlas may access your Google account identifier, primary Google Account email address, basic personal profile information, name and profile image. These permissions correspond to the openid, userinfo.email and userinfo.profile scopes.',
      'Where you authorise Google Cloud access, Care Atlas may access Google Cloud Platform information connected to the Google account or Google Cloud project that you authorise. This may include project identifiers, resource metadata, configuration information, service status, usage information and related administrative data available through the cloud-platform or cloud-platform.read-only scopes.',
      'Where you authorise Google BigQuery access, Care Atlas may access BigQuery resources connected to the authorised account or project. This may include BigQuery project, dataset, table, job, query, metadata and result information available through the bigquery or bigquery.readonly scopes.',
      'Where you authorise Google Cloud App Optimize access, Care Atlas may access App Optimize API data connected to the authorised account or project, including configuration and performance-related information available through the appoptimize scope.',
      'Where you authorise Google Cloud App Topology access, Care Atlas may access App Topology data connected to the authorised account or project, including topology, health, cost and security status information available through the apptopology.read-only or apptopology.read-write scopes.',
      'Care Atlas does not access Gmail messages, Google Drive files, Google Photos, Google Contacts, Google Docs, Google Sheets, YouTube data or other Google account content unless a future feature requests that specific permission from you on the Google OAuth consent screen. If additional Google permissions are introduced, this policy will be updated to describe the additional data before the feature is used.'
    ]
  },
  {
    title: '6. How Care Atlas uses Google user data',
    body: [
      'Care Atlas uses Google account profile data to identify the signed-in user, create or manage the user session, pre-fill account details where appropriate, prevent duplicate records and provide support linked to the correct account.',
      'Care Atlas uses authorised Google Cloud, BigQuery, App Optimize and App Topology data to provide the application features requested by the user, including reviewing authorised cloud resources, analysing usage or activity, understanding project configuration, surfacing operational insights, preparing reports, troubleshooting integrations, supporting account setup, and helping users understand activity, cost, security or performance information in their authorised Google Cloud environment.',
      'If write permissions are authorised, Care Atlas uses them only for user-requested actions within the application, such as configuring, updating or managing authorised Google Cloud resources or related settings that the user has chosen to connect. Care Atlas does not make unrelated changes to Google Cloud resources.',
      'Care Atlas does not use Google user data for advertising, retargeting, sale, credit decisions, lending decisions, unrelated analytics, training unrelated AI models, or any purpose unrelated to providing or improving Care Atlas user-facing features.'
    ]
  },
  {
    title: '7. How we use personal information',
    body: [
      'We use personal information to respond to enquiries, arrange consultations, deliver services, manage bookings, assess recruitment or candidate interest, provide tender information, process purchases, send requested resources, provide customer support, maintain website security, improve our services and meet legal or regulatory obligations.',
      'We also use personal information to administer accounts, authenticate users, maintain audit records, prevent fraud or misuse, troubleshoot errors, improve reliability, prepare reports requested by customers, manage contracts and invoices, comply with tax or accounting requirements, and protect the rights, property and safety of Care Atlas, users and others.',
      'Where you opt in to marketing or service updates, we may send relevant updates about Care Atlas services, training, tenders, resources or events. You can unsubscribe or ask us to stop marketing at any time.',
      'We do not use Google user data or customer-provided Google Cloud data to build unrelated products, profile users for advertising, sell user information, or make automated decisions with legal or similarly significant effects without human involvement.'
    ]
  },
  {
    title: '8. Lawful bases for processing',
    body: [
      'We process personal information where it is necessary to take steps before entering into a contract, perform a contract, comply with legal obligations, pursue our legitimate interests in operating and improving Care Atlas, protect website security, respond to enquiries, or where you have given consent.',
      'Where we rely on consent, you can withdraw that consent at any time by contacting us.'
    ]
  },
  {
    title: '9. When we share, transfer or disclose information',
    body: [
      'We share personal information only where necessary to operate our services, respond to your request, comply with law, protect our rights, or work with trusted suppliers acting on our behalf.',
      'Suppliers may include hosting providers, website analytics providers, CRM and enquiry systems, email providers, payment processors, calendar or booking tools, recruitment systems, document storage services, professional advisers, and technology delivery partners including Cosmonaut Labs where relevant.',
      'We do not sell personal information or Google user data. We do not transfer or disclose Google user data to third parties except as necessary to provide the Care Atlas features you requested, comply with law, protect security, or work with service providers that process data for us under appropriate confidentiality and data protection obligations.',
      'Google account and Google Cloud data may be visible to Care Atlas staff or authorised delivery partners only where needed to provide support, investigate errors, maintain security, deliver requested analysis, or complete the user-requested workflow. Google Cloud and BigQuery data remains subject to Google services and infrastructure when accessed through Google APIs.',
      'We may disclose information where required by law, court order, regulator, public authority, law enforcement request, tax authority, or to establish, exercise or defend legal claims. Where legally permitted and practical, we will seek to limit the disclosure to the information necessary for the request.'
    ]
  },
  {
    title: '10. Subprocessors and service providers',
    body: [
      'Care Atlas uses trusted third-party service providers to host, secure, operate, support and improve the website and application. These providers may process personal information only for the services they provide to us and must protect it under contractual, confidentiality or data protection obligations.',
      'Categories of subprocessors and service providers may include cloud hosting, database hosting, email delivery, customer relationship management, payment processing, analytics, error monitoring, security tooling, file storage, recruitment tooling, booking systems, professional advisers and technology delivery partners.',
      'Where a customer engagement requires a separate data processing agreement, subprocessor list, security questionnaire or supplier due-diligence information, we can provide the relevant details as part of that engagement.'
    ]
  },
  {
    title: '11. Payments and checkout',
    body: [
      'If you purchase a product or service through Care Atlas, payment details are handled by our payment processor. We receive information such as purchase status, transaction reference, product purchased, billing contact details and any information needed to deliver the service.',
      'We do not store full card numbers on our website.'
    ]
  },
  {
    title: '12. Cookies, analytics and similar technologies',
    body: [
      'We may use cookies and similar technologies to run the website, remember preferences, protect forms from abuse, understand website performance and improve the user experience.',
      'Where required, non-essential analytics or marketing cookies will be used only with appropriate consent. More detail is available on our Cookie Policy page.'
    ]
  },
  {
    title: '13. Data retention and deletion',
    body: [
      'We keep personal information only for as long as needed for the purpose it was collected, including to provide services, manage enquiries, keep business records, meet legal obligations, resolve disputes and protect legitimate business interests.',
      'Typical enquiry and service records may be retained for up to six years where needed for accounting, contractual or legal purposes. Recruitment or candidate information is normally retained only for as long as it remains relevant to the opportunity or consent given, unless a longer period is required by law.',
      'Google account profile data is retained while your Care Atlas account, booking record or service relationship remains active, unless a shorter period is required by law or you request deletion. Google Cloud, BigQuery, App Optimize and App Topology data retrieved through Google APIs is retained only for as long as needed to provide the requested feature, deliver support, maintain audit records, troubleshoot issues, maintain business records and meet legal or accounting obligations.',
      `You can request deletion of Google user data associated with Care Atlas by emailing ${site.email}. We will delete or anonymise the relevant Google user data unless we must retain limited information for legal, security, accounting, fraud-prevention or dispute-resolution purposes.`
    ]
  },
  {
    title: '14. Data protection and security mechanisms',
    body: [
      'Security procedures are in place to protect the confidentiality, integrity and availability of personal information and Google user data.',
      'We use reasonable technical and organisational measures to protect personal information and Google user data against unauthorised access, loss, misuse, alteration or disclosure.',
      'These measures include HTTPS encrypted transport, secure hosting, access controls, role-based access where available, limited staff access, authentication controls, supplier due diligence, logging or monitoring for security issues, and restricting human access to Google user data to support, security, legal or operational purposes that are necessary for the Care Atlas service.',
      'We apply privacy and security controls designed to support data minimisation, least-privilege access, separation of customer data where practical, auditability, operational monitoring, secure credential handling and prompt investigation of suspected security issues.',
      'If we become aware of a personal data breach that requires notification, we will notify affected customers, users or regulators as required by applicable law.',
      'No online system is completely risk free, so we encourage users to avoid sending unnecessary sensitive information through general enquiry forms and to connect only the Google accounts, projects and resources that are needed for the feature they want to use.'
    ]
  },
  {
    title: '15. International transfers',
    body: [
      'Some suppliers may process personal information outside the United Kingdom. Where this happens, we use appropriate safeguards required by UK data protection law, such as adequacy regulations, standard contractual clauses, supplier security commitments or equivalent protections.'
    ]
  },
  {
    title: '16. Your rights',
    body: [
      'Depending on your circumstances, you may have rights to access your personal information, correct inaccurate information, request deletion, restrict processing, object to processing, request data portability, withdraw consent and complain to a data protection authority.',
      `To exercise these rights, contact ${site.email}. We may need to verify your identity before responding. You also have the right to complain to the UK Information Commissioner's Office at ico.org.uk.`
    ]
  },
  {
    title: '17. Deleting or disconnecting Google data',
    body: [
      'You can revoke Care Atlas access to your Google account from your Google Account permissions page. You can also ask us to delete Google user data associated with your Care Atlas use by contacting us.',
      'Revoking access may stop Google sign-in, Google Cloud, BigQuery, App Optimize, App Topology or other Google-connected features from working. It does not automatically delete records already needed for confirmed services, accounting, legal compliance, security or dispute-resolution purposes.',
      `To request deletion, email ${site.email} with the Google account email address connected to Care Atlas. We will respond in line with applicable data protection law.`
    ]
  },
  {
    title: '18. Google API Services User Data Policy',
    body: [
      'Care Atlas use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.',
      'Care Atlas does not allow humans to read Google user data unless you have given us permission, it is necessary for security purposes, it is necessary to comply with law, or our use is limited to internal operations and the data has been aggregated and anonymised where appropriate.'
    ]
  },
  {
    title: '19. Customer data, ownership and responsibility',
    body: [
      'As between Care Atlas and a customer, customer-provided content remains the customer’s content. Care Atlas does not claim ownership of customer Google Cloud data, BigQuery data, documents, operational data, tender data, recruitment data or other materials provided for a service.',
      'Care Atlas uses customer-provided content only to provide, secure, support, maintain and improve the requested Care Atlas service, unless the customer gives us permission to use it for another purpose or the law requires otherwise.',
      'Customers and authorised users should not connect, upload or submit sensitive personal data, service-user records, health information, special category data, children’s data or confidential third-party information unless it is necessary for the requested service and they have the lawful authority to do so.'
    ]
  },
  {
    title: '20. Automated processing and AI-assisted features',
    body: [
      'Care Atlas may use software automation, analytics or AI-assisted tools to organise information, generate summaries, identify patterns, prepare reports, support customer service, detect errors, improve reliability or provide requested insights.',
      'We do not use Google user data for unrelated AI model training. We do not make solely automated decisions about users that produce legal or similarly significant effects unless we clearly explain that processing and provide any rights required by law.'
    ]
  },
  {
    title: '21. Children',
    body: [
      'Care Atlas services are intended for adults, care providers, professionals, organisations and candidates. Our website is not directed at children under 13, and we do not knowingly collect personal information from children under 13.'
    ]
  },
  {
    title: '22. Changes to this policy',
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
