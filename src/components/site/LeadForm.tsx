'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import type { ServiceFormVariant } from '@/data/site'
import { services } from '@/data/site'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { submitEnquiry } from '@/features/enquiries/enquiriesSlice'
import { RegionCountiesFormSection } from './standalone-inputs'
import { Button } from './ui'

type FieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'file' | 'date' | 'password'

type Field = {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
}

type LeadFormProps = {
  variant: ServiceFormVariant
  title?: string
  intro?: string
}

const baseFields: Field[] = [
  { id: 'name', label: 'Full name', type: 'text', required: true, placeholder: 'Your name' },
  { id: 'email', label: 'Email address', type: 'email', required: true, placeholder: 'you@example.co.uk' },
  { id: 'phone', label: 'Phone number', type: 'tel', required: true, placeholder: 'Best number to reach you' },
  {
    id: 'preferredContact',
    label: 'Preferred contact method',
    type: 'select',
    required: true,
    options: ['Email', 'Phone', 'Video consultation', 'No preference']
  },
  {
    id: 'profileType',
    label: 'I am enquiring as',
    type: 'select',
    required: true,
    options: [
      'Care provider',
      'Supported living operator',
      'New care business founder',
      'Care professional',
      'Other organisation'
    ]
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: 'At least 8 characters'
  },
  {
    id: 'passwordConfirmation',
    label: 'Confirm password',
    type: 'password',
    required: true,
    placeholder: 'Re-enter your password'
  }
]

const variantFields: Record<ServiceFormVariant, Field[]> = {
  consultation: [
    {
      id: 'service',
      label: 'Service area',
      type: 'select',
      required: true,
      options: services.map(service => service.navLabel)
    },
    {
      id: 'urgency',
      label: 'Urgency level',
      type: 'select',
      required: true,
      options: ['Planning ahead', 'Within 30 days', 'Urgent support needed', 'Not sure yet']
    },
    { id: 'message', label: 'What do you need help with?', type: 'textarea', required: true }
  ],
  housing: [
    {
      id: 'propertyStage',
      label: 'Supported living property stage',
      type: 'select',
      required: true,
      options: ['Exploring property', 'Property identified', 'Existing service', 'Reviewing housing benefit route']
    },
    { id: 'localAuthority', label: 'Local authority area', type: 'text', placeholder: 'If known' },
    { id: 'message', label: 'Tell us about the property or service setup', type: 'textarea', required: true }
  ],
  registration: [
    {
      id: 'registrationStage',
      label: 'Registration stage',
      type: 'select',
      required: true,
      options: [
        'Exploring idea',
        'Preparing documents',
        'Application in progress',
        'Interview preparation',
        'Post-registration launch'
      ]
    },
    {
      id: 'regulatedActivity',
      label: 'Service or regulated activity',
      type: 'text',
      placeholder: 'For example domiciliary care or supported living'
    },
    { id: 'message', label: 'What registration support do you need?', type: 'textarea', required: true }
  ],
  recruitment: [
    {
      id: 'roleNeeded',
      label: 'Role needed',
      type: 'select',
      required: true,
      options: [
        'Care worker',
        'Support worker',
        'Senior carer',
        'Bank staff',
        'Nurse',
        'Care coordinator',
        'Care manager',
        'Registered manager',
        'Deputy manager',
        'Multiple roles'
      ]
    },
    { id: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Town, city or UK region' },
    {
      id: 'urgency',
      label: 'Hiring urgency',
      type: 'select',
      required: true,
      options: ['Immediate', '2-4 weeks', '1-3 months', 'Planning ahead']
    },
    { id: 'message', label: 'Role details', type: 'textarea', required: true }
  ],
  agencyStaffing: [
    {
      id: 'roleNeeded',
      label: 'Temporary role needed',
      type: 'select',
      required: true,
      options: [
        'General carer',
        'Support worker',
        'Bank staff',
        'Senior carer',
        'Nurse',
        'Care coordinator',
        'Care manager',
        'Registered manager candidate',
        'Multiple roles'
      ]
    },
    { id: 'location', label: 'Shift location', type: 'text', required: true, placeholder: 'Town, city or UK region' },
    {
      id: 'coverType',
      label: 'Cover type',
      type: 'select',
      required: true,
      options: ['Sickness cover', 'Annual leave', 'Rota gap', 'Growth cover', 'Emergency cover', 'Ongoing bank pool']
    },
    {
      id: 'shiftPattern',
      label: 'Shift pattern',
      type: 'select',
      required: true,
      options: ['Days', 'Nights', 'Sleep-ins', 'Live-in', 'Mixed rota', 'To be confirmed']
    },
    { id: 'startDate', label: 'Earliest start date', type: 'date' },
    { id: 'message', label: 'Staffing requirement and compliance context', type: 'textarea', required: true }
  ],
  permanentRecruitment: [
    {
      id: 'roleNeeded',
      label: 'Permanent or long-term role',
      type: 'select',
      required: true,
      options: [
        'Carer',
        'Support worker',
        'Senior carer',
        'Bank staff',
        'Nurse',
        'Care coordinator',
        'Care manager',
        'Registered manager',
        'Multiple roles'
      ]
    },
    {
      id: 'contractType',
      label: 'Contract type',
      type: 'select',
      required: true,
      options: ['Permanent full-time', 'Permanent part-time', 'Long-term placement', 'Bank pool', 'To be confirmed']
    },
    { id: 'location', label: 'Role location', type: 'text', required: true, placeholder: 'Town, city or UK region' },
    { id: 'salaryRange', label: 'Salary or hourly rate range', type: 'text', placeholder: 'If known' },
    {
      id: 'urgency',
      label: 'Hiring timescale',
      type: 'select',
      required: true,
      options: ['Immediate', '2-4 weeks', '1-3 months', 'Planning ahead']
    },
    { id: 'message', label: 'Role brief, must-have checks and interview process', type: 'textarea', required: true }
  ],
  inspection: [
    {
      id: 'inspectionType',
      label: 'Inspection or review type',
      type: 'select',
      required: true,
      options: [
        'First CQC inspection',
        'Planned inspection',
        'Responsive inspection',
        'Mock inspection',
        'Evidence preparation',
        'Governance review'
      ]
    },
    {
      id: 'inspectionTimescale',
      label: 'Timescale',
      type: 'select',
      required: true,
      options: ['Date confirmed', 'Expected within 30 days', 'Expected within 3 months', 'Planning ahead', 'Urgent']
    },
    {
      id: 'serviceType',
      label: 'Service type',
      type: 'text',
      required: true,
      placeholder: 'For example domiciliary care, supported living or complex care'
    },
    { id: 'message', label: 'Known gaps, inspection concerns or evidence needs', type: 'textarea', required: true }
  ],
  candidate: [
    {
      id: 'rolePreference',
      label: 'Preferred role',
      type: 'select',
      required: true,
      options: [
        'Carer',
        'Care worker',
        'Support worker',
        'Senior carer',
        'Bank staff',
        'Nurse',
        'Care coordinator',
        'Care manager',
        'Registered manager',
        'Recruitment consultant',
        'Compliance consultant',
        'CQC registration consultant',
        'Open to suitable roles'
      ]
    },
    {
      id: 'location',
      label: 'Location preference',
      type: 'text',
      required: true,
      placeholder: 'Where would you like to work?'
    },
    {
      id: 'workType',
      label: 'Work type',
      type: 'select',
      required: true,
      options: ['Full-time', 'Part-time', 'Bank', 'Nights', 'Live-in', 'Flexible']
    },
    {
      id: 'experience',
      label: 'Experience level',
      type: 'select',
      required: true,
      options: ['New to care', 'Under 1 year', '1-3 years', '3+ years', 'Registered manager']
    },
    { id: 'cv', label: 'CV upload placeholder', type: 'file' },
    { id: 'message', label: 'Certifications, right to work and availability', type: 'textarea' }
  ],
  training: [
    {
      id: 'trainingAudience',
      label: 'Training audience',
      type: 'select',
      required: true,
      options: ['Organisation team', 'Individual learner', 'Registered manager', 'New starters']
    },
    {
      id: 'trainingCategory',
      label: 'Training category',
      type: 'select',
      required: true,
      options: ['Induction', 'Safeguarding', 'Medication', 'Leadership', 'Compliance and governance', 'Not sure yet']
    },
    {
      id: 'preferredFormat',
      label: 'Preferred format',
      type: 'select',
      required: true,
      options: ['Remote', 'In person', 'Hybrid', 'To be confirmed']
    },
    { id: 'message', label: 'Training goals', type: 'textarea', required: true }
  ],
  technology: [
    {
      id: 'projectType',
      label: 'Technology need',
      type: 'select',
      required: true,
      options: [
        'Website',
        'Website maintenance',
        'Forms and booking',
        'CRM or system support',
        'Dashboard or portal',
        'Technology audit'
      ]
    },
    {
      id: 'currentWebsite',
      label: 'Current website or system',
      type: 'text',
      placeholder: 'Optional link or system name'
    },
    { id: 'message', label: 'What should the digital system help you improve?', type: 'textarea', required: true }
  ],
  tender: [
    {
      id: 'tenderType',
      label: 'What are you bidding for?',
      type: 'select',
      required: true,
      options: [
        'Local authority tender',
        'Framework',
        'Supported living service',
        'Home care contract',
        'Operational planning only',
        'Other'
      ]
    },
    { id: 'deadline', label: 'Deadline', type: 'date' },
    { id: 'message', label: 'Tender or planning context', type: 'textarea', required: true }
  ],
  compliance: [
    {
      id: 'complianceNeed',
      label: 'Compliance support needed',
      type: 'select',
      required: true,
      options: [
        'Policy pack',
        'Policy review',
        'Protocol systems',
        'Audit readiness',
        'Compliance calendar',
        'Full compliance review'
      ]
    },
    {
      id: 'serviceType',
      label: 'Service type',
      type: 'text',
      placeholder: 'For example home care, supported living or training provider'
    },
    { id: 'message', label: 'Tell us what needs improving', type: 'textarea', required: true }
  ]
}

const titles: Record<ServiceFormVariant, string> = {
  consultation: 'Request support from Care Atlas',
  housing: 'Discuss supported living housing support',
  registration: 'Book a registration consultation',
  recruitment: 'Request recruitment support',
  agencyStaffing: 'Request temporary or bank staff',
  permanentRecruitment: 'Request permanent recruitment support',
  inspection: 'Request CQC inspection support',
  candidate: 'Register your interest in care or consultant roles',
  training: 'Enquire about care training',
  technology: 'Request a technology audit',
  tender: 'Plan a tender or operational project',
  compliance: 'Request compliance support'
}

function getFieldClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:ring-4 focus:outline-hidden ${
    hasError
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10'
      : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10'
  }`
}

export function LeadForm({ variant, title, intro }: LeadFormProps) {
  const dispatch = useAppDispatch()
  const submission = useAppSelector(state => state.enquiries.submissions[variant])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [securityError, setSecurityError] = useState('')
  const [regions, setRegions] = useState<string[]>([])
  const [counties, setCounties] = useState<string[]>([])
  const formStartedAt = useRef(Math.floor(Date.now() / 1000))
  const fields = useMemo(() => [...baseFields, ...variantFields[variant]], [variant])

  useEffect(() => {
    preloadRecaptcha()
  }, [])

  function validate(formData: FormData) {
    const nextErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = String(formData.get(field.id) ?? '').trim()

      if (field.required && !value) {
        nextErrors[field.id] = `${field.label} is required.`
      }

      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        nextErrors[field.id] = 'Enter a valid email address.'
      }

      if (field.id === 'password' && value && value.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters.'
      }
    })

    const password = String(formData.get('password') ?? '')
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '')
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      nextErrors.passwordConfirmation = 'Passwords do not match.'
    }

    if (!formData.get('consent')) {
      nextErrors.consent = 'Please confirm you are happy for Care Atlas to contact you about this enquiry.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nextErrors = validate(formData)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      const baseEntries = fields
        .filter(field => field.type !== 'file')
        .map(field => [field.label, String(formData.get(field.id) ?? '').trim()])
        .filter(([, value]) => value) as [string, unknown][]
      const details = Object.fromEntries([...baseEntries, ['regions', regions], ['counties', counties]])
      const comment = Object.entries(details)
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n')
      const attachments = fields
        .filter(field => field.type === 'file')
        .flatMap(field => {
          const value = formData.get(field.id)
          return value instanceof File && value.size > 0 ? [value] : []
        })

      try {
        setSecurityError('')
        const recaptchaAction = `care_atlas_${variant}_enquiry`.replace(/[^a-zA-Z0-9_]/g, '_')
        const recaptchaToken = await getRecaptchaToken(recaptchaAction)

        await dispatch(
          submitEnquiry({
            name: String(formData.get('name') ?? '').trim(),
            email: String(formData.get('email') ?? '').trim(),
            phone: String(formData.get('phone') ?? '').trim(),
            subject: title ?? titles[variant],
            enquiryType: variant,
            comment,
            details,
            consent: true,
            formStartedAt: formStartedAt.current,
            sourceUrl: window.location.href,
            website: String(formData.get('website') ?? ''),
            attachments,
            recaptchaToken,
            recaptchaAction,
            password: String(formData.get('password') ?? ''),
            passwordConfirmation: String(formData.get('passwordConfirmation') ?? '')
          })
        ).unwrap()

        setSubmitted(true)
        form.reset()
        setRegions([])
        setCounties([])
        formStartedAt.current = Math.floor(Date.now() / 1000)
      } catch (error) {
        if (error instanceof Error && error.message.includes('reCAPTCHA')) {
          setSecurityError(error.message)
        }
        setSubmitted(false)
      }
    }
  }

  return (
    <div className='shadow-theme-lg rounded-lg border border-gray-200 bg-white p-6'>
      <div className='border-b border-gray-200 pb-5'>
        <h2 className='text-2xl font-semibold text-gray-950'>{title ?? titles[variant]}</h2>
        <p className='mt-2 text-sm leading-6 text-gray-600'>
          {intro ??
            'Share a few details and the enquiry can be routed to the right consultancy, recruitment, training or technology workflow.'}
        </p>
      </div>

      {submitted && (
        <div className='border-success-200 bg-success-50 text-success-800 mt-5 rounded-lg border p-4 text-sm leading-6'>
          Thanks. Your enquiry has been sent to Care Atlas. A confirmation email should arrive shortly.
        </div>
      )}

      <form className='mt-6 grid gap-5' noValidate onSubmit={handleSubmit}>
        <input type='text' name='website' tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />
        <div className='grid gap-5 md:grid-cols-2'>
          {fields.map(field => {
            const hasError = Boolean(errors[field.id])
            const errorId = `${field.id}-error`

            return (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label htmlFor={field.id} className='mb-1.5 block text-sm font-semibold text-gray-800'>
                  {field.label}
                  {field.required && <span className='text-error-500'> *</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    name={field.id}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={getFieldClass(hasError)}
                    defaultValue=''
                  >
                    <option value='' disabled>
                      Select an option
                    </option>
                    {field.options?.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={5}
                    placeholder={field.placeholder ?? 'Add useful context, timelines, risks or questions.'}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={getFieldClass(hasError)}
                  />
                ) : field.type === 'file' ? (
                  <input
                    id={field.id}
                    name={field.id}
                    type='file'
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={`${getFieldClass(hasError)} file:bg-brand-50 file:text-brand-700 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm file:font-semibold`}
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.type === 'password' ? 'new-password' : undefined}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    className={getFieldClass(hasError)}
                  />
                )}
                {hasError && (
                  <p id={errorId} className='text-error-600 mt-1.5 text-xs font-medium'>
                    {errors[field.id]}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <RegionCountiesFormSection
          id='lead'
          selectedRegions={regions}
          selectedCounties={counties}
          onRegionsChange={setRegions}
          onCountiesChange={setCounties}
        />

        <div>
          <label className='flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700'>
            <input
              type='checkbox'
              name='consent'
              className='text-brand-600 focus:ring-brand-500 mt-1 h-4 w-4 rounded border-gray-300'
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
            />
            <span>
              I agree that Care Atlas can contact me about this enquiry. I understand my details will be handled in line
              with the privacy policy.
            </span>
          </label>
          {errors.consent && (
            <p id='consent-error' className='text-error-600 mt-1.5 text-xs font-medium'>
              {errors.consent}
            </p>
          )}
        </div>

        <Button
          type='submit'
          disabled={submission?.status === 'submitting'}
          loading={submission?.status === 'submitting'}
          fullWidth
        >
          Send enquiry
        </Button>
        {securityError && (
          <p className='text-error-600 text-sm font-medium' role='alert'>
            {securityError}
          </p>
        )}
        {submission?.status === 'failed' && (
          <p className='text-error-600 text-sm font-medium' role='alert'>
            {submission.error}
          </p>
        )}
      </form>
    </div>
  )
}
