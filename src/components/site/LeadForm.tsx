'use client'

import { FormEvent, useMemo, useState } from 'react'
import { services } from '@/data/site'

type FieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'file' | 'date'

type Field = {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
}

type LeadFormProps = {
  variant:
    | 'consultation'
    | 'housing'
    | 'registration'
    | 'recruitment'
    | 'candidate'
    | 'training'
    | 'technology'
    | 'tender'
    | 'compliance'
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
  }
]

const variantFields: Record<LeadFormProps['variant'], Field[]> = {
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
  candidate: [
    {
      id: 'rolePreference',
      label: 'Preferred role',
      type: 'select',
      required: true,
      options: [
        'Care worker',
        'Support worker',
        'Senior care worker',
        'Registered manager',
        'Deputy manager',
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

const titles: Record<LeadFormProps['variant'], string> = {
  consultation: 'Request support from Care Atlas',
  housing: 'Discuss supported living housing support',
  registration: 'Book a registration consultation',
  recruitment: 'Request recruitment support',
  candidate: 'Register your interest in care jobs',
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const fields = useMemo(() => [...baseFields, ...variantFields[variant]], [variant])

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
    })

    if (!formData.get('consent')) {
      nextErrors.consent = 'Please confirm you are happy for Care Atlas to contact you about this enquiry.'
    }

    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nextErrors = validate(formData)

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      form.reset()
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
          Thanks. Your enquiry has been captured in the frontend flow. A production build can connect this to CRM, email
          routing or booking automation.
        </div>
      )}

      <form className='mt-6 grid gap-5' noValidate onSubmit={handleSubmit}>
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

        <button
          type='submit'
          className='bg-brand-600 shadow-theme-xs hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white transition focus:ring-4 focus:outline-hidden'
        >
          Send enquiry
        </button>
      </form>
    </div>
  )
}
