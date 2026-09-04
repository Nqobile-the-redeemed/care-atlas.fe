'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha'
import { submitEnquiry } from '@/features/enquiries/enquiriesSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { RegionCountiesFormSection } from './standalone-inputs'
import { Button } from './ui'

const fieldClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-brand-500/10 focus:ring-4 focus:outline-hidden'
const errorFieldClass =
  'w-full rounded-lg border border-error-500 bg-white px-4 py-3 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:border-error-500 focus:ring-error-500/10 focus:ring-4 focus:outline-hidden'

type ContactFormValues = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  password: string
  passwordConfirmation: string
}

function validate(values: ContactFormValues, consent: boolean) {
  const errors: Partial<Record<keyof ContactFormValues | 'consent', string>> = {}

  if (values.name.length < 2) {
    errors.name = 'Enter your name.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.subject.length < 3) {
    errors.subject = 'Enter a subject.'
  }

  if (values.message.length < 10) {
    errors.message = 'Enter a message with at least 10 characters.'
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = 'Confirm your password.'
  } else if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Passwords do not match.'
  }

  if (!consent) {
    errors.consent = 'Please confirm Care Atlas can contact you about this enquiry.'
  }

  return errors
}

export function CareAtlasContactForm() {
  const dispatch = useAppDispatch()
  const submission = useAppSelector(state => state.enquiries.submissions.contact)
  const formStartedAt = useRef(Math.floor(Date.now() / 1000))
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues | 'consent', string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [securityError, setSecurityError] = useState('')
  const [regions, setRegions] = useState<string[]>([])
  const [counties, setCounties] = useState<string[]>([])

  useEffect(() => {
    preloadRecaptcha()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const values = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
      passwordConfirmation: String(formData.get('passwordConfirmation') ?? '')
    }
    const nextErrors = validate(values, formData.get('consent') === 'on')

    setErrors(nextErrors)
    setSecurityError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      const recaptchaAction = 'care_atlas_contact'
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)

      await dispatch(
        submitEnquiry({
          name: values.name,
          email: values.email,
          phone: values.phone,
          subject: values.subject,
          enquiryType: 'contact',
          comment: values.message,
          details: {
            Subject: values.subject,
            Message: values.message,
            regions,
            counties
          },
          consent: true,
          formStartedAt: formStartedAt.current,
          sourceUrl: window.location.href,
          website: String(formData.get('website') ?? ''),
          attachments: [],
          recaptchaToken,
          recaptchaAction,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation
        })
      ).unwrap()

      setSubmitted(true)
      form.reset()
      setRegions([])
      setCounties([])
      formStartedAt.current = Math.floor(Date.now() / 1000)
    } catch (error) {
      setSubmitted(false)
      if (error instanceof Error && error.message.includes('reCAPTCHA')) {
        setSecurityError(error.message)
      }
    }
  }

  return (
    <div className='shadow-theme-lg rounded-lg border border-gray-200 bg-white p-6'>
      <div className='border-b border-gray-200 pb-5'>
        <h2 className='text-2xl font-semibold text-gray-950'>Contact Care Atlas</h2>
        <p className='mt-2 text-sm leading-6 text-gray-600'>
          Send a direct message and Care Atlas will route it to the right support area.
        </p>
      </div>

      {submitted && (
        <div className='border-success-200 bg-success-50 text-success-800 mt-5 rounded-lg border p-4 text-sm leading-6'>
          Thanks. Your message has been sent to Care Atlas.
        </div>
      )}

      <form className='mt-6 grid gap-5' noValidate onSubmit={handleSubmit}>
        <input type='text' name='website' tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />

        <div className='grid gap-5 md:grid-cols-2'>
          <div>
            <label htmlFor='contact-name' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Full name <span className='text-error-500'>*</span>
            </label>
            <input
              id='contact-name'
              name='name'
              type='text'
              className={errors.name ? errorFieldClass : fieldClass}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.name}</p>}
          </div>

          <div>
            <label htmlFor='contact-email' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Email address <span className='text-error-500'>*</span>
            </label>
            <input
              id='contact-email'
              name='email'
              type='email'
              className={errors.email ? errorFieldClass : fieldClass}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.email}</p>}
          </div>
        </div>

        <div>
          <label htmlFor='contact-phone' className='mb-1.5 block text-sm font-semibold text-gray-800'>
            Phone number
          </label>
          <input id='contact-phone' name='phone' type='tel' className={fieldClass} />
        </div>

        <div>
          <label htmlFor='contact-subject' className='mb-1.5 block text-sm font-semibold text-gray-800'>
            Subject <span className='text-error-500'>*</span>
          </label>
          <input
            id='contact-subject'
            name='subject'
            type='text'
            className={errors.subject ? errorFieldClass : fieldClass}
            aria-invalid={Boolean(errors.subject)}
          />
          {errors.subject && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor='contact-message' className='mb-1.5 block text-sm font-semibold text-gray-800'>
            Message <span className='text-error-500'>*</span>
          </label>
          <textarea
            id='contact-message'
            name='message'
            rows={6}
            className={errors.message ? errorFieldClass : fieldClass}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.message}</p>}
        </div>

        <RegionCountiesFormSection
          id='contact'
          selectedRegions={regions}
          selectedCounties={counties}
          onRegionsChange={setRegions}
          onCountiesChange={setCounties}
        />

        <div className='grid gap-5 md:grid-cols-2'>
          <div>
            <label htmlFor='contact-password' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Password <span className='text-error-500'>*</span>
            </label>
            <input
              id='contact-password'
              name='password'
              type='password'
              autoComplete='new-password'
              className={errors.password ? errorFieldClass : fieldClass}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.password}</p>}
          </div>

          <div>
            <label htmlFor='contact-password-confirmation' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Confirm password <span className='text-error-500'>*</span>
            </label>
            <input
              id='contact-password-confirmation'
              name='passwordConfirmation'
              type='password'
              autoComplete='new-password'
              className={errors.passwordConfirmation ? errorFieldClass : fieldClass}
              aria-invalid={Boolean(errors.passwordConfirmation)}
            />
            {errors.passwordConfirmation && (
              <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.passwordConfirmation}</p>
            )}
          </div>
        </div>

        <div>
          <label className='flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700'>
            <input
              type='checkbox'
              name='consent'
              className='text-brand-600 focus:ring-brand-500 mt-1 h-4 w-4 rounded border-gray-300'
              aria-invalid={Boolean(errors.consent)}
            />
            <span>
              I agree that Care Atlas can contact me about this enquiry. I understand my details will be handled in line
              with the privacy policy.
            </span>
          </label>
          {errors.consent && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.consent}</p>}
        </div>

        <p className='text-xs leading-5 text-gray-500'>
          Protected by Google reCAPTCHA. Backend verification is required before accepting submissions.
        </p>

        <Button
          type='submit'
          disabled={submission?.status === 'submitting'}
          loading={submission?.status === 'submitting'}
          fullWidth
        >
          Send message
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
