export type JobRole = {
  slug: string
  title: string
  type: string
  location: string
  team: string
  summary: string
  overview: string
  suitableFor: string[]
  responsibilities: string[]
  requiredExperience: string[]
  requiredDocuments: string[]
  trainingExpectations: string[]
  applicationProcess: string[]
  ctaLabel: string
  tags: string[]
  seo: {
    title: string
    description: string
  }
}

export const jobRoles: JobRole[] = [
  {
    slug: 'carer',
    title: 'Carer',
    type: 'Permanent / Bank',
    location: 'Local and regional opportunities',
    team: 'Frontline care',
    summary:
      'Support adults with personal care, companionship, routines and safe day-to-day delivery in domiciliary care and community settings.',
    overview:
      'This role suits people who want to provide person-centred support in domiciliary care, community care or supported living environments. Care Atlas uses this page as a clean register-interest route until live vacancy matching is connected.',
    suitableFor: [
      'Applicants with hands-on care experience or transferable support experience',
      'People looking for permanent, part-time or bank care work',
      'Candidates who value dignity, safeguarding, record keeping and reliable attendance',
      'Workers who can build trust with people, families and provider teams'
    ],
    responsibilities: [
      'Deliver personal care and practical support in line with care plans',
      'Record visits, observations, incidents and changes clearly',
      'Support medication prompts or medication administration where authorised',
      'Follow safeguarding, infection control and lone-working procedures',
      'Escalate concerns promptly to coordinators, seniors or managers'
    ],
    requiredExperience: [
      'Previous care, support or customer-facing experience is helpful',
      'Understanding of person-centred care and respectful communication',
      'Comfort with record keeping, mobile apps or daily care notes',
      'A full UK driving licence may be needed for some domiciliary care roles'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'Enhanced DBS or willingness to complete checks',
      'Proof of address and photo ID',
      'Employment history and references subject to final checks'
    ],
    trainingExpectations: [
      'Manual handling, safeguarding and medication training where relevant',
      'Care certificate or induction pathway support where required',
      'Ongoing refreshers linked to policies and procedures',
      'Compliance with provider training records and staff file requirements'
    ],
    applicationProcess: [
      'Register interest with your preferred location, work type and availability',
      'Share your experience, right to work status and any care certificates',
      'Complete screening and safer recruitment checks if a suitable role is available',
      'Attend interview or values-based assessment with the provider'
    ],
    ctaLabel: 'Register Interest',
    tags: ['Domiciliary care', 'Supported living', 'Bank work'],
    seo: {
      title: 'Carer Jobs | Care Atlas',
      description:
        'Register interest for carer opportunities across domiciliary care, community support and provider-led care services.'
    }
  },
  {
    slug: 'support-worker',
    title: 'Support Worker',
    type: 'Full-time / Part-time / Bank',
    location: 'Supported living and community roles',
    team: 'Frontline support',
    summary:
      'Support people with routines, independence, appointments and safer daily living in supported living, outreach or community support settings.',
    overview:
      'Support Worker roles typically focus on supported living, outreach and independence-building support. The route is designed for candidates who want clear next steps while live application tooling is still being prepared.',
    suitableFor: [
      'Candidates with experience in supported living, learning disability, autism or mental health support',
      'Applicants who want flexible or long-term support roles',
      'People who can balance encouragement, boundaries and accurate documentation',
      'Workers comfortable with community access, appointments and shift-based work'
    ],
    responsibilities: [
      'Support people with routines, appointments and community activities',
      'Follow support plans, risk assessments and behaviour support guidance',
      'Maintain clear daily notes and incident reporting records',
      'Promote dignity, choice, safeguarding and positive outcomes',
      'Work closely with seniors, coordinators and managers on concerns or changes'
    ],
    requiredExperience: [
      'Relevant support work or care experience is preferred',
      'Confidence supporting people with different communication or behavioural needs',
      'Understanding of professional boundaries and risk awareness',
      'Shift flexibility may be required depending on the service'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'DBS evidence or willingness to complete checks',
      'References and work history for safer recruitment review',
      'Any relevant training certificates already held'
    ],
    trainingExpectations: [
      'Safeguarding, medication, PBS or autism-related training depending on service',
      'Provider induction, policies and procedures sign-off',
      'Ongoing refreshers linked to incidents, learning and quality assurance',
      'Accurate staff file and compliance record maintenance'
    ],
    applicationProcess: [
      'Register interest with role type, area and shift preferences',
      'Complete screening questions and upload core details later if invited',
      'Subject to final checks, interview with the relevant provider',
      'Complete onboarding and service-specific induction before shift allocation'
    ],
    ctaLabel: 'Apply Now',
    tags: ['Supported living', 'Community support', 'Flexible shifts'],
    seo: {
      title: 'Support Worker Jobs | Care Atlas',
      description:
        'Register interest for support worker roles in supported living, outreach and community support settings.'
    }
  },
  {
    slug: 'senior-carer',
    title: 'Senior Carer',
    type: 'Permanent / Part-time',
    location: 'Provider-led opportunities',
    team: 'Shift leadership',
    summary:
      'Lead good practice on shift, support junior staff, maintain records and help uphold safe care delivery and medication governance.',
    overview:
      'Senior Carer roles suit experienced carers or support workers ready for extra responsibility around shift leadership, documentation quality and mentoring. Care Atlas keeps the process as a structured register-interest route until live employer workflows are connected.',
    suitableFor: [
      'Experienced carers or support workers ready for a lead role',
      'Applicants confident with medication governance and escalation',
      'Candidates who can mentor colleagues and support quality assurance routines',
      'Workers who want progression without moving immediately into management'
    ],
    responsibilities: [
      'Coordinate safe care delivery and prioritise workload during shifts',
      'Support junior staff, inductions and spot checks where appropriate',
      'Maintain accurate care records, handovers and escalation notes',
      'Support medication rounds, audits or controlled documentation processes',
      'Report concerns to managers and help follow action plans'
    ],
    requiredExperience: [
      'Strong frontline care experience in domiciliary care, residential or supported living settings',
      'Experience with medication practice, MARs or record keeping',
      'Confidence leading shifts and supporting newer team members',
      'Understanding of safeguarding, incidents and provider procedures'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'Enhanced DBS or willingness to complete checks',
      'References and recent employment history',
      'Relevant medication, care or leadership certificates where available'
    ],
    trainingExpectations: [
      'Medication competency and refresher training',
      'Safeguarding, supervision and incident management training',
      'Compliance with provider policies, audits and quality assurance processes',
      'Evidence of learning kept up to date in the staff file'
    ],
    applicationProcess: [
      'Submit a register-interest profile and highlight leadership experience',
      'Share medication, shift lead or mentoring experience',
      'Complete screening, references and checks subject to final role match',
      'Interview with the provider and complete onboarding steps if appointed'
    ],
    ctaLabel: 'Register Interest',
    tags: ['Shift lead', 'Medication', 'Team support'],
    seo: {
      title: 'Senior Carer Jobs | Care Atlas',
      description:
        'Register interest for senior carer opportunities involving shift leadership, medication practice and frontline quality support.'
    }
  },
  {
    slug: 'bank-staff',
    title: 'Bank Staff',
    type: 'Bank / Flexible shifts',
    location: 'Shift-based cover opportunities',
    team: 'Flexible staffing',
    summary:
      'Join flexible staffing pools for sickness cover, annual leave, rota pressure and emergency continuity support.',
    overview:
      'Bank Staff roles are suited to candidates who want flexible shifts and providers who need cover without confusing temporary staffing with long-term recruitment. This page keeps that route clearly separate from permanent jobs.',
    suitableFor: [
      'Applicants seeking flexible shift patterns or supplementary work',
      'Workers available for urgent cover, sickness or annual leave pressure',
      'Candidates who can respond quickly and follow service-specific briefs',
      'Care staff who already understand agency or bank compliance expectations'
    ],
    responsibilities: [
      'Accept shifts that match your availability, location and suitability',
      'Follow service-specific handovers, care plans and escalation routes',
      'Maintain high standards of punctuality, professionalism and documentation',
      'Work within provider procedures for safeguarding, incidents and medicines',
      'Report feedback, concerns or cancellations promptly'
    ],
    requiredExperience: [
      'Previous care or support experience is usually expected',
      'Ability to adapt quickly to different services and teams',
      'Good communication and reliable travel planning',
      'Comfort with short-notice cover arrangements where agreed'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'DBS evidence or willingness to complete checks',
      'References and availability details',
      'Training and immunisation evidence where the service requires it'
    ],
    trainingExpectations: [
      'Service-appropriate induction before first placement',
      'Current core training and refresher compliance',
      'Accurate staff file checks before shift confirmation',
      'Understanding of cancellation, escalation and booking terms'
    ],
    applicationProcess: [
      'Register interest with role type, travel area and shift availability',
      'Share compliance documents and current training status',
      'Complete safer recruitment and file review steps subject to final checks',
      'Join a suitable staffing pool and receive cover opportunities when available'
    ],
    ctaLabel: 'Join Bank Pool',
    tags: ['Temporary cover', 'Rota gaps', 'Flexible work'],
    seo: {
      title: 'Bank Staff Roles | Care Atlas',
      description:
        'Register interest for bank staff and flexible care opportunities linked to shift cover, rota gaps and provider demand.'
    }
  },
  {
    slug: 'nurse',
    title: 'Nurse',
    type: 'Permanent / Bank',
    location: 'Role-dependent clinical opportunities',
    team: 'Clinical care',
    summary:
      'Register interest for nursing and complex care opportunities where clinical oversight, documentation and safe delegation are required.',
    overview:
      'Nurse roles within the Care Atlas direction are targeted at provider support, complex care and regulated service environments where clinical judgement, governance and safe documentation matter.',
    suitableFor: [
      'Registered nurses looking for provider, community or complex care roles',
      'Candidates comfortable with governance, care planning and escalation',
      'Applicants who can support safe delegation and accurate clinical records',
      'Workers open to permanent or bank-based clinical opportunities'
    ],
    responsibilities: [
      'Deliver or oversee safe clinical interventions in line with role scope',
      'Maintain accurate records, risk assessments and medication documentation',
      'Escalate deterioration, incidents or safeguarding concerns promptly',
      'Support care planning, reviews and multidisciplinary communication',
      'Contribute to audits, training and quality assurance where appropriate'
    ],
    requiredExperience: [
      'Current NMC registration where required by the role',
      'Relevant nursing or complex care experience',
      'Understanding of medication governance, documentation and delegation',
      'Confidence communicating with families, professionals and provider leaders'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'NMC pin and registration details if applicable',
      'DBS evidence or willingness to complete checks',
      'References, immunisation status and training records where required'
    ],
    trainingExpectations: [
      'Mandatory clinical and safeguarding updates',
      'Provider induction and policy familiarisation',
      'Competency sign-off for role-specific tasks',
      'Participation in audits, supervision and governance follow-up'
    ],
    applicationProcess: [
      'Register interest and outline your clinical background',
      'Share registration details, preferences and availability',
      'Complete provider screening and safer recruitment checks if suitable roles exist',
      'Attend interview and complete onboarding subject to final checks'
    ],
    ctaLabel: 'Register Clinical Interest',
    tags: ['Clinical', 'Complex care', 'Medication governance'],
    seo: {
      title: 'Nurse Opportunities | Care Atlas',
      description:
        'Register interest for nursing and complex care opportunities linked to regulated care providers and clinical support roles.'
    }
  },
  {
    slug: 'care-coordinator',
    title: 'Care Coordinator',
    type: 'Permanent / Hybrid',
    location: 'Office, branch and hybrid roles',
    team: 'Operations',
    summary:
      'Coordinate rotas, care planning, client communication and staffing logistics across growing care services.',
    overview:
      'Care Coordinator roles suit organised candidates who can balance rota planning, client communication, staff allocation and record accuracy across domiciliary care or supported living operations.',
    suitableFor: [
      'Experienced care staff moving into coordination or office-based operations',
      'Applicants with rostering, scheduling or care planning exposure',
      'People comfortable with urgent problem solving and communication',
      'Candidates who can keep records, compliance prompts and staff files organised'
    ],
    responsibilities: [
      'Manage rotas, shift allocation and care package changes',
      'Coordinate communication with staff, clients and families',
      'Support onboarding, file checks and service mobilisation tasks',
      'Maintain care planning updates, service notes and scheduling records',
      'Escalate incidents, missed calls and staffing issues promptly'
    ],
    requiredExperience: [
      'Previous coordination, scheduling or care administration experience is preferred',
      'Understanding of care planning, call cover or supported living logistics',
      'Confidence using digital systems, spreadsheets or scheduling software',
      'Strong communication and prioritisation skills'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'DBS evidence depending on role requirements',
      'Employment references and work history',
      'Any rota, scheduling or administration training evidence'
    ],
    trainingExpectations: [
      'Provider induction and systems training',
      'Training on safeguarding, complaints, records and confidentiality',
      'Awareness of care planning and medication governance escalation routes',
      'Compliance with staff file, audit and quality assurance expectations'
    ],
    applicationProcess: [
      'Submit your register-interest profile with scheduling or coordination experience',
      'Share preferred location, office/hybrid preferences and notice period',
      'Complete screening and checks if a suitable vacancy is available',
      'Attend interview and complete provider onboarding steps'
    ],
    ctaLabel: 'Apply Now',
    tags: ['Rostering', 'Care planning', 'Operations'],
    seo: {
      title: 'Care Coordinator Jobs | Care Atlas',
      description:
        'Register interest for care coordinator roles involving rota planning, care planning support and provider operations.'
    }
  },
  {
    slug: 'care-manager',
    title: 'Care Manager',
    type: 'Permanent',
    location: 'Regional and provider-led opportunities',
    team: 'Operational leadership',
    summary:
      'Lead teams, oversee care quality, manage incidents and support governance, supervision and service improvement.',
    overview:
      'Care Manager roles are aimed at candidates who can take operational responsibility for people, quality and compliance without overclaiming outcomes. The route supports providers seeking stronger governance and team leadership.',
    suitableFor: [
      'Experienced seniors, coordinators or deputies stepping into management',
      'Applicants with strong people leadership and governance awareness',
      'Candidates able to balance quality assurance with service delivery pressures',
      'Managers who understand safeguarding, audits and improvement planning'
    ],
    responsibilities: [
      'Oversee day-to-day service delivery, staffing and escalation',
      'Support supervision, spot checks, audits and action plans',
      'Maintain oversight of incidents, complaints and safeguarding follow-up',
      'Work with coordinators and senior staff on rota and care planning issues',
      'Contribute to governance meetings, evidence preparation and service improvement'
    ],
    requiredExperience: [
      'Previous care management, deputy management or equivalent leadership experience',
      'Understanding of CQC-facing governance and quality assurance',
      'Experience with supervision, audits and staff development',
      'Ability to manage priorities across compliance, staffing and care delivery'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'DBS evidence or willingness to complete checks',
      'References and management employment history',
      'Relevant qualifications or leadership training records where available'
    ],
    trainingExpectations: [
      'Leadership, safeguarding and governance refreshers',
      'Provider-specific policies and procedures sign-off',
      'Participation in quality assurance, audits and evidence preparation',
      'Ongoing training linked to incidents, complaints and improvement plans'
    ],
    applicationProcess: [
      'Register your interest and describe your management scope',
      'Share governance, staffing and service type experience',
      'Complete screening and compliance checks subject to final vacancy review',
      'Attend provider interview and onboarding if progressed'
    ],
    ctaLabel: 'Register Interest',
    tags: ['Management', 'Governance', 'Quality assurance'],
    seo: {
      title: 'Care Manager Jobs | Care Atlas',
      description:
        'Register interest for care manager opportunities across governance, staffing, quality assurance and service leadership.'
    }
  },
  {
    slug: 'registered-manager',
    title: 'Registered Manager',
    type: 'Permanent',
    location: 'UK-wide search support',
    team: 'Regulated leadership',
    summary:
      'Lead regulated services with strong oversight of compliance, governance, staffing, quality assurance and operational readiness.',
    overview:
      'Registered Manager opportunities are one of the clearest fits within the current Care Atlas direction. This route supports providers searching for strong regulated-service leadership and candidates who can evidence credible management experience.',
    suitableFor: [
      'Experienced managers with regulated care leadership backgrounds',
      'Candidates preparing for registration, interview or mobilisation responsibilities',
      'Applicants who understand governance, notifications and provider oversight',
      'Leaders who can build systems, culture and safe service delivery'
    ],
    responsibilities: [
      'Lead a regulated care service in line with provider responsibilities',
      'Maintain oversight of compliance, staffing, incidents and quality assurance',
      'Support care planning, medication governance and evidence preparation',
      'Manage audits, action plans, complaints and safeguarding escalation',
      'Prepare for registration, inspection or improvement work where relevant'
    ],
    requiredExperience: [
      'Strong management experience in regulated care settings',
      'Understanding of CQC registration, inspection and well-led expectations',
      'Experience leading teams, governance meetings and service improvement',
      'Credible knowledge of safer recruitment, staff files and compliance systems'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'Enhanced DBS or willingness to complete checks',
      'References and verified management employment history',
      'Qualifications and training evidence relevant to the role'
    ],
    trainingExpectations: [
      'Ongoing governance, safeguarding and leadership refreshers',
      'Provider induction on policies, procedures and escalation frameworks',
      'Engagement with quality assurance, mock inspection or evidence preparation routines',
      'Compliance with registration and service-specific documentation requirements'
    ],
    applicationProcess: [
      'Register interest and outline your service type and leadership history',
      'Share registration status, availability and location preferences',
      'Complete checks, references and role matching subject to final provider review',
      'Attend interview, provider meetings and onboarding if selected'
    ],
    ctaLabel: 'Apply for Manager Roles',
    tags: ['CQC', 'Leadership', 'Service development'],
    seo: {
      title: 'Registered Manager Jobs | Care Atlas',
      description:
        'Register interest for registered manager opportunities with providers seeking strong regulated-service leadership.'
    }
  },
  {
    slug: 'recruitment-consultant',
    title: 'Recruitment Consultant',
    type: 'Associate / Permanent',
    location: 'Remote-first with UK provider support',
    team: 'Care recruitment',
    summary:
      'Support employer briefs, candidate screening and safer recruitment workflows for care-sector hiring projects.',
    overview:
      'Recruitment Consultant opportunities fit the existing recruitment services direction and are framed as internal or associate roles helping care-sector clients source and screen candidates responsibly.',
    suitableFor: [
      'Recruiters with care, healthcare or regulated-sector hiring experience',
      'Candidates confident with employer discovery and candidate screening',
      'People who understand safer recruitment, right to work and staff file expectations',
      'Consultants who can work with providers on urgent and planned hiring needs'
    ],
    responsibilities: [
      'Take employer briefs for permanent, part-time and manager roles',
      'Screen candidates for role fit, availability and core compliance requirements',
      'Coordinate interviews, feedback and follow-up communication',
      'Maintain accurate recruitment records and search progress notes',
      'Support providers to separate temporary staffing from permanent recruitment routes'
    ],
    requiredExperience: [
      'Recruitment experience in care, healthcare or a comparable sector',
      'Understanding of safer recruitment, DBS and right to work checks',
      'Strong candidate communication and pipeline management skills',
      'Confidence working with placement terms, search briefs and timelines'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'References and verified recruitment employment history',
      'DBS may be required depending on client access or role scope',
      'Relevant recruitment training or qualifications where available'
    ],
    trainingExpectations: [
      'Care-sector induction on terminology, service types and compliance context',
      'Training on safer recruitment, staff file evidence and data handling',
      'Use of agreed CRM, pipeline or search workflows',
      'Ongoing updates on recruitment policy and governance expectations'
    ],
    applicationProcess: [
      'Register interest and share care-sector recruitment experience',
      'Provide examples of roles, sectors and placement types handled',
      'Complete screening and references subject to final role design',
      'Attend interview and onboarding if a suitable internal or associate role is confirmed'
    ],
    ctaLabel: 'Register Interest',
    tags: ['Safer recruitment', 'Candidate screening', 'Placement support'],
    seo: {
      title: 'Recruitment Consultant Roles | Care Atlas',
      description:
        'Register interest for recruitment consultant opportunities supporting care-sector hiring, screening and employer briefs.'
    }
  },
  {
    slug: 'compliance-consultant',
    title: 'Compliance Consultant',
    type: 'Associate / Contract',
    location: 'Remote and on-site project support',
    team: 'Compliance and governance',
    summary:
      'Support providers with policies and procedures, audits, governance reviews and compliance system improvement work.',
    overview:
      'Compliance Consultant roles align strongly with the current Care Atlas compliance and inspection-readiness direction. They suit practitioners who can help providers prepare evidence, improve systems and structure action plans without guaranteeing regulatory outcomes.',
    suitableFor: [
      'Candidates with care compliance, governance or audit experience',
      'Consultants comfortable reviewing policies and procedures',
      'People who understand quality assurance, evidence preparation and action planning',
      'Practitioners who can work carefully within provider-specific scope and terms'
    ],
    responsibilities: [
      'Review policies, protocols and compliance calendars',
      'Support audit follow-up, evidence mapping and governance improvements',
      'Help providers organise staff files, care planning and quality assurance evidence',
      'Produce clear notes, gap summaries and action plans',
      'Escalate scope issues and work within agreed terms and responsibilities'
    ],
    requiredExperience: [
      'Practical compliance, audit, governance or care consultancy experience',
      'Understanding of domiciliary care, supported living or regulated service documentation',
      'Confidence reviewing evidence without overclaiming outcomes',
      'Strong written communication and provider-facing professionalism'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'Professional references and verified sector history',
      'DBS may be required depending on assignment scope',
      'Relevant qualifications or audit/compliance training records'
    ],
    trainingExpectations: [
      'Alignment to Care Atlas working methods, tone and provider safeguards',
      'Updates on policies, procedures, quality assurance and governance expectations',
      'Confidentiality and document handling requirements',
      'Ongoing refreshers linked to regulatory change and internal templates'
    ],
    applicationProcess: [
      'Register interest and summarise your compliance or governance background',
      'Share sectors, service types and documentation work you have supported',
      'Complete suitability screening and references subject to assignment needs',
      'Agree scope, availability and terms before any project matching'
    ],
    ctaLabel: 'Register as Consultant',
    tags: ['Policies and procedures', 'Governance', 'Quality assurance'],
    seo: {
      title: 'Compliance Consultant Roles | Care Atlas',
      description:
        'Register interest for compliance consultant opportunities supporting audits, policies, governance and provider readiness.'
    }
  },
  {
    slug: 'cqc-registration-consultant',
    title: 'CQC Registration Consultant',
    type: 'Associate / Contract',
    location: 'Remote-first with project-based support',
    team: 'Registration support',
    summary:
      'Assist providers to prepare for CQC registration, statement of purpose work, governance planning and launch-stage readiness.',
    overview:
      'CQC Registration Consultant roles are a natural extension of the existing registration support service. They are framed carefully around preparation, document support and provider readiness rather than promises of approval or guaranteed outcomes.',
    suitableFor: [
      'Candidates with genuine registration preparation or provider mobilisation experience',
      'Consultants who understand statement of purpose, governance and policies',
      'People comfortable supporting founders, managers and new providers carefully',
      'Practitioners able to work within evidence-based, non-guaranteed support boundaries'
    ],
    responsibilities: [
      'Support registration pathway planning and document preparation',
      'Review statements of purpose, governance notes and policy packs',
      'Help prepare interview prompts, readiness checklists and launch actions',
      'Identify documentation gaps across staffing, safer recruitment and quality systems',
      'Keep advice aligned to the provider model, evidence and agreed scope'
    ],
    requiredExperience: [
      'Practical experience with CQC registration preparation or provider setup',
      'Understanding of domiciliary care, supported living or related service models',
      'Ability to review documents critically and communicate clearly',
      'Comfort working with founders, managers and early-stage providers'
    ],
    requiredDocuments: [
      'Right to work evidence',
      'Professional references and verified sector background',
      'DBS may be required depending on assignment type',
      'Relevant qualifications, leadership or consultancy evidence where available'
    ],
    trainingExpectations: [
      'Alignment with Care Atlas wording, terms and non-guarantee positioning',
      'Updates on registration workflows, governance and provider readiness expectations',
      'Document handling and confidentiality requirements',
      'Consistent use of agreed checklists, templates and review processes'
    ],
    applicationProcess: [
      'Register interest and outline your registration support background',
      'Share examples of provider preparation, document review or launch support work',
      'Complete screening and reference checks subject to final opportunity scope',
      'Confirm availability, scope and terms before project matching'
    ],
    ctaLabel: 'Register as Associate',
    tags: ['CQC registration preparation', 'Statement of purpose', 'Launch readiness'],
    seo: {
      title: 'CQC Registration Consultant Roles | Care Atlas',
      description:
        'Register interest for consultant opportunities supporting CQC registration preparation, document readiness and provider launch planning.'
    }
  }
]

export function getJobRoleBySlug(slug: string) {
  return jobRoles.find(role => role.slug === slug)
}

export function getFeaturedJobRoles(limit = 6) {
  return jobRoles.slice(0, limit)
}
