export type ProductBillingType = 'one-off' | 'recurring' | 'quote-based'

export type ProductCategory = 'consultation' | 'one-off-service' | 'package' | 'add-on' | 'quote-based' | 'subscription'

export type Product = {
  id: string
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  category: ProductCategory
  serviceSlug: string
  price: string
  currency: 'GBP'
  billingType: ProductBillingType
  stripePriceId: string | null
  stripeProductId: string | null
  isPurchasable: boolean
  requiresConsultation: boolean
  features: string[]
  deliverables: string[]
  timeline: string
  ctaLabel: string
  popular?: boolean
  warrantyText?: string
}

export const products: Product[] = [
  {
    id: 'prod_supported_living_consultation',
    slug: 'supported-living-housing-consultation',
    name: 'Supported Living Housing Consultation',
    shortDescription: 'A focused call on property, housing benefit route, documents and operating model.',
    longDescription:
      'A practical consultation for supported living founders and providers who need early advice before committing to property, landlord arrangements or housing benefit documentation work.',
    category: 'consultation',
    serviceSlug: 'supported-living-housing-benefit',
    price: 'From £225 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_supported_living_consultation_placeholder',
    stripeProductId: 'prod_supported_living_consultation_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Property and model review', 'Document gap discussion', 'Housing benefit pathway questions'],
    deliverables: ['Call summary', 'Priority action list', 'Recommended support route'],
    timeline: '60-75 minutes',
    ctaLabel: 'Book consultation'
  },
  {
    id: 'prod_supported_living_readiness_package',
    slug: 'supported-living-readiness-package',
    name: 'Supported Living Readiness Package',
    shortDescription: 'Document, responsibility and property readiness review for supported living operators.',
    longDescription:
      'A one-off package for providers that need a structured review of property assumptions, housing partner roles, service documentation and readiness gaps before launch or change.',
    category: 'package',
    serviceSlug: 'supported-living-housing-benefit',
    price: 'From £1,250 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_supported_living_readiness_placeholder',
    stripeProductId: 'prod_supported_living_readiness_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Property and service model review', 'Evidence checklist', 'Role and responsibility mapping'],
    deliverables: ['Readiness report', 'Document checklist', 'Implementation priorities'],
    timeline: '5-10 working days after document receipt',
    ctaLabel: 'Purchase package',
    popular: true
  },
  {
    id: 'prod_supported_living_retainer',
    slug: 'supported-living-operations-retainer',
    name: 'Supported Living Operations Retainer',
    shortDescription: 'Monthly support for providers managing housing, documents and operating model decisions.',
    longDescription:
      'A recurring support option for supported living providers with ongoing property, governance, housing partner or documentation workstreams.',
    category: 'subscription',
    serviceSlug: 'supported-living-housing-benefit',
    price: 'From £750 + VAT / month',
    currency: 'GBP',
    billingType: 'recurring',
    stripePriceId: 'price_supported_living_retainer_placeholder',
    stripeProductId: 'prod_supported_living_retainer_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Monthly advisory time', 'Document review allocation', 'Priority planning support'],
    deliverables: ['Monthly action log', 'Document comments', 'Provider check-in notes'],
    timeline: 'Monthly rolling support',
    ctaLabel: 'Start monthly support'
  },
  {
    id: 'prod_supported_living_custom_quote',
    slug: 'supported-living-custom-quote',
    name: 'Supported Living Custom Project',
    shortDescription: 'Quote-led support for complex properties, multiple houses or provider mobilisation.',
    longDescription:
      'A quote-based route for supported living providers where scope depends on property count, stakeholder complexity, documents and mobilisation requirements.',
    category: 'quote-based',
    serviceSlug: 'supported-living-housing-benefit',
    price: 'Quote-based',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Multi-property scoping', 'Stakeholder mapping', 'Custom delivery plan'],
    deliverables: ['Written proposal', 'Scope and assumptions', 'Project quote'],
    timeline: 'Quote after discovery',
    ctaLabel: 'Request quote'
  },
  {
    id: 'prod_pamms_consultation',
    slug: 'pamms-readiness-consultation',
    name: 'PAMMS Readiness Consultation',
    shortDescription: 'A practical review call for providers preparing for quality monitoring or PAMMS-style scrutiny.',
    longDescription:
      'A focused consultation to understand the service stage, evidence quality, review timescale and highest-risk readiness areas.',
    category: 'consultation',
    serviceSlug: 'pamms-preparation-care-consultancy',
    price: 'From £195 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_pamms_consultation_placeholder',
    stripeProductId: 'prod_pamms_consultation_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Readiness triage', 'Evidence discussion', 'Immediate action priorities'],
    deliverables: ['Call notes', 'Risk areas summary', 'Recommended next steps'],
    timeline: '60 minutes',
    ctaLabel: 'Book consultation'
  },
  {
    id: 'prod_pamms_evidence_review',
    slug: 'pamms-evidence-review',
    name: 'PAMMS Evidence Review',
    shortDescription: 'Remote review of selected evidence, governance records and quality monitoring material.',
    longDescription:
      'A one-off remote review designed to identify evidence gaps and produce a practical improvement plan before external scrutiny.',
    category: 'one-off-service',
    serviceSlug: 'pamms-preparation-care-consultancy',
    price: 'From £950 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_pamms_evidence_review_placeholder',
    stripeProductId: 'prod_pamms_evidence_review_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Evidence sample review', 'Governance gap analysis', 'Improvement planning'],
    deliverables: ['Evidence review notes', 'Gap summary', 'Action plan'],
    timeline: '5-7 working days after document receipt',
    ctaLabel: 'Purchase review',
    popular: true
  },
  {
    id: 'prod_pamms_mock_review',
    slug: 'pamms-mock-review-project',
    name: 'PAMMS Mock Review Project',
    shortDescription: 'Quote-led mock review for larger or higher-risk services.',
    longDescription:
      'A scoped mock review for providers who need a deeper assessment across files, governance, staff evidence, quality assurance and improvement planning.',
    category: 'quote-based',
    serviceSlug: 'pamms-preparation-care-consultancy',
    price: 'From £1,800 + VAT',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Mock review planning', 'Evidence and file sampling', 'Leadership feedback session'],
    deliverables: ['Mock review report', 'Priority action plan', 'Leadership briefing'],
    timeline: 'Quoted after scope',
    ctaLabel: 'Request quote'
  },
  {
    id: 'prod_registration_consultation',
    slug: 'cqc-registration-consultation',
    name: 'CQC Registration Consultation',
    shortDescription: 'A launch-stage call on service model, registration pathway and document readiness.',
    longDescription:
      'A consultation for founders and providers who need to understand the registration route, document gaps and launch readiness expectations.',
    category: 'consultation',
    serviceSlug: 'cqc-ofsted-registration-support',
    price: 'From £195 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_registration_consultation_placeholder',
    stripeProductId: 'prod_cqc_registration_consultation_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Registration stage review', 'Document readiness questions', 'Launch risk discussion'],
    deliverables: ['Call summary', 'Document priorities', 'Recommended registration support route'],
    timeline: '60 minutes',
    ctaLabel: 'Book consultation'
  },
  {
    id: 'prod_registration_readiness_review',
    slug: 'cqc-registration-readiness-review',
    name: 'CQC Registration Readiness Review',
    shortDescription: 'Review of statement of purpose, policies and operating model readiness.',
    longDescription:
      'A one-off review for providers that need structured feedback on registration documents, governance assumptions and operational readiness before submission or interview.',
    category: 'one-off-service',
    serviceSlug: 'cqc-ofsted-registration-support',
    price: 'From £950 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_registration_readiness_placeholder',
    stripeProductId: 'prod_cqc_registration_readiness_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Statement of purpose review', 'Policy readiness check', 'Governance and staffing questions'],
    deliverables: ['Readiness notes', 'Document gap list', 'Interview preparation prompts'],
    timeline: '5-10 working days after document receipt',
    ctaLabel: 'Purchase review',
    popular: true
  },
  {
    id: 'prod_registration_full_package',
    slug: 'cqc-registration-support-package',
    name: 'CQC Registration Support Package',
    shortDescription: 'A wider package for registration documents, governance planning and launch readiness.',
    longDescription:
      'A package for founders and providers who need structured help preparing registration documentation, policy readiness, manager preparation and mobilisation actions.',
    category: 'package',
    serviceSlug: 'cqc-ofsted-registration-support',
    price: 'From £2,300 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_registration_package_placeholder',
    stripeProductId: 'prod_cqc_registration_package_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Document support', 'Governance planning', 'Registered manager preparation'],
    deliverables: ['Registration action plan', 'Document checklist', 'Launch readiness summary'],
    timeline: '2-4 weeks depending on scope',
    ctaLabel: 'Purchase package'
  },
  {
    id: 'prod_registration_launch_retainer',
    slug: 'post-registration-launch-retainer',
    name: 'Post-Registration Launch Retainer',
    shortDescription: 'Monthly support after registration for early governance, policies and operating routines.',
    longDescription:
      'A recurring support product for new providers moving from registration preparation into live operational delivery.',
    category: 'subscription',
    serviceSlug: 'cqc-ofsted-registration-support',
    price: 'From £650 + VAT / month',
    currency: 'GBP',
    billingType: 'recurring',
    stripePriceId: 'price_post_registration_retainer_placeholder',
    stripeProductId: 'prod_post_registration_retainer_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Monthly compliance check-in', 'Document review allocation', 'Launch action tracking'],
    deliverables: ['Monthly action log', 'Priority recommendations', 'Document comments'],
    timeline: 'Monthly rolling support',
    ctaLabel: 'Start retainer'
  },
  {
    id: 'prod_cqc_inspection_call',
    slug: 'cqc-inspection-readiness-call',
    name: 'CQC Inspection Readiness Call',
    shortDescription: 'Urgent or planned consultation for inspection preparation and evidence priorities.',
    longDescription:
      'A focused inspection preparation call for registered managers, nominated individuals and directors who need to clarify immediate readiness risks.',
    category: 'consultation',
    serviceSlug: 'cqc-inspection-support',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_inspection_call_placeholder',
    stripeProductId: 'prod_cqc_inspection_call_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Inspection context review', 'Evidence priority discussion', 'Immediate action plan'],
    deliverables: ['Call notes', 'Evidence priorities', 'Recommended next steps'],
    timeline: '60 minutes',
    ctaLabel: 'Book readiness call'
  },
  {
    id: 'prod_cqc_mini_mock',
    slug: 'cqc-mini-mock-inspection',
    name: 'CQC Mini Mock Inspection',
    shortDescription: 'Focused remote review of selected files, governance records and evidence gaps.',
    longDescription:
      'A focused one-off readiness review for providers who need a limited mock inspection across agreed evidence areas.',
    category: 'one-off-service',
    serviceSlug: 'cqc-inspection-support',
    price: 'From £650 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_mini_mock_placeholder',
    stripeProductId: 'prod_cqc_mini_mock_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Evidence sample review', 'Care or staff file spot check', 'Readiness gap list'],
    deliverables: ['Mini mock findings', 'Evidence map', 'Priority action plan'],
    timeline: '5-7 working days after document receipt',
    ctaLabel: 'Purchase mini mock',
    popular: true
  },
  {
    id: 'prod_cqc_full_mock',
    slug: 'cqc-full-mock-inspection-project',
    name: 'CQC Full Mock Inspection Project',
    shortDescription: 'Quote-led mock inspection for services needing deeper readiness review.',
    longDescription:
      'A scoped mock inspection project covering agreed evidence samples, quality statements, governance records and leadership preparation.',
    category: 'quote-based',
    serviceSlug: 'cqc-inspection-support',
    price: 'From £1,500 + VAT',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Mock inspection planning', 'Evidence mapping', 'Leadership briefing'],
    deliverables: ['Mock inspection report', 'Gap analysis', 'Inspection readiness action plan'],
    timeline: 'Quoted after scope',
    ctaLabel: 'Request quote',
    warrantyText:
      'Care Atlas does not guarantee any CQC rating, judgement or regulatory outcome. The provider remains responsible for compliance and care delivery.'
  },
  {
    id: 'prod_recruitment_strategy_call',
    slug: 'care-recruitment-strategy-call',
    name: 'Care Recruitment Strategy Call',
    shortDescription: 'Advice on role structure, candidate profile and recruitment route.',
    longDescription:
      'A consultation for employers deciding whether they need bank staffing, permanent placement, manager search or a wider hiring workflow.',
    category: 'consultation',
    serviceSlug: 'care-recruitment-registered-manager-finder',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_recruitment_strategy_call_placeholder',
    stripeProductId: 'prod_recruitment_strategy_call_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Hiring need review', 'Role structure advice', 'Recruitment route recommendation'],
    deliverables: ['Call summary', 'Candidate profile notes', 'Next-step recommendation'],
    timeline: '60 minutes',
    ctaLabel: 'Book strategy call'
  },
  {
    id: 'prod_recruitment_pipeline_setup',
    slug: 'care-recruitment-pipeline-setup',
    name: 'Care Recruitment Pipeline Setup',
    shortDescription: 'Set up candidate intake, screening fields and matching workflow structure.',
    longDescription:
      'A one-off setup product for providers who need a practical recruitment intake and matching structure before scaling candidate activity.',
    category: 'one-off-service',
    serviceSlug: 'care-recruitment-registered-manager-finder',
    price: 'From £650 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_recruitment_pipeline_setup_placeholder',
    stripeProductId: 'prod_recruitment_pipeline_setup_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Candidate data structure', 'Role categories', 'Shortlisting workflow'],
    deliverables: ['Recruitment workflow map', 'Candidate profile template', 'Shortlisting criteria'],
    timeline: '5-7 working days',
    ctaLabel: 'Purchase setup'
  },
  {
    id: 'prod_registered_manager_search_quote',
    slug: 'registered-manager-search-quote',
    name: 'Registered Manager Search',
    shortDescription: 'Quote-led search for registered manager or senior care leadership candidates.',
    longDescription:
      'A quote-based recruitment route for registered manager or senior care manager searches where fees depend on seniority, location and search complexity.',
    category: 'quote-based',
    serviceSlug: 'care-recruitment-registered-manager-finder',
    price: 'Quote-based, often 15-20% of first-year salary',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Leadership role briefing', 'Candidate search scope', 'Placement terms proposal'],
    deliverables: ['Search proposal', 'Fee structure', 'Warranty terms for agreement'],
    timeline: 'Quote after role brief',
    ctaLabel: 'Request quote'
  },
  {
    id: 'prod_bank_staff_request',
    slug: 'bank-staff-urgent-request',
    name: 'Urgent Bank Staff Request',
    shortDescription: 'Quote-based request route for sickness, annual leave, rota gaps or emergency cover.',
    longDescription:
      'A flexible staffing request for providers that need temporary workers, bank staff or agency cover based on role, shift, location and compliance requirements.',
    category: 'quote-based',
    serviceSlug: 'bank-staff-agency-staffing',
    price: 'Quote-based by role and shift',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Role and shift triage', 'Availability check', 'Compliance evidence route'],
    deliverables: ['Staffing request record', 'Availability update', 'Cover recommendation'],
    timeline: 'Urgency dependent',
    ctaLabel: 'Request staff'
  },
  {
    id: 'prod_bank_staff_consultation',
    slug: 'bank-staffing-consultation',
    name: 'Bank Staffing Consultation',
    shortDescription:
      'A paid call to decide whether temporary staffing, bank pool setup or permanent recruitment fits.',
    longDescription:
      'A practical consultation for providers dealing with rota pressure, sickness, annual leave, growth cover or emergency staffing needs.',
    category: 'consultation',
    serviceSlug: 'bank-staff-agency-staffing',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_bank_staffing_consultation_placeholder',
    stripeProductId: 'prod_bank_staffing_consultation_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Rota gap review', 'Cover route advice', 'Compliance responsibility discussion'],
    deliverables: ['Call summary', 'Recommended staffing route', 'Next-step action list'],
    timeline: '60 minutes',
    ctaLabel: 'Book staffing call'
  },
  {
    id: 'prod_bank_pool_setup',
    slug: 'bank-staff-pool-setup',
    name: 'Bank Staff Pool Setup',
    shortDescription: 'Set up a more organised bank worker intake, availability and compliance process.',
    longDescription:
      'A one-off setup package for providers that want to move from reactive cover requests to a clearer bank staffing pipeline.',
    category: 'package',
    serviceSlug: 'bank-staff-agency-staffing',
    price: 'From £950 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_bank_pool_setup_placeholder',
    stripeProductId: 'prod_bank_pool_setup_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Bank role profile', 'Availability process', 'Compliance checklist'],
    deliverables: ['Bank staff setup plan', 'Worker profile template', 'Shift request workflow'],
    timeline: '7-10 working days',
    ctaLabel: 'Purchase setup',
    popular: true
  },
  {
    id: 'prod_bank_staff_rota_support',
    slug: 'bank-staff-rota-support-retainer',
    name: 'Bank Staffing Rota Support Retainer',
    shortDescription: 'Monthly support for recurring rota gaps, temporary cover and bank worker coordination.',
    longDescription:
      'A recurring service for providers with ongoing temporary staffing pressure who need regular support reviewing gaps, availability and cover decisions.',
    category: 'subscription',
    serviceSlug: 'bank-staff-agency-staffing',
    price: 'From £600 + VAT / month',
    currency: 'GBP',
    billingType: 'recurring',
    stripePriceId: 'price_bank_staff_rota_retainer_placeholder',
    stripeProductId: 'prod_bank_staff_rota_retainer_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Monthly rota gap review', 'Priority staffing triage', 'Shift feedback tracking'],
    deliverables: ['Rota support log', 'Availability notes', 'Cover planning recommendations'],
    timeline: 'Monthly rolling support',
    ctaLabel: 'Start retainer'
  },
  {
    id: 'prod_cqc_action_plan_addon',
    slug: 'cqc-action-plan-add-on',
    name: 'CQC Action Plan Add-on',
    shortDescription: 'Additional action plan support after an inspection readiness review or mock inspection.',
    longDescription:
      'An add-on for providers that need help translating inspection readiness findings into a clearer owner, deadline and evidence action plan.',
    category: 'add-on',
    serviceSlug: 'cqc-inspection-support',
    price: 'From £350 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_cqc_action_plan_addon_placeholder',
    stripeProductId: 'prod_cqc_action_plan_addon_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Action plan structure', 'Risk prioritisation', 'Evidence ownership notes'],
    deliverables: ['Action plan template', 'Priority list', 'Follow-up prompts'],
    timeline: '2-3 working days',
    ctaLabel: 'Add action plan'
  },
  {
    id: 'prod_permanent_recruitment_call',
    slug: 'permanent-recruitment-consultation',
    name: 'Permanent Recruitment Consultation',
    shortDescription: 'A role-briefing call before starting permanent, part-time or long-term placement work.',
    longDescription:
      'A consultation to define role requirements, salary or rate, screening criteria, compliance expectations and recruitment terms.',
    category: 'consultation',
    serviceSlug: 'permanent-part-time-care-recruitment',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_permanent_recruitment_call_placeholder',
    stripeProductId: 'prod_permanent_recruitment_call_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Role brief review', 'Screening criteria', 'Recruitment route advice'],
    deliverables: ['Role brief notes', 'Candidate criteria', 'Recommended placement terms'],
    timeline: '60 minutes',
    ctaLabel: 'Book consultation'
  },
  {
    id: 'prod_permanent_staff_placement',
    slug: 'permanent-care-staff-placement',
    name: 'Permanent Care Staff Placement',
    shortDescription: 'Success-fee placement route for carers, support workers, coordinators and managers.',
    longDescription:
      'A quote-based permanent recruitment service where the provider pays for each successful placement under agreed placement and warranty terms.',
    category: 'quote-based',
    serviceSlug: 'permanent-part-time-care-recruitment',
    price: 'Quote-based, often 12-18% of first-year salary',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Role briefing', 'Candidate sourcing', 'Screening and interview coordination'],
    deliverables: ['Candidate shortlist', 'Screening notes', 'Placement confirmation'],
    timeline: 'Timescale depends on role and market',
    ctaLabel: 'Request placement quote',
    popular: true,
    warrantyText:
      'A 6-month replacement warranty may apply to eligible placements under the agreed service terms. It is not unlimited and final terms must be confirmed in the service agreement.'
  },
  {
    id: 'prod_manager_retained_search',
    slug: 'care-manager-retained-search',
    name: 'Care Manager Retained Search',
    shortDescription: 'A structured search route for registered manager, care manager or senior coordinator roles.',
    longDescription:
      'A retained search product for harder-to-fill leadership roles where sourcing, screening and interview coordination need more active management.',
    category: 'package',
    serviceSlug: 'permanent-part-time-care-recruitment',
    price: 'From £950 + VAT retainer plus agreed success fee',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_care_manager_retained_search_placeholder',
    stripeProductId: 'prod_care_manager_retained_search_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Leadership profile', 'Search activity plan', 'Candidate screening'],
    deliverables: ['Search plan', 'Candidate shortlist where available', 'Interview coordination'],
    timeline: 'Typically 4-8 weeks depending on role',
    ctaLabel: 'Start retained search',
    warrantyText:
      'Replacement support may be available under agreed terms for eligible placements. Final warranty scope should be confirmed in the service agreement.'
  },
  {
    id: 'prod_registration_sop_addon',
    slug: 'statement-of-purpose-review-add-on',
    name: 'Statement of Purpose Review Add-on',
    shortDescription: 'Focused review of a statement of purpose after registration support has started.',
    longDescription:
      'An add-on for providers that need a targeted review of their statement of purpose against their intended service model and registration narrative.',
    category: 'add-on',
    serviceSlug: 'cqc-ofsted-registration-support',
    price: 'From £275 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_statement_of_purpose_addon_placeholder',
    stripeProductId: 'prod_statement_of_purpose_addon_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Statement of purpose review', 'Service model consistency check', 'Improvement notes'],
    deliverables: ['Review comments', 'Priority edits', 'Follow-up questions'],
    timeline: '2-4 working days',
    ctaLabel: 'Add SOP review'
  },
  {
    id: 'prod_compliance_consultation',
    slug: 'care-compliance-consultation',
    name: 'Care Compliance Consultation',
    shortDescription: 'A focused call on policies, audits, governance and compliance system priorities.',
    longDescription:
      'A consultation for providers that need to clarify whether they need policy review, audit readiness, document system design or ongoing compliance support.',
    category: 'consultation',
    serviceSlug: 'care-compliance-policies-protocols',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_compliance_consultation_placeholder',
    stripeProductId: 'prod_compliance_consultation_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Compliance priorities review', 'Policy gap discussion', 'Audit readiness advice'],
    deliverables: ['Call summary', 'Priority risks', 'Recommended compliance route'],
    timeline: '60 minutes',
    ctaLabel: 'Book consultation'
  },
  {
    id: 'prod_policy_review',
    slug: 'care-policy-review',
    name: 'Care Policy Review',
    shortDescription: 'Review of selected policies for currency, ownership and operational fit.',
    longDescription:
      'A one-off review for care providers who need targeted feedback on selected policies and how well they support actual service practice.',
    category: 'one-off-service',
    serviceSlug: 'care-compliance-policies-protocols',
    price: 'From £450 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_care_policy_review_placeholder',
    stripeProductId: 'prod_care_policy_review_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Selected policy review', 'Version and ownership check', 'Operational fit notes'],
    deliverables: ['Policy review comments', 'Gap list', 'Update priorities'],
    timeline: '3-5 working days after document receipt',
    ctaLabel: 'Purchase review'
  },
  {
    id: 'prod_compliance_system_package',
    slug: 'compliance-system-setup-package',
    name: 'Compliance System Setup Package',
    shortDescription: 'Set up policy ownership, review cycles, audit calendar and action tracking structure.',
    longDescription:
      'A practical package for providers that need a maintainable compliance system rather than isolated documents.',
    category: 'package',
    serviceSlug: 'care-compliance-policies-protocols',
    price: 'From £1,250 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_compliance_system_package_placeholder',
    stripeProductId: 'prod_compliance_system_package_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Policy map', 'Compliance calendar', 'Audit action tracking structure'],
    deliverables: ['Compliance framework', 'Review cycle plan', 'Audit readiness checklist'],
    timeline: '7-14 working days',
    ctaLabel: 'Purchase package',
    popular: true
  },
  {
    id: 'prod_compliance_retainer',
    slug: 'care-compliance-retainer',
    name: 'Care Compliance Retainer',
    shortDescription: 'Monthly support for policies, audit actions, governance records and compliance routines.',
    longDescription:
      'A recurring support product for providers that need ongoing help maintaining compliance records, audit actions and governance evidence.',
    category: 'subscription',
    serviceSlug: 'care-compliance-policies-protocols',
    price: 'From £650 + VAT / month',
    currency: 'GBP',
    billingType: 'recurring',
    stripePriceId: 'price_care_compliance_retainer_placeholder',
    stripeProductId: 'prod_care_compliance_retainer_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Monthly compliance check-in', 'Document review allocation', 'Audit action support'],
    deliverables: ['Monthly compliance log', 'Document comments', 'Action tracking notes'],
    timeline: 'Monthly rolling support',
    ctaLabel: 'Start retainer'
  },
  {
    id: 'prod_policy_update_addon',
    slug: 'policy-update-add-on',
    name: 'Policy Update Add-on',
    shortDescription: 'Targeted update support for one policy or protocol after a compliance review.',
    longDescription:
      'An add-on for providers that need one policy or protocol updated after review, with wording aligned to the service model and governance approach.',
    category: 'add-on',
    serviceSlug: 'care-compliance-policies-protocols',
    price: 'From £175 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_policy_update_addon_placeholder',
    stripeProductId: 'prod_policy_update_addon_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Single policy update', 'Operational fit check', 'Review cycle note'],
    deliverables: ['Updated policy draft', 'Change notes', 'Review date recommendation'],
    timeline: '2-3 working days',
    ctaLabel: 'Add policy update'
  },
  {
    id: 'prod_tender_triage_call',
    slug: 'tender-triage-consultation',
    name: 'Tender Triage Consultation',
    shortDescription: 'A call to review tender fit, requirements, deadline pressure and bid approach.',
    longDescription:
      'A focused consultation for providers deciding whether to bid and what operational evidence, staffing model and mobilisation assumptions will be needed.',
    category: 'consultation',
    serviceSlug: 'tender-bidding-operational-planning',
    price: 'From £250 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_tender_triage_call_placeholder',
    stripeProductId: 'prod_tender_triage_call_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Tender fit review', 'Deadline and evidence triage', 'Bid route recommendation'],
    deliverables: ['Bid decision notes', 'Evidence checklist', 'Next-step recommendation'],
    timeline: '75 minutes',
    ctaLabel: 'Book tender call'
  },
  {
    id: 'prod_bid_review',
    slug: 'care-bid-review',
    name: 'Care Bid Review',
    shortDescription: 'Review of drafted responses, evidence gaps and operational assumptions.',
    longDescription:
      'A one-off review for providers that already have draft tender content and need practical feedback before submission.',
    category: 'one-off-service',
    serviceSlug: 'tender-bidding-operational-planning',
    price: 'From £850 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_care_bid_review_placeholder',
    stripeProductId: 'prod_care_bid_review_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Draft response review', 'Evidence gap notes', 'Operational credibility check'],
    deliverables: ['Bid review comments', 'Risk and gap list', 'Refinement priorities'],
    timeline: '3-5 working days depending on tender size',
    ctaLabel: 'Purchase review'
  },
  {
    id: 'prod_full_tender_support',
    slug: 'full-care-tender-support',
    name: 'Full Care Tender Support',
    shortDescription: 'Quote-led support for bid structure, evidence, response planning and mobilisation detail.',
    longDescription:
      'A quote-based tender project for providers that need hands-on support across the response, evidence mapping and operational mobilisation plan.',
    category: 'quote-based',
    serviceSlug: 'tender-bidding-operational-planning',
    price: 'From £2,500 + VAT',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Bid structure', 'Evidence mapping', 'Mobilisation planning'],
    deliverables: ['Tender support plan', 'Response structure', 'Mobilisation checklist'],
    timeline: 'Quoted after tender review',
    ctaLabel: 'Request quote'
  },
  {
    id: 'prod_tender_mobilisation_addon',
    slug: 'tender-mobilisation-plan-add-on',
    name: 'Tender Mobilisation Plan Add-on',
    shortDescription: 'Additional mobilisation planning for providers preparing to deliver after a bid.',
    longDescription:
      'An add-on for tender support clients that need a clearer mobilisation timeline, staffing assumption map and governance route after bid planning.',
    category: 'add-on',
    serviceSlug: 'tender-bidding-operational-planning',
    price: 'From £950 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_tender_mobilisation_addon_placeholder',
    stripeProductId: 'prod_tender_mobilisation_addon_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Mobilisation timeline', 'Staffing assumptions', 'Governance and risk actions'],
    deliverables: ['Mobilisation plan', 'Risk and action map', 'Launch checklist'],
    timeline: '5-7 working days',
    ctaLabel: 'Add mobilisation plan'
  },
  {
    id: 'prod_training_needs_review',
    slug: 'care-training-needs-review',
    name: 'Care Training Needs Review',
    shortDescription: 'Review staff training priorities, induction gaps and compliance-linked learning needs.',
    longDescription:
      'A consultation-style product for providers that need to connect training decisions with service risk, induction, supervision and audit evidence.',
    category: 'consultation',
    serviceSlug: 'care-training-organisations-individuals',
    price: 'From £250 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_training_needs_review_placeholder',
    stripeProductId: 'prod_training_needs_review_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Training gap discussion', 'Audience and risk review', 'Course category recommendation'],
    deliverables: ['Training needs summary', 'Priority course categories', 'Evidence recommendations'],
    timeline: '75 minutes',
    ctaLabel: 'Book training review'
  },
  {
    id: 'prod_training_pathway_package',
    slug: 'care-training-pathway-package',
    name: 'Care Training Pathway Package',
    shortDescription: 'Set up an induction, refresher and development pathway for a care team.',
    longDescription:
      'A one-off package for organisations that need a clearer training pathway linked to induction, supervision, compliance and improvement actions.',
    category: 'package',
    serviceSlug: 'care-training-organisations-individuals',
    price: 'From £650 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_training_pathway_package_placeholder',
    stripeProductId: 'prod_training_pathway_package_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Training matrix review', 'Course pathway planning', 'Evidence alignment'],
    deliverables: ['Training pathway outline', 'Priority learning plan', 'Implementation notes'],
    timeline: '5-7 working days',
    ctaLabel: 'Purchase pathway',
    popular: true
  },
  {
    id: 'prod_group_training_quote',
    slug: 'group-care-training-quote',
    name: 'Group Care Training Delivery',
    shortDescription: 'Quote-led training delivery for teams, managers or specialist learning needs.',
    longDescription:
      'A quote-based product for group training where pricing depends on subject matter, group size, delivery format and preparation requirements.',
    category: 'quote-based',
    serviceSlug: 'care-training-organisations-individuals',
    price: 'Quote-based by course and group size',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Course scope', 'Group size review', 'Delivery format planning'],
    deliverables: ['Training quote', 'Session outline', 'Booking requirements'],
    timeline: 'Quote after training brief',
    ctaLabel: 'Request quote'
  },
  {
    id: 'prod_technology_discovery',
    slug: 'care-technology-discovery-session',
    name: 'Care Technology Discovery Session',
    shortDescription: 'A practical discovery call for websites, forms, CRM, dashboards or care systems.',
    longDescription:
      'A paid discovery session for care providers that need to define their website, systems or operational technology requirements before build or maintenance work.',
    category: 'consultation',
    serviceSlug: 'websites-technology-systems-support',
    price: 'From £250 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_technology_discovery_placeholder',
    stripeProductId: 'prod_technology_discovery_placeholder',
    isPurchasable: true,
    requiresConsultation: false,
    features: ['Current system review', 'Workflow pain point mapping', 'Build route recommendation'],
    deliverables: ['Discovery notes', 'Requirement priorities', 'Recommended digital route'],
    timeline: '75 minutes',
    ctaLabel: 'Book discovery'
  },
  {
    id: 'prod_care_website_package',
    slug: 'care-provider-website-package',
    name: 'Care Provider Website Package',
    shortDescription: 'Website package for care providers needing credible service and enquiry pages.',
    longDescription:
      'A website package for care agencies, supported living providers and care startups that need service pages, enquiry routing and a credible digital presence.',
    category: 'package',
    serviceSlug: 'websites-technology-systems-support',
    price: 'From £2,500 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_care_website_package_placeholder',
    stripeProductId: 'prod_care_website_package_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Service page structure', 'Lead forms', 'Care-sector content planning'],
    deliverables: ['Website project brief', 'Page structure', 'Launch checklist'],
    timeline: 'Typically 3-6 weeks depending on scope',
    ctaLabel: 'Purchase website package',
    popular: true
  },
  {
    id: 'prod_website_maintenance',
    slug: 'care-website-maintenance-plan',
    name: 'Care Website Maintenance Plan',
    shortDescription: 'Recurring website maintenance, content updates and support for care providers.',
    longDescription:
      'A monthly support plan for care providers that need website updates, content changes, monitoring and improvement support after launch.',
    category: 'subscription',
    serviceSlug: 'websites-technology-systems-support',
    price: 'From £149 + VAT / month',
    currency: 'GBP',
    billingType: 'recurring',
    stripePriceId: 'price_care_website_maintenance_placeholder',
    stripeProductId: 'prod_care_website_maintenance_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Website updates', 'Content support allocation', 'Technical maintenance'],
    deliverables: ['Monthly update log', 'Maintenance notes', 'Improvement recommendations'],
    timeline: 'Monthly rolling support',
    ctaLabel: 'Start maintenance'
  },
  {
    id: 'prod_website_checkout_addon',
    slug: 'website-checkout-readiness-add-on',
    name: 'Website Checkout Readiness Add-on',
    shortDescription:
      'Add checkout-ready product structure, service summary and payment CTA planning to a website scope.',
    longDescription:
      'An add-on for care provider website projects that need products, consultations, service summaries and Stripe Checkout handoff points prepared for backend integration.',
    category: 'add-on',
    serviceSlug: 'websites-technology-systems-support',
    price: 'From £750 + VAT',
    currency: 'GBP',
    billingType: 'one-off',
    stripePriceId: 'price_website_checkout_addon_placeholder',
    stripeProductId: 'prod_website_checkout_addon_placeholder',
    isPurchasable: true,
    requiresConsultation: true,
    features: ['Product catalogue structure', 'Checkout CTA planning', 'Success and cancellation route mapping'],
    deliverables: ['Checkout-ready page plan', 'Product summary content', 'Backend handoff notes'],
    timeline: '5-10 working days',
    ctaLabel: 'Add checkout readiness'
  },
  {
    id: 'prod_custom_care_system_quote',
    slug: 'custom-care-system-quote',
    name: 'Custom Care System or Portal',
    shortDescription: 'Quote-led software, dashboard, portal or workflow automation support.',
    longDescription:
      'A custom technology route for providers that need dashboards, portals, CRM workflows, booking systems or internal care operations tools.',
    category: 'quote-based',
    serviceSlug: 'websites-technology-systems-support',
    price: 'Quote-based',
    currency: 'GBP',
    billingType: 'quote-based',
    stripePriceId: null,
    stripeProductId: null,
    isPurchasable: false,
    requiresConsultation: true,
    features: ['Workflow discovery', 'Technical scope', 'Delivery roadmap'],
    deliverables: ['Project proposal', 'Estimate range', 'Implementation plan'],
    timeline: 'Quote after discovery',
    ctaLabel: 'Request quote'
  }
]

export function getProductBySlug(slug: string) {
  return products.find(product => product.slug === slug)
}

export function getProductsByServiceSlug(serviceSlug: string) {
  return products.filter(product => product.serviceSlug === serviceSlug)
}

export function getPurchasableProductsByServiceSlug(serviceSlug: string) {
  return getProductsByServiceSlug(serviceSlug).filter(product => product.isPurchasable)
}

export function getConsultationProductByServiceSlug(serviceSlug: string) {
  return getProductsByServiceSlug(serviceSlug).find(product => product.category === 'consultation')
}

export function getPopularProducts(limit = 6) {
  return products.filter(product => product.popular).slice(0, limit)
}

export function getProductCheckoutHref(product: Product) {
  if (product.isPurchasable && product.billingType !== 'quote-based') {
    return `/checkout?product=${product.slug}`
  }

  if (product.requiresConsultation) {
    return `/services/${product.serviceSlug}#service-enquiry`
  }

  return '/contact'
}

export function getBillingLabel(product: Product) {
  if (product.billingType === 'recurring') {
    return 'Recurring'
  }

  if (product.billingType === 'quote-based') {
    return 'Quote-based'
  }

  return 'One-off'
}
