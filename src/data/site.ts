export type SiteLink = {
  label: string
  href: string
}

export type SeoMeta = {
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type ProcessStep = {
  title: string
  body: string
}

export type Checklist = {
  title: string
  items: string[]
}

export type ServiceFormVariant =
  | 'consultation'
  | 'housing'
  | 'registration'
  | 'recruitment'
  | 'agencyStaffing'
  | 'permanentRecruitment'
  | 'inspection'
  | 'candidate'
  | 'training'
  | 'technology'
  | 'tender'
  | 'compliance'

export type Service = {
  slug: string
  title: string
  navLabel: string
  href: string
  category: string
  icon: string
  eyebrow: string
  summary: string
  hero: string
  seo: SeoMeta
  description?: string
  audience: string[]
  included: string[]
  problems: string[]
  benefits: string[]
  outcomes?: string[]
  process: ProcessStep[]
  deliverables: string[]
  checklists: Checklist[]
  commercialNote?: string
  faqs: FaqItem[]
  related: string[]
  formVariant: ServiceFormVariant
  primaryCta: string
  secondaryCta: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  readTime: string
  tags: string[]
  seo: SeoMeta
  sections: ProcessStep[]
}

export type JobListing = {
  title: string
  location: string
  type: string
  summary: string
  tags: string[]
}

export type Testimonial = {
  quote: string
  name: string
  initials: string
  role: string
  providerType: string
  location: string
}

export const site = {
  name: 'Care Atlas',
  legalName: 'CARE ATLAS',
  email: 'admin@careatlas.co.uk',
  phone: '020 0000 0000',
  address: 'UK-wide remote and on-site consultancy support',
  summary:
    'Care Atlas helps UK care providers, supported living operators, founders, and care professionals launch, stabilise, improve, and grow stronger care services.',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com' },
    { label: 'X', href: 'https://x.com' }
  ]
}

export const mainNav: SiteLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Tenders', href: '/tenders' },
  { label: 'Training', href: '/training' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
]

export const serviceCategories = [
  'Care operations and consultancy',
  'Regulatory and compliance',
  'Housing and supported living',
  'Staffing and careers',
  'Technology and websites',
  'Training and capability building'
]

export const services: Service[] = [
  {
    slug: 'supported-living-housing-benefit',
    title: 'Supported Living Housing Association & Housing Benefit Support',
    navLabel: 'Housing Benefit Support',
    href: '/services/supported-living-housing-benefit',
    category: 'Housing and supported living',
    icon: 'home',
    eyebrow: 'Supported living consultancy',
    summary:
      'Practical housing association support, housing benefit pathway guidance, and documentation support for supported living services.',
    hero: 'Set up or strengthen supported living housing arrangements with a clear view of documentation, operator coordination, exempt accommodation considerations, and housing benefit support routes.',
    seo: {
      title: 'Supported Living Housing Benefit Support | Care Atlas',
      description:
        'Housing association support, housing benefit support and supported living consultancy for UK care providers and operators.'
    },
    audience: [
      'Supported living providers planning a new property or service model',
      'Care businesses reviewing housing benefit and exempt accommodation pathways',
      'Operators that need stronger documentation and landlord coordination',
      'Founders who want practical supported living setup guidance'
    ],
    included: [
      'Initial supported living housing suitability review',
      'Housing association and landlord structure guidance',
      'Housing benefit documentation support',
      'Exempt accommodation readiness considerations',
      'Operator coordination and role clarity',
      'Service setup planning across property, staffing and compliance'
    ],
    problems: [
      'Unclear separation between landlord, care provider and support functions',
      'Missing or inconsistent documentation for housing benefit discussions',
      'Property opportunities that have not been assessed against service needs',
      'Supported living models that need stronger operational planning'
    ],
    benefits: [
      'Clearer route from property idea to supported living delivery model',
      'Better prepared documents for housing benefit conversations',
      'Reduced confusion across care, support and accommodation responsibilities',
      'More credible planning before taking on a property commitment'
    ],
    process: [
      {
        title: 'Property and model discovery',
        body: 'We review the property, target client group, care model, support hours, landlord position and operational assumptions.'
      },
      {
        title: 'Structure and documentation review',
        body: 'We map the documents, agreements and evidence normally needed to support a credible housing benefit pathway.'
      },
      {
        title: 'Gap plan',
        body: 'We identify missing items, unclear responsibilities, risk areas and practical actions before the service is launched or changed.'
      },
      {
        title: 'Implementation support',
        body: 'We help you coordinate next steps across housing, support planning, operational readiness and compliance documentation.'
      }
    ],
    deliverables: [
      'Housing support action plan',
      'Document checklist and evidence map',
      'Role and responsibility outline',
      'Property readiness notes',
      'Follow-up consultancy session'
    ],
    checklists: [
      {
        title: 'Suitability checklist',
        items: [
          'Target client group and support needs are defined',
          'Property use and tenancy approach are understood',
          'Landlord or housing partner role is clear',
          'Care and support delivery model is mapped',
          'Core policies, support plans and risk documents are in progress'
        ]
      },
      {
        title: 'Typical document areas',
        items: [
          'Property details and occupancy assumptions',
          'Tenancy or licence documents for review',
          'Support model summary',
          'Evidence of eligible support or accommodation costs',
          'Service policies and operational procedures'
        ]
      }
    ],
    faqs: [
      {
        question: 'Who is this service suitable for?',
        answer:
          'It is suitable for supported living operators, care providers and founders who need practical help planning housing arrangements, housing benefit support routes and operational documentation.'
      },
      {
        question: 'Can you support both new and existing houses?',
        answer:
          'Yes. We can help at idea stage, property review stage, launch stage or when an existing arrangement needs clearer documentation and operating structure.'
      },
      {
        question: 'What documents are usually needed?',
        answer:
          'The exact list depends on the model, but typically includes property information, tenancy or licence documents, support model details, policies, risk documents and evidence linked to eligible housing or support arrangements.'
      },
      {
        question: 'Do you make housing benefit decisions?',
        answer:
          'No. Decisions sit with the relevant authority or body. Care Atlas helps you prepare, organise and understand the information needed for a stronger conversation.'
      }
    ],
    related: [
      'cqc-ofsted-registration-support',
      'care-compliance-policies-protocols',
      'tender-bidding-operational-planning'
    ],
    formVariant: 'housing',
    primaryCta: 'Discuss a supported living property',
    secondaryCta: 'View compliance support'
  },
  {
    slug: 'pamms-preparation-care-consultancy',
    title: 'PAMMS Preparation & Care Consultancy',
    navLabel: 'PAMMS Preparation',
    href: '/services/pamms-preparation-care-consultancy',
    category: 'Care operations and consultancy',
    icon: 'clipboard',
    eyebrow: 'Quality review readiness',
    summary:
      'PAMMS preparation, gap analysis, improvement planning and practical service quality consultancy for care providers.',
    hero: 'Prepare for PAMMS-style quality reviews with a grounded assessment of documentation, leadership, evidence, practice, governance and service improvement actions.',
    seo: {
      title: 'PAMMS Preparation & Care Consultancy | Care Atlas',
      description:
        'PAMMS preparation, mock review readiness, gap analysis and care consultancy for providers seeking stronger service quality.'
    },
    audience: [
      'Providers expecting a PAMMS or quality monitoring review',
      'Services that need evidence organised before external scrutiny',
      'Managers who want an independent improvement plan',
      'Care organisations recovering from quality, documentation or governance gaps'
    ],
    included: [
      'PAMMS readiness assessment',
      'Documentation and evidence review',
      'Mock review preparation',
      'Leadership and governance support',
      'Action plan and improvement tracking',
      'Follow-up quality consultancy'
    ],
    problems: [
      'Evidence is spread across folders, systems and email trails',
      'Policies exist but are not translated into daily practice',
      'Managers need a clear view of quality risks before review',
      'Improvement plans are too broad to drive measurable change'
    ],
    benefits: [
      'Stronger confidence before review',
      'Clearer evidence packs and audit trail',
      'Prioritised improvement actions',
      'Better alignment between leadership, compliance and frontline practice'
    ],
    process: [
      {
        title: 'Readiness review',
        body: 'We assess your current position across documentation, governance, care planning, staffing evidence and quality monitoring.'
      },
      {
        title: 'Evidence mapping',
        body: 'We help organise the records and narratives that show how the service operates and improves.'
      },
      {
        title: 'Gap analysis',
        body: 'We identify what needs urgent attention, what can be improved over time and which risks may affect review confidence.'
      },
      {
        title: 'Action plan support',
        body: 'We create a practical improvement plan with owners, priorities, timelines and follow-up review points.'
      }
    ],
    deliverables: [
      'PAMMS readiness report',
      'Quality evidence checklist',
      'Improvement plan',
      'Mock review preparation notes',
      'Leadership briefing'
    ],
    checklists: [
      {
        title: 'Readiness areas',
        items: [
          'Care plans and risk assessments',
          'Medication, incidents and safeguarding evidence',
          'Staff files, supervision and training records',
          'Governance audits and action tracking',
          'Service user feedback and outcomes evidence'
        ]
      }
    ],
    faqs: [
      {
        question: 'What is PAMMS preparation?',
        answer:
          'It is structured preparation for quality monitoring expectations, including evidence review, operational gap analysis and practical planning to improve service readiness.'
      },
      {
        question: 'Can you provide a mock review?',
        answer: 'Yes. We can structure a mock readiness review and provide clear notes on risks, strengths and actions.'
      },
      {
        question: 'Do you only support PAMMS?',
        answer:
          'No. The same improvement work can support broader quality monitoring, commissioning conversations and operational stabilisation.'
      }
    ],
    related: [
      'cqc-inspection-support',
      'care-compliance-policies-protocols',
      'cqc-ofsted-registration-support',
      'tender-bidding-operational-planning'
    ],
    formVariant: 'consultation',
    primaryCta: 'Request a readiness assessment',
    secondaryCta: 'Explore compliance systems'
  },
  {
    slug: 'cqc-ofsted-registration-support',
    title: 'CQC / Ofsted / Regulatory Registration Support',
    navLabel: 'CQC & Ofsted Registration',
    href: '/services/cqc-ofsted-registration-support',
    category: 'Regulatory and compliance',
    icon: 'shield',
    eyebrow: 'Registration pathway support',
    summary:
      'Registration planning, statement of purpose support, policy readiness and launch-stage regulatory preparation for care businesses.',
    hero: 'Move from care business idea to a more credible registration pathway with structured support for documents, policies, roles, governance and service readiness.',
    seo: {
      title: 'CQC Registration Support & Ofsted Preparation | Care Atlas',
      description:
        'CQC registration support, Ofsted registration support and regulatory preparation for UK care business setup and launch-stage providers.'
    },
    audience: [
      'New care business founders preparing for registration',
      'Existing providers adding a regulated activity or service line',
      'Organisations that need stronger registration documents',
      'Registered manager candidates and leadership teams preparing for interview'
    ],
    included: [
      'Registration pathway planning',
      'Statement of purpose support',
      'Policy pack readiness review',
      'Governance and operational process mapping',
      'Registered manager preparation guidance',
      'Launch readiness and evidence organisation'
    ],
    problems: [
      'Business idea is clear but regulatory pathway is not',
      'Statement of purpose and policies do not reflect real operations',
      'Founders underestimate governance, staffing and quality evidence',
      'Launch planning is disconnected from compliance requirements'
    ],
    benefits: [
      'Clearer understanding of registration stage and next actions',
      'Stronger registration documentation',
      'Better alignment between service model and governance',
      'More confidence before interviews or external review'
    ],
    process: [
      {
        title: 'Stage selector',
        body: 'We establish whether you are exploring, preparing documents, submitting, responding to questions or preparing for launch.'
      },
      {
        title: 'Document preparation',
        body: 'We support statement of purpose, policy readiness, governance records and process maps that match the intended service.'
      },
      {
        title: 'Operational readiness',
        body: 'We review staffing, safeguarding, care planning, quality assurance and leadership arrangements.'
      },
      {
        title: 'Launch support',
        body: 'We help convert registration preparation into practical operating systems for day one and beyond.'
      }
    ],
    deliverables: [
      'Registration readiness plan',
      'Statement of purpose support notes',
      'Policy and document checklist',
      'Operational process map',
      'Interview preparation prompts'
    ],
    checklists: [
      {
        title: 'What stage are you at?',
        items: [
          'Idea and business model validation',
          'Policy and governance preparation',
          'Application and documentation review',
          'Interview or follow-up preparation',
          'Post-registration mobilisation'
        ]
      },
      {
        title: 'Document preparation checklist',
        items: [
          'Statement of purpose',
          'Safeguarding and complaints processes',
          'Governance and quality assurance approach',
          'Staff recruitment, induction and training records',
          'Business continuity and risk management plans'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can you help me start a care business?',
        answer:
          'Yes. We can help you understand the registration pathway, prepare core documents, design operating processes and plan a credible launch.'
      },
      {
        question: 'Do you support CQC and Ofsted registration?',
        answer:
          'We can support regulatory preparation for CQC and Ofsted-related routes where relevant to your service model. The approach is tailored to the regulated activity and client group.'
      },
      {
        question: 'Can you write my entire application for me?',
        answer:
          'We provide structured support, review and document preparation guidance. The provider remains responsible for accuracy, ownership and truthful representation of the service.'
      }
    ],
    related: [
      'cqc-inspection-support',
      'care-compliance-policies-protocols',
      'care-training-organisations-individuals',
      'websites-technology-systems-support'
    ],
    formVariant: 'registration',
    primaryCta: 'Start your registration journey',
    secondaryCta: 'Request policy support'
  },
  {
    slug: 'cqc-inspection-support',
    title: 'CQC Inspection Support for Care Providers',
    navLabel: 'CQC Inspection Support',
    href: '/services/cqc-inspection-support',
    category: 'Regulatory and compliance',
    icon: 'shield',
    eyebrow: 'Inspection readiness',
    summary:
      'CQC inspection preparation, mock inspection support, evidence mapping, governance review, policy review and audit readiness for care providers.',
    hero: 'Prepare for first, planned or responsive CQC inspections with structured evidence preparation, mock inspection support and practical readiness actions across the key question areas.',
    description:
      'This service supports care providers that need to organise evidence, test readiness and address gaps before CQC scrutiny. Care Atlas reviews governance, policies, care files, medication evidence, staff files, quality assurance records and well-led evidence, then maps actions against safe, effective, caring, responsive and well-led expectations where relevant.',
    seo: {
      title: 'CQC Inspection Support and Mock Inspection Preparation | Care Atlas',
      description:
        'CQC inspection support, mock inspections, evidence preparation, governance review, care file audits, medication audit readiness and well-led evidence mapping.'
    },
    audience: [
      'New providers preparing for a first CQC inspection',
      'Existing domiciliary care or supported living providers expecting planned inspection activity',
      'Services responding to concerns, complaints, incidents or responsive inspection risk',
      'Registered managers, nominated individuals and directors who need clearer governance evidence'
    ],
    included: [
      'First, planned or responsive inspection preparation',
      'Mock inspection or focused readiness review',
      'Evidence preparation and gap identification',
      'Governance, policy and procedure review',
      'Care file, medication and staff file audit preparation',
      'Quality assurance, PIR-style and well-led evidence mapping where relevant'
    ],
    problems: [
      'Evidence exists but is spread across folders, systems, emails and paper files',
      'Governance records do not clearly show learning, action tracking or provider oversight',
      'Care files, medication records or staff files may not be inspection-ready',
      'Managers are unclear how to evidence safe, effective, caring, responsive and well-led practice'
    ],
    benefits: [
      'More organised evidence before inspection activity',
      'Clearer visibility of gaps, risks and urgent actions',
      'Better alignment between policies, audits, care records and governance',
      'Improved confidence for registered managers, nominated individuals and provider leaders'
    ],
    outcomes: [
      'A prioritised CQC readiness action plan',
      'Evidence mapped against relevant quality statements and key question areas',
      'Clearer governance records, audit trails and provider oversight evidence',
      'Better preparation for manager, staff and leadership inspection conversations'
    ],
    process: [
      {
        title: 'Inspection context review',
        body: 'We confirm inspection type, service model, regulated activities, previous ratings or concerns, timescale and immediate risk areas.'
      },
      {
        title: 'Evidence request',
        body: 'We identify the documents, audits, care records, staff files, policies and governance evidence needed for review.'
      },
      {
        title: 'Mock inspection or focused audit',
        body: 'The review tests selected evidence areas, including care file quality, medication audit preparation, staff file readiness and quality assurance records.'
      },
      {
        title: 'Gap mapping',
        body: 'Findings are mapped against safe, effective, caring, responsive and well-led expectations where relevant, with clear risk levels.'
      },
      {
        title: 'Readiness action plan',
        body: 'Care Atlas sets out immediate, short-term and governance actions so leaders can evidence improvement and ownership.'
      }
    ],
    deliverables: [
      'CQC inspection readiness report',
      'Evidence map and document request list',
      'Care file, medication and staff file audit findings where included',
      'Governance and well-led evidence review notes',
      'Prioritised inspection action plan'
    ],
    checklists: [
      {
        title: 'Inspection preparation areas',
        items: [
          'First, planned and responsive inspection preparation',
          'Mock inspection and evidence preparation',
          'Policy review and governance review',
          'Care file audits and medication audit preparation',
          'Staff file audits and quality assurance evidence'
        ]
      },
      {
        title: 'Evidence mapping areas',
        items: [
          'Safe evidence, risk management, safeguarding and medicines',
          'Effective evidence, training, supervision and care planning',
          'Caring and responsive evidence, feedback, dignity and complaints',
          'Well-led evidence, audits, provider oversight and improvement plans',
          'PIR-style preparation where relevant to the provider context'
        ]
      }
    ],
    commercialNote:
      'Care Atlas does not guarantee any CQC inspection rating, judgement or regulatory outcome. The service helps providers prepare, organise evidence, identify gaps, prioritise actions and improve readiness. The provider remains responsible for safe care delivery, accurate records, regulatory notifications and compliance decisions.',
    faqs: [
      {
        question: 'Can you guarantee a CQC rating?',
        answer:
          'No. Care Atlas does not guarantee inspection outcomes. The service supports preparation, evidence organisation, gap identification and readiness improvement.'
      },
      {
        question: 'Can you support first inspections?',
        answer:
          'Yes. New providers can use the service to prepare evidence, test governance arrangements, review care and staff files, and organise well-led evidence before first inspection activity.'
      },
      {
        question: 'Do you review care files and medication records?',
        answer:
          'Yes, where included in scope. We can review selected care files, risk assessments, medication audit evidence and related action tracking to identify readiness gaps.'
      },
      {
        question: 'What does well-led evidence mapping include?',
        answer:
          'It can include governance meetings, audits, provider oversight, quality assurance, action plans, incidents, complaints, feedback, policies, staff supervision and evidence of learning and improvement.'
      }
    ],
    related: [
      'care-compliance-policies-protocols',
      'pamms-preparation-care-consultancy',
      'cqc-ofsted-registration-support'
    ],
    formVariant: 'inspection',
    primaryCta: 'Request inspection support',
    secondaryCta: 'View compliance support'
  },
  {
    slug: 'care-recruitment-registered-manager-finder',
    title: 'Care Agency, Recruitment & Registered Manager Finder',
    navLabel: 'Recruitment & Managers',
    href: '/services/care-recruitment-registered-manager-finder',
    category: 'Staffing and careers',
    icon: 'users',
    eyebrow: 'Care staffing support',
    summary:
      'Care staff recruitment, registered manager search support, employer enquiries and candidate signup flows for care professionals.',
    hero: 'Find better-fit care workers, registered managers and operational staff through a focused recruitment support pathway for care employers and candidates.',
    seo: {
      title: 'Care Recruitment & Registered Manager Finder | Care Atlas',
      description:
        'Care recruitment, care staff recruitment and registered manager recruitment support for UK care providers and job-seeking care professionals.'
    },
    audience: [
      'Care agencies and supported living providers hiring staff',
      'Providers searching for a registered manager',
      'Employers planning new packages or service mobilisation',
      'Care workers and managers looking for new opportunities'
    ],
    included: [
      'Employer vacancy intake',
      'Registered manager finder support',
      'Candidate registration pathway',
      'Role category and location preference capture',
      'Shortlisting and matching workflow planning',
      'Urgent staffing support triage'
    ],
    problems: [
      'Vacancies are urgent but role requirements are unclear',
      'Registered manager hiring is slowing registration or growth',
      'Candidate information is inconsistent or incomplete',
      'Employers need a care-sector-aware recruitment partner'
    ],
    benefits: [
      'Cleaner employer brief and candidate profile process',
      'More focused registered manager search',
      'Better candidate matching information',
      'Recruitment workflow ready for future CRM or dashboard integration'
    ],
    process: [
      {
        title: 'Employer intake',
        body: 'We capture the role, service type, urgency, location, shift pattern, experience requirements and compliance considerations.'
      },
      {
        title: 'Role definition',
        body: 'We shape the brief so candidates understand the work and employers can compare fit consistently.'
      },
      {
        title: 'Candidate registration',
        body: 'Candidates can register interest, upload CV details and share availability, location and experience preferences.'
      },
      {
        title: 'Matching support',
        body: 'We prepare a practical matching workflow that can support shortlisting, communication and follow-up.'
      }
    ],
    deliverables: [
      'Employer recruitment brief',
      'Registered manager requirement profile',
      'Candidate data structure',
      'Shortlisting criteria',
      'Recruitment follow-up plan'
    ],
    checklists: [
      {
        title: 'Role categories',
        items: [
          'Care worker',
          'Support worker',
          'Senior care worker',
          'Registered manager',
          'Deputy manager',
          'Trainer or compliance lead'
        ]
      }
    ],
    faqs: [
      {
        question: 'Do you support registered manager recruitment?',
        answer:
          'Yes. We help employers define the registered manager profile, capture requirements and prepare a focused search and matching process.'
      },
      {
        question: 'Can carers register for jobs?',
        answer:
          'Yes. The careers page includes a candidate signup flow for care workers and managers who want to hear about suitable opportunities.'
      },
      {
        question: 'Can employers request urgent staffing support?',
        answer: 'Yes. The employer form captures urgency so enquiries can be triaged appropriately.'
      }
    ],
    related: [
      'permanent-part-time-care-recruitment',
      'bank-staff-agency-staffing',
      'care-training-organisations-individuals',
      'care-compliance-policies-protocols'
    ],
    formVariant: 'recruitment',
    primaryCta: 'Enquire about recruitment',
    secondaryCta: 'Apply for care jobs'
  },
  {
    slug: 'bank-staff-agency-staffing',
    title: 'Bank Staff & Agency Staffing for Care Providers',
    navLabel: 'Bank Staff & Agency Staffing',
    href: '/services/bank-staff-agency-staffing',
    category: 'Staffing and careers',
    icon: 'users',
    eyebrow: 'Flexible care staffing',
    summary:
      'Temporary, flexible and bank staffing support for providers managing sickness, annual leave, rota gaps, growth and emergency cover.',
    hero: 'Access temporary and flexible staffing support for domiciliary care, supported living and other regulated care services when rota gaps, sickness, growth or emergency cover place pressure on safe delivery.',
    description:
      'This service helps care providers request suitable temporary workers or build a reliable bank staffing pipeline. Care Atlas supports the staffing brief, availability management, compliance evidence review and communication needed to place general carers, support workers, bank staff, senior carers, nurses, care coordinators, care managers and registered manager candidates where appropriate.',
    seo: {
      title: 'Bank Staff and Agency Staffing for Care Providers | Care Atlas',
      description:
        'Temporary care staffing, bank staff, agency carers, support workers, senior carers, nurses and care managers for UK care providers managing rota gaps.'
    },
    audience: [
      'Domiciliary care providers covering sickness, annual leave or short-notice absence',
      'Supported living services needing consistent cover across day, night or sleep-in shifts',
      'Providers mobilising new packages while permanent recruitment continues',
      'Registered managers and care coordinators trying to stabilise rotas without lowering compliance expectations'
    ],
    included: [
      'Temporary staffing requirement intake and urgency triage',
      'Role, shift, location and client group briefing',
      'Bank staff and agency worker availability coordination',
      'Right to work, DBS, reference, training and experience evidence review where applicable',
      'Shift confirmation, communication and follow-up process',
      'Escalation route for cancelled shifts, suitability concerns or urgent cover changes'
    ],
    problems: [
      'Rota gaps caused by sickness, annual leave, vacancies or rapid service growth',
      'Emergency cover requests that are not clearly documented or risk assessed',
      'Managers spending too much time chasing availability manually',
      'Temporary workers arriving without a clear brief, compliance context or shift expectation'
    ],
    benefits: [
      'Clearer process for requesting temporary staff',
      'Better visibility of worker availability and cover status',
      'Reduced pressure on registered managers and coordinators during rota disruption',
      'A safer distinction between flexible staffing support and long-term recruitment'
    ],
    outcomes: [
      'A documented staffing request with role, location, shift and risk context',
      'A clearer view of suitable temporary staff options and availability',
      'Improved continuity planning during absence, annual leave and emergency cover',
      'A practical audit trail for staffing decisions and follow-up actions'
    ],
    process: [
      {
        title: 'Request staff',
        body: 'The provider submits the role type, shift pattern, location, start date, client group, urgency and any specialist requirements.'
      },
      {
        title: 'Confirm compliance context',
        body: 'We clarify the checks needed for the role, including right to work, DBS status, references, training, experience and any service-specific requirements.'
      },
      {
        title: 'Check availability',
        body: 'Suitable bank or temporary workers are matched against availability, shift pattern, travel area, experience and suitability for the service environment.'
      },
      {
        title: 'Confirm cover',
        body: 'Shift details, reporting instructions and escalation contacts are confirmed so the provider, worker and coordinator understand expectations.'
      },
      {
        title: 'Review after shift',
        body: 'Feedback, concerns, cancellations and repeat booking suitability are captured to strengthen future staffing decisions.'
      }
    ],
    deliverables: [
      'Temporary staffing request record',
      'Role and shift briefing summary',
      'Compliance evidence checklist',
      'Availability and booking status update',
      'Post-shift feedback and follow-up notes'
    ],
    checklists: [
      {
        title: 'Roles covered',
        items: [
          'General carers and domiciliary care workers',
          'Support workers for supported living or community support',
          'Bank staff and flexible workers',
          'Senior carers and shift leads',
          'Nurses, care coordinators, care managers and registered manager candidates where appropriate'
        ]
      },
      {
        title: 'Common cover reasons',
        items: [
          'Sickness and short-notice absence',
          'Annual leave and planned rota pressure',
          'Growth, mobilisation and new packages',
          'Emergency cover and safeguarding-driven continuity needs',
          'Temporary support while permanent recruitment is underway'
        ]
      }
    ],
    commercialNote:
      'Temporary staffing is different from permanent recruitment. Agency or bank support is usually shift, cover or availability-led, while permanent recruitment is based on a long-term role brief and placement terms. Exact rates, cancellation terms, worker status, compliance responsibilities and payment arrangements should be confirmed in the service agreement.',
    faqs: [
      {
        question: 'How do providers request temporary staff?',
        answer:
          'Providers submit the role, shift, location, start date, client group, urgency and compliance requirements through the staffing enquiry route. Care Atlas then confirms what information is needed before availability can be checked.'
      },
      {
        question: 'How are compliance checks handled?',
        answer:
          'The required checks depend on the role and setting. Typical areas include right to work, DBS status, references, training, experience and service-specific onboarding evidence. Responsibilities and acceptable evidence should be confirmed before cover is agreed.'
      },
      {
        question: 'How is staff availability managed?',
        answer:
          'Availability is matched against role, location, shift pattern, travel area, experience and suitability. Confirmed cover should include reporting instructions, escalation contacts and any important risk or care context.'
      },
      {
        question: 'When should I use agency staffing instead of permanent recruitment?',
        answer:
          'Agency or bank staffing is usually best for sickness, annual leave, growth pressure, emergency cover and rota gaps. Permanent recruitment is better when the provider needs a long-term employee or stable part-time placement.'
      }
    ],
    related: [
      'permanent-part-time-care-recruitment',
      'care-recruitment-registered-manager-finder',
      'care-training-organisations-individuals'
    ],
    formVariant: 'agencyStaffing',
    primaryCta: 'Request temporary staff',
    secondaryCta: 'Discuss recruitment'
  },
  {
    slug: 'permanent-part-time-care-recruitment',
    title: 'Permanent & Part-Time Care Staff Recruitment',
    navLabel: 'Permanent Staff Placement',
    href: '/services/permanent-part-time-care-recruitment',
    category: 'Staffing and careers',
    icon: 'briefcase',
    eyebrow: 'Care recruitment placement',
    summary:
      'Permanent, part-time and long-term staff placement for care providers, with screening, interview coordination and post-placement support.',
    hero: 'Recruit competent, trained and compliant care staff for permanent, part-time and long-term roles with a placement-led recruitment service for care providers.',
    description:
      'This recruitment service is separate from agency and bank staffing. It supports employers that want long-term staff appointments and are prepared to pay for each successful placement. Care Atlas can help source and screen carers, support workers, senior carers, bank staff, nurses, care coordinators, care managers and registered managers where appropriate.',
    seo: {
      title: 'Permanent Care Recruitment and Part-Time Staff Placement | Care Atlas',
      description:
        'Permanent care recruitment, part-time staff placement, registered manager recruitment and compliant care staffing support for UK providers.'
    },
    audience: [
      'Domiciliary care agencies hiring permanent carers, coordinators or senior staff',
      'Supported living providers building stable teams for long-term packages',
      'Care businesses seeking registered managers or experienced operational leaders',
      'Providers that want compliant candidate screening before interview and placement'
    ],
    included: [
      'Role briefing and candidate profile definition',
      'Candidate sourcing and attraction across relevant care roles',
      'Initial screening against experience, values, availability and location',
      'Right to work checks and compliance evidence coordination',
      'DBS, reference, training and file readiness guidance where applicable',
      'Interview coordination, placement support and post-placement follow-up'
    ],
    problems: [
      'Permanent vacancies are affecting continuity, quality or service growth',
      'Hiring managers are interviewing candidates who do not meet core requirements',
      'Registered manager or coordinator vacancies are delaying registration, mobilisation or improvement plans',
      'Recruitment activity is not linked to compliance checks, onboarding or retention support'
    ],
    benefits: [
      'A clearer role brief before candidate search starts',
      'More consistent screening and interview coordination',
      'Better link between recruitment, compliance files and onboarding',
      'A commercially clear placement route based on successful hires'
    ],
    outcomes: [
      'A defined role profile with must-have and desirable criteria',
      'A shortlist of candidates matched against the agreed brief where available',
      'Documented screening notes to support employer decision making',
      'Post-placement support and replacement sourcing within agreed warranty terms'
    ],
    process: [
      {
        title: 'Role briefing',
        body: 'We confirm the role, service type, location, salary or rate, hours, duties, must-have experience and compliance expectations.'
      },
      {
        title: 'Candidate sourcing',
        body: 'Potential candidates are identified through relevant care-sector routes, candidate interest records and targeted outreach where appropriate.'
      },
      {
        title: 'Screening',
        body: 'Candidates are screened for experience, availability, location, communication, values, role fit and practical suitability.'
      },
      {
        title: 'Compliance checks',
        body: 'Right to work status and available DBS, reference, training and file evidence are reviewed or coordinated according to the role and agreed process.'
      },
      {
        title: 'Interview and placement',
        body: 'Care Atlas supports interview coordination, feedback, offer communication and placement confirmation once the provider chooses a candidate.'
      },
      {
        title: 'Post-placement support',
        body: 'Early follow-up helps identify onboarding issues, suitability concerns and whether any replacement warranty support may be needed.'
      }
    ],
    deliverables: [
      'Role briefing document',
      'Candidate sourcing and screening plan',
      'Shortlist and screening notes where suitable candidates are available',
      'Interview coordination record',
      'Placement confirmation and post-placement support notes'
    ],
    checklists: [
      {
        title: 'Roles covered',
        items: [
          'Carers and domiciliary care workers',
          'Support workers and senior carers',
          'Bank staff for long-term pools',
          'Nurses and clinical staff where appropriate',
          'Care coordinators, care managers and registered managers'
        ]
      },
      {
        title: 'Recruitment stages',
        items: [
          'Role briefing and success criteria',
          'Candidate sourcing and attraction',
          'Screening and right to work checks',
          'DBS, references and compliance evidence coordination',
          'Interview, placement and post-placement support'
        ]
      }
    ],
    commercialNote:
      'A 6-month replacement warranty can be included for eligible placements. If a placed candidate leaves or is unsuitable within the warranty period, Care Atlas will support sourcing a replacement according to the agreed terms. The warranty is not unlimited and may depend on factors such as role changes, dismissal reason, payment status, employer onboarding, candidate conduct and notification timescales. Final terms should be confirmed in the service agreement.',
    faqs: [
      {
        question: 'How is this different from agency staffing?',
        answer:
          'Permanent recruitment is designed for long-term roles and successful placements. Agency or bank staffing is usually used for temporary shifts, rota gaps and emergency cover.'
      },
      {
        question: 'When does the provider pay?',
        answer:
          'The provider pays for each successful placement according to the agreed recruitment terms. Payment triggers, timing and any deposit or retained search arrangements should be confirmed before sourcing begins.'
      },
      {
        question: 'What checks are included before placement?',
        answer:
          'The process can include role screening, right to work checks, available DBS and reference evidence, training evidence and compliance file coordination. The exact checks depend on the role and agreement.'
      },
      {
        question: 'How does the 6-month replacement warranty work?',
        answer:
          'If an eligible candidate leaves or is unsuitable within the warranty period, Care Atlas will support sourcing a replacement according to the service terms. It does not create unlimited liability and final wording should be confirmed in the service agreement.'
      }
    ],
    related: [
      'bank-staff-agency-staffing',
      'care-recruitment-registered-manager-finder',
      'care-training-organisations-individuals'
    ],
    formVariant: 'permanentRecruitment',
    primaryCta: 'Start a placement search',
    secondaryCta: 'View agency staffing'
  },
  {
    slug: 'care-compliance-policies-protocols',
    title: 'Care Compliance, Policies & Protocol Systems',
    navLabel: 'Policies & Compliance',
    href: '/services/care-compliance-policies-protocols',
    category: 'Regulatory and compliance',
    icon: 'file',
    eyebrow: 'Audit-ready documentation',
    summary:
      'Policy creation, policy review, protocol frameworks, compliance calendars and audit-ready document systems for care services.',
    hero: 'Turn policies and procedures into a working compliance system with clear documents, review cycles, protocols, ownership and evidence trails.',
    seo: {
      title: 'Care Compliance, Policies and Procedures | Care Atlas',
      description:
        'Care compliance support, policies and procedures, protocol systems and compliance process support for UK care providers.'
    },
    audience: [
      'Care providers with outdated policies or unclear processes',
      'New providers building a policy pack for launch',
      'Services preparing for audit, review or commissioner scrutiny',
      'Managers who need a practical compliance calendar'
    ],
    included: [
      'Policy creation and update support',
      'Policy pack review',
      'Protocol and procedure design',
      'Compliance calendar planning',
      'Audit-readiness checklist',
      'Document system structure and version control guidance'
    ],
    problems: [
      'Policies exist but nobody knows which version is current',
      'Procedures do not match daily practice',
      'Compliance tasks rely on memory rather than a system',
      'Audit evidence is difficult to locate quickly'
    ],
    benefits: [
      'Clearer ownership of policies and compliance routines',
      'Stronger audit readiness',
      'Better alignment between documents and operational practice',
      'Reusable structure for future digital compliance systems'
    ],
    process: [
      {
        title: 'Compliance maturity review',
        body: 'We assess current documents, review cycles, ownership, storage and evidence practices.'
      },
      {
        title: 'Policy and protocol mapping',
        body: 'We identify core policy categories and the practical protocols needed to support consistent delivery.'
      },
      {
        title: 'System design',
        body: 'We create a structure for versioning, responsibilities, review dates, evidence and audit follow-up.'
      },
      {
        title: 'Implementation support',
        body: 'We help the team adopt the system so it becomes part of day-to-day governance.'
      }
    ],
    deliverables: [
      'Policy pack review notes',
      'Compliance maturity summary',
      'Protocol framework',
      'Compliance calendar',
      'Audit-readiness checklist'
    ],
    checklists: [
      {
        title: 'Sample document categories',
        items: [
          'Safeguarding and whistleblowing',
          'Medication and incidents',
          'Recruitment, induction and supervision',
          'Care planning and risk assessment',
          'Governance, quality assurance and complaints'
        ]
      },
      {
        title: 'Compliance maturity signals',
        items: [
          'Named owner for each policy',
          'Review dates are tracked',
          'Staff can access current documents',
          'Operational records match stated procedures',
          'Audit actions are assigned and followed up'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can you review existing policies?',
        answer:
          'Yes. We can review your current policies, identify gaps, and help structure updates so the documents are easier to maintain.'
      },
      {
        question: 'Do you create policy packs?',
        answer:
          'We can support policy creation and policy pack structuring, with emphasis on making the documents relevant to the actual service.'
      },
      {
        question: 'Can this connect to digital systems later?',
        answer:
          'Yes. The structure is designed so it can later connect to portals, dashboards, document libraries or compliance workflow tools.'
      }
    ],
    related: [
      'cqc-inspection-support',
      'pamms-preparation-care-consultancy',
      'cqc-ofsted-registration-support',
      'websites-technology-systems-support'
    ],
    formVariant: 'compliance',
    primaryCta: 'Get compliance support',
    secondaryCta: 'Book a policy review'
  },
  {
    slug: 'tender-bidding-operational-planning',
    title: 'Tender Bidding & Operational Planning Consulting',
    navLabel: 'Tender & Planning',
    href: '/services/tender-bidding-operational-planning',
    category: 'Care operations and consultancy',
    icon: 'briefcase',
    eyebrow: 'Bid and mobilisation planning',
    summary:
      'Tender bidding support, operational planning, mobilisation readiness and service design consulting for care organisations.',
    hero: 'Approach care tenders and new service opportunities with stronger bid structure, operational assumptions, staffing plans, risk thinking and mobilisation detail.',
    seo: {
      title: 'Tender Bidding Support for Care Providers | Care Atlas',
      description:
        'Tender bidding support, operational planning for care services and mobilisation consulting for UK care providers.'
    },
    audience: [
      'Care businesses bidding for local authority or commissioned work',
      'Providers planning mobilisation for a new contract',
      'Founders building a credible operational plan',
      'Teams that need clearer risk, staffing and delivery assumptions'
    ],
    included: [
      'Tender readiness review',
      'Bid structure and response planning',
      'Operational mobilisation support',
      'Service design and staffing assumptions',
      'Risk and implementation planning',
      'Delivery evidence and outcomes narrative'
    ],
    problems: [
      'Bid responses do not clearly explain delivery capability',
      'Operational plans lack staffing, risk and mobilisation detail',
      'Evidence is available but not organised into a strong narrative',
      'New contracts are won without a realistic delivery plan'
    ],
    benefits: [
      'More structured tender responses',
      'Clearer operational mobilisation plan',
      'Better connection between promises, staffing and delivery reality',
      'Stronger readiness for commissioners and internal teams'
    ],
    process: [
      {
        title: 'Opportunity review',
        body: 'We review the tender, commissioner expectations, service scope, timelines and evidence requirements.'
      },
      {
        title: 'Response planning',
        body: 'We structure the response themes, operational examples, compliance evidence and outcomes narrative.'
      },
      {
        title: 'Mobilisation design',
        body: 'We map staffing, governance, risk, systems, training and launch actions needed to deliver the service.'
      },
      {
        title: 'Review and refinement',
        body: 'We support final review, gap checks and practical implementation planning.'
      }
    ],
    deliverables: [
      'Tender support plan',
      'Bid response structure',
      'Operational readiness checklist',
      'Mobilisation timeline',
      'Risk and delivery assumptions map'
    ],
    checklists: [
      {
        title: 'Operational readiness checklist',
        items: [
          'Service scope and outcomes are defined',
          'Staffing model and rota assumptions are realistic',
          'Compliance and quality evidence is organised',
          'Mobilisation milestones are assigned',
          'Risks, mitigations and escalation routes are clear'
        ]
      }
    ],
    faqs: [
      {
        question: 'Can you help write tender responses?',
        answer:
          'We support bid structure, response planning, evidence mapping and review. The strongest work usually comes from combining your service knowledge with our operational and care-sector framing.'
      },
      {
        question: 'Do you help after a tender is won?',
        answer:
          'Yes. Mobilisation planning is a key part of the service because winning the work is only useful if the delivery plan is credible.'
      },
      {
        question: 'Can you support early-stage care businesses?',
        answer:
          'Yes. We can help founders think through operational planning even before formal tender activity begins.'
      }
    ],
    related: [
      'pamms-preparation-care-consultancy',
      'permanent-part-time-care-recruitment',
      'bank-staff-agency-staffing',
      'websites-technology-systems-support'
    ],
    formVariant: 'tender',
    primaryCta: 'Plan a tender response',
    secondaryCta: 'Discuss mobilisation'
  },
  {
    slug: 'care-training-organisations-individuals',
    title: 'Care Training for Organisations & Individuals',
    navLabel: 'Care Training',
    href: '/services/care-training-organisations-individuals',
    category: 'Training and capability building',
    icon: 'graduation',
    eyebrow: 'Capability building',
    summary:
      'Training enquiries, organisation learning pathways, induction support and professional development for care teams and individuals.',
    hero: 'Build practical capability across care teams and individual careers with training pathways aligned to compliance expectations, day-to-day practice and service improvement.',
    seo: {
      title: 'Care Training for Organisations and Individuals | Care Atlas',
      description:
        'Care training, induction support and professional development enquiries for UK care organisations, carers and registered managers.'
    },
    audience: [
      'Care organisations planning team training',
      'New starters who need induction-aligned learning',
      'Care workers and managers building confidence',
      'Providers connecting training to compliance and quality improvement'
    ],
    included: [
      'Organisation training needs review',
      'Training catalogue and course enquiry structure',
      'Individual learner interest capture',
      'Induction and refresher training planning',
      'Compliance-aligned learning pathways',
      'Remote and in-person delivery placeholders'
    ],
    problems: [
      'Training is reactive and not linked to service risk',
      'Induction records are incomplete or inconsistent',
      'Staff need development but courses are not prioritised',
      'Individuals want clearer pathways into care work'
    ],
    benefits: [
      'More structured learning plans',
      'Better link between training and compliance evidence',
      'Clearer pathways for individuals and teams',
      'Training enquiry flow ready for future booking integration'
    ],
    process: [
      {
        title: 'Needs review',
        body: 'We identify audience, risk areas, compliance requirements and development priorities.'
      },
      {
        title: 'Programme selection',
        body: 'We help select or shape suitable course categories for organisations or individual learners.'
      },
      {
        title: 'Booking and delivery planning',
        body: 'The enquiry flow captures preferred delivery format, group size, dates and learning goals.'
      },
      {
        title: 'Evidence and improvement',
        body: 'Training outputs can be aligned with induction, supervision, audit and quality improvement evidence.'
      }
    ],
    deliverables: [
      'Training needs summary',
      'Course category recommendations',
      'Booking enquiry record',
      'Learning pathway outline',
      'Post-training improvement prompts'
    ],
    checklists: [
      {
        title: 'Training categories',
        items: [
          'Care induction and care certificate support',
          'Safeguarding and risk awareness',
          'Medication and record keeping',
          'Leadership and registered manager preparation',
          'Compliance, quality and governance'
        ]
      }
    ],
    faqs: [
      {
        question: 'Do you train organisations and individuals?',
        answer:
          'Yes. The training enquiry flow supports both employers arranging team training and individuals looking to develop care-sector skills.'
      },
      {
        question: 'Can training be remote or in person?',
        answer:
          'The site is prepared for both options. Actual delivery formats can be confirmed during enquiry and scheduling.'
      },
      {
        question: 'Can training support compliance evidence?',
        answer:
          'Yes. We encourage training plans that connect to induction, supervision, audit actions and quality improvement.'
      }
    ],
    related: [
      'permanent-part-time-care-recruitment',
      'care-recruitment-registered-manager-finder',
      'care-compliance-policies-protocols',
      'cqc-ofsted-registration-support'
    ],
    formVariant: 'training',
    primaryCta: 'Enquire about training',
    secondaryCta: 'View careers'
  },
  {
    slug: 'websites-technology-systems-support',
    title: 'Websites, Technology & Systems Support for Care Providers',
    navLabel: 'Websites & Technology',
    href: '/services/websites-technology-systems-support',
    category: 'Technology and websites',
    icon: 'spark',
    eyebrow: 'Care technology support',
    summary:
      'Website design for care providers, maintenance plans, digital forms, booking systems, CRM support and operational software consulting.',
    hero: 'Use technology more confidently across your care business with websites, forms, portals, dashboards, internal tools and practical systems support delivered with Cosmonaut Labs.',
    seo: {
      title: 'Care Technology Support & Website Design for Care Providers | Care Atlas',
      description:
        'Care technology support, website design for care providers, care systems support and digital enablement delivered with Cosmonaut Labs.'
    },
    audience: [
      'Care agencies and supported living providers needing credible websites',
      'Providers that want forms, booking flows or CRM integration',
      'Teams replacing spreadsheet-heavy operational processes',
      'Care businesses planning portals, dashboards or internal tools'
    ],
    included: [
      'Website design and maintenance planning',
      'Care technology audit',
      'Booking, form and lead-routing workflow design',
      'CRM and system integration planning',
      'Dashboard, portal and internal tool discovery',
      'Partner delivery with Cosmonaut Labs'
    ],
    problems: [
      'Website does not build trust with commissioners, candidates or families',
      'Leads and enquiries are not routed clearly',
      'Operational information lives across disconnected spreadsheets',
      'Care teams need technology guidance that understands the sector'
    ],
    benefits: [
      'More credible digital presence',
      'Cleaner enquiry and booking workflows',
      'Technology roadmap aligned with operational needs',
      'Future-ready structure for dashboards, portals and software'
    ],
    process: [
      {
        title: 'Technology audit',
        body: 'We review the current website, forms, workflows, data capture, systems and digital pain points.'
      },
      {
        title: 'Solution design',
        body: 'We define the right level of website, system, form, CRM, portal or dashboard support for the business stage.'
      },
      {
        title: 'Build planning',
        body: 'Care Atlas shapes the care-sector requirements while Cosmonaut Labs supports the technical delivery plan.'
      },
      {
        title: 'Maintenance and improvement',
        body: 'We prepare a route for updates, content changes, analytics, support requests and future roadmap work.'
      }
    ],
    deliverables: [
      'Technology audit summary',
      'Website or system project brief',
      'Digital workflow map',
      'Maintenance plan recommendation',
      'Future roadmap'
    ],
    checklists: [
      {
        title: 'Digital deliverables',
        items: [
          'Websites for care agencies and supported living providers',
          'Booking systems and consultation flows',
          'Recruitment and candidate signup forms',
          'Dashboards, portals and internal tools',
          'Care operations software and data capture workflows'
        ]
      },
      {
        title: 'Maintenance plan comparison',
        items: [
          'Essential website updates',
          'Growth content and landing page support',
          'Systems and workflow improvement support',
          'Analytics, lead tracking and conversion review',
          'Technical support and roadmap planning'
        ]
      }
    ],
    faqs: [
      {
        question: 'Do you build websites for care providers?',
        answer:
          'Yes. Care Atlas can shape the care-sector content and conversion journey while Cosmonaut Labs supports the technical build.'
      },
      {
        question: 'Can you help with systems beyond websites?',
        answer:
          'Yes. The service covers forms, booking flows, dashboards, portals, CRM workflows, internal tools and technology consulting.'
      },
      {
        question: 'Can you maintain the website after launch?',
        answer: 'Yes. The page includes maintenance plan structures that can be refined into service packages.'
      }
    ],
    related: [
      'care-compliance-policies-protocols',
      'care-recruitment-registered-manager-finder',
      'tender-bidding-operational-planning'
    ],
    formVariant: 'technology',
    primaryCta: 'Request a technology audit',
    secondaryCta: 'Meet Cosmonaut Labs'
  }
]

export const testimonials: Testimonial[] = [
  {
    quote:
      'Care Atlas helped us turn a vague launch plan into a practical route with documents, responsibilities and next steps we could actually follow.',
    name: 'Founder',
    initials: 'FO',
    role: 'Launch-stage leadership team',
    providerType: 'Supported living provider',
    location: 'West Midlands'
  },
  {
    quote:
      'The work felt grounded in care operations, not generic consultancy. The recommendations were clear, realistic and easy to prioritise.',
    name: 'Operations Lead',
    initials: 'OL',
    role: 'Operational improvement project',
    providerType: 'Domiciliary care agency',
    location: 'Greater Manchester'
  },
  {
    quote:
      'We needed technology support that understood compliance, recruitment and service delivery. The Care Atlas and Cosmonaut Labs partnership made that easier.',
    name: 'Director',
    initials: 'DI',
    role: 'Digital systems and growth support',
    providerType: 'Growing care provider',
    location: 'London'
  }
]

export const blogCategories = [
  'Care Compliance',
  'CQC',
  'Supported Living',
  'Housing Benefit',
  'Care Recruitment',
  'Care Technology',
  'Policies and Procedures',
  'Training',
  'Care Business Growth'
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'prepare-care-service-for-regulatory-review',
    title: 'How to prepare your care service for regulatory review',
    excerpt:
      'A practical guide to evidence, governance, leadership preparation and improvement planning before external scrutiny.',
    category: 'Care Compliance',
    date: '2026-05-01',
    author: 'Care Atlas Team',
    readTime: '6 min read',
    tags: ['PAMMS', 'CQC', 'Quality'],
    seo: {
      title: 'How to Prepare Your Care Service for Regulatory Review | Care Atlas',
      description:
        'Practical guidance for care providers preparing for regulatory review, quality monitoring and compliance evidence checks.'
    },
    sections: [
      {
        title: 'Start with the evidence trail',
        body: 'Regulatory confidence is built from consistent records, clear ownership and evidence that the service learns from incidents, feedback and audits.'
      },
      {
        title: 'Test policies against practice',
        body: 'Policies should describe what the service actually does. Review the gap between written procedures and day-to-day routines before anyone external asks.'
      },
      {
        title: 'Create an action plan that moves',
        body: 'A good improvement plan has owners, dates and follow-up. It is not a folder for good intentions; it is a management tool.'
      }
    ]
  },
  {
    slug: 'supported-living-providers-housing-benefit',
    title: 'What supported living providers should understand about housing benefit',
    excerpt:
      'Key questions for supported living operators considering housing benefit pathways, documentation and housing structure.',
    category: 'Housing Benefit',
    date: '2026-04-18',
    author: 'Care Atlas Team',
    readTime: '7 min read',
    tags: ['Supported Living', 'Housing Association', 'Housing Benefit'],
    seo: {
      title: 'Supported Living Housing Benefit Considerations | Care Atlas',
      description:
        'Important considerations for supported living providers reviewing housing benefit support, housing association structures and documentation.'
    },
    sections: [
      {
        title: 'Clarify the model early',
        body: 'Before committing to a property, clarify the client group, support model, tenancy approach, landlord role and evidence requirements.'
      },
      {
        title: 'Documentation needs to tell the same story',
        body: 'Property information, support plans, policies and service descriptions should be consistent. Inconsistency creates avoidable questions.'
      },
      {
        title: 'Plan operations around the housing structure',
        body: 'Housing is not separate from service delivery. Staffing, support planning, safeguarding and escalation routes should be designed together.'
      }
    ]
  },
  {
    slug: 'systems-growing-care-provider-needs',
    title: 'Key systems every growing care provider needs',
    excerpt:
      'The operational systems that help care businesses move beyond spreadsheets without losing control of quality and responsiveness.',
    category: 'Care Technology',
    date: '2026-04-05',
    author: 'Cosmonaut Labs',
    readTime: '5 min read',
    tags: ['Care Technology', 'Systems', 'Operations'],
    seo: {
      title: 'Key Systems Every Growing Care Provider Needs | Care Atlas',
      description:
        'Technology and care systems support guidance for providers looking to improve forms, dashboards, websites and operational workflows.'
    },
    sections: [
      {
        title: 'Start with intake and routing',
        body: 'Every enquiry, referral, candidate and support request should land in a clear place with the right follow-up owner.'
      },
      {
        title: 'Make compliance visible',
        body: 'Compliance calendars, document reviews and audit actions become easier when teams can see what is due, overdue and complete.'
      },
      {
        title: 'Build only what the team can use',
        body: 'The best care technology is not the most complicated. It should reduce friction in the actual workflow.'
      }
    ]
  },
  {
    slug: 'better-policies-strengthen-care-delivery',
    title: 'How better policies strengthen care delivery',
    excerpt:
      'Policies and procedures work best when they are current, specific, accessible and connected to supervision and audit.',
    category: 'Policies and Procedures',
    date: '2026-03-22',
    author: 'Care Atlas Team',
    readTime: '4 min read',
    tags: ['Policies', 'Compliance', 'Governance'],
    seo: {
      title: 'How Better Policies Strengthen Care Delivery | Care Atlas',
      description:
        'Care compliance guidance on policy review, procedures, protocol systems and audit-ready documentation.'
    },
    sections: [
      {
        title: 'Current policies reduce hesitation',
        body: 'When staff can find the right document and trust that it is current, decisions become faster and more consistent.'
      },
      {
        title: 'Procedures need ownership',
        body: 'A policy without an owner becomes stale. Ownership keeps review cycles, training and implementation alive.'
      },
      {
        title: 'Audit evidence starts with routine',
        body: 'The strongest evidence is created through normal practice: supervision notes, incident reviews, actions and quality checks.'
      }
    ]
  },
  {
    slug: 'mistakes-new-care-agencies-make-setup',
    title: 'Common mistakes new care agencies make during setup',
    excerpt:
      'Early-stage care business setup issues around registration, policies, recruitment, websites and operating model clarity.',
    category: 'Care Business Growth',
    date: '2026-03-10',
    author: 'Care Atlas Team',
    readTime: '6 min read',
    tags: ['Care Business Setup', 'CQC', 'Recruitment'],
    seo: {
      title: 'Common Mistakes New Care Agencies Make During Setup | Care Atlas',
      description:
        'Care business setup advice for new agencies preparing registration, policies, recruitment, websites and operating systems.'
    },
    sections: [
      {
        title: 'Starting with documents before the model',
        body: 'Documents matter, but they should follow the service model. Clarify who you support, how you deliver and what risks you manage.'
      },
      {
        title: 'Treating recruitment as a late task',
        body: 'Staffing affects registration readiness, mobilisation and service quality. It should be planned early.'
      },
      {
        title: 'Ignoring digital credibility',
        body: 'A clear website, enquiry flow and candidate journey help the business look real and operate with fewer manual handoffs.'
      }
    ]
  }
]

export const jobListings: JobListing[] = [
  {
    title: 'Support Worker',
    location: 'UK-wide opportunities',
    type: 'Full-time / Part-time',
    summary:
      'Register your interest for supported living and community support roles with providers in the Care Atlas network.',
    tags: ['Supported living', 'Flexible shifts', 'Training pathway']
  },
  {
    title: 'Care Worker',
    location: 'Local provider matching',
    type: 'Permanent / Bank',
    summary: 'Share your experience, location preferences and availability so suitable care work can be matched later.',
    tags: ['Home care', 'Bank work', 'Career development']
  },
  {
    title: 'Registered Manager',
    location: 'UK-wide search support',
    type: 'Permanent',
    summary:
      'Register for registered manager opportunities with providers seeking strong operational and compliance leadership.',
    tags: ['Leadership', 'CQC', 'Service development']
  },
  {
    title: 'Senior Carer',
    location: 'Local provider matching',
    type: 'Permanent / Part-time',
    summary:
      'Register interest in senior care roles supporting shift leadership, mentoring, medication practice and quality standards.',
    tags: ['Senior care', 'Medication', 'Team support']
  },
  {
    title: 'Care Coordinator',
    location: 'Office and hybrid opportunities',
    type: 'Permanent',
    summary:
      'Share your coordination experience for rota, care planning, client communication and provider operations roles.',
    tags: ['Rostering', 'Care planning', 'Operations']
  },
  {
    title: 'Nurse',
    location: 'Role-dependent opportunities',
    type: 'Permanent / Bank',
    summary:
      'Register clinical interest for appropriate nursing, complex care or provider support opportunities where available.',
    tags: ['Clinical', 'Complex care', 'Bank work']
  },
  {
    title: 'Care Manager',
    location: 'UK-wide search support',
    type: 'Permanent',
    summary:
      'Register for operational management roles with providers seeking stronger governance, supervision and service delivery.',
    tags: ['Management', 'Governance', 'Quality']
  }
]

export const globalFaqs: FaqItem[] = [
  {
    question: 'What does Care Atlas do?',
    answer:
      'Care Atlas provides care consultancy, supported living support, registration preparation, compliance systems, recruitment support, training enquiries and technology enablement for UK care businesses.'
  },
  {
    question: 'Do you work with new care businesses?',
    answer:
      'Yes. We support founders from early care business setup through registration planning, policies, staffing, websites, systems and launch readiness.'
  },
  {
    question: 'Can you support existing providers?',
    answer:
      'Yes. Existing providers can use Care Atlas for operational improvement, PAMMS preparation, compliance process support, recruitment, tender planning and digital systems.'
  },
  {
    question: 'Is Cosmonaut Labs part of Care Atlas?',
    answer:
      'Cosmonaut Labs is the technology partner behind digital systems, websites, software and technical enablement for Care Atlas clients.'
  }
]

export function getServiceBySlug(slug: string) {
  return services.find(service => service.slug === slug)
}

export function getServiceByHref(href: string) {
  return services.find(service => service.href === href)
}

export function getRelatedServices(service: Service) {
  return service.related.map(slug => getServiceBySlug(slug)).filter(Boolean) as Service[]
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find(post => post.slug === slug)
}
