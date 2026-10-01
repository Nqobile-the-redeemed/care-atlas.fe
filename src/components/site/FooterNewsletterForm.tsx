'use client'

import { FormEvent, useRef, useState } from 'react'

import { ApiError } from '@/lib/api/client'
import { sendEnquiry } from '@/lib/api/enquiries'
import { CARE_ATLAS_RECAPTCHA_ACTIONS, getRecaptchaToken } from '@/lib/recaptcha'

import { Button } from './ui'

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error'

function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return Object.values(error.errors).flat()[0] ?? error.message
  }

  return error instanceof Error ? error.message : 'Your subscription could not be submitted. Please try again.'
}

export function FooterNewsletterForm() {
  const formStartedAt = useRef(Math.floor(Date.now() / 1000))
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const consent = formData.get('consent') === 'on'

    if (name.length < 2) {
      setStatus('error')
      setMessage('Enter your name.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('Enter a valid email address.')
      return
    }

    if (!consent) {
      setStatus('error')
      setMessage('Please confirm that you want to receive Care Atlas updates.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const recaptchaAction = CARE_ATLAS_RECAPTCHA_ACTIONS.newsletter
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)

      await sendEnquiry({
        name,
        email,
        subject: 'Care Atlas updates subscription',
        enquiryType: 'newsletter',
        comment: 'Please subscribe me to Care Atlas care operations updates.',
        details: {
          Subscription: 'Care operations updates'
        },
        consent: true,
        formStartedAt: formStartedAt.current,
        sourceUrl: window.location.href,
        website: String(formData.get('website') ?? ''),
        attachments: [],
        recaptchaToken,
        recaptchaAction
      })

      form.reset()
      formStartedAt.current = Math.floor(Date.now() / 1000)
      setStatus('success')
      setMessage('You are subscribed. Please check your inbox for confirmation.')
    } catch (error) {
      setStatus('error')
      setMessage(errorMessage(error))
    }
  }

  return (
    <form className='mt-6 rounded-lg border border-white/10 bg-white/5 p-4' noValidate onSubmit={handleSubmit}>
      <input type='text' name='website' tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />
      <p className='text-sm font-semibold text-white'>Get care operations updates</p>
      <div className='mt-3 grid gap-2'>
        <label htmlFor='footer-newsletter-name' className='sr-only'>
          Full name
        </label>
        <input
          id='footer-newsletter-name'
          name='name'
          type='text'
          autoComplete='name'
          placeholder='Full name'
          className='rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 focus:outline-hidden'
        />
        <label htmlFor='footer-newsletter-email' className='sr-only'>
          Email address
        </label>
        <input
          id='footer-newsletter-email'
          name='email'
          type='email'
          autoComplete='email'
          placeholder='Email address'
          className='rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 focus:outline-hidden'
        />
        <label className='text-blue-light-100 flex items-start gap-2 text-xs leading-5'>
          <input name='consent' type='checkbox' className='mt-1 h-4 w-4 shrink-0 rounded border-white/30' />
          <span>I agree to receive Care Atlas updates by email. I can unsubscribe at any time.</span>
        </label>
        <Button type='submit' size='sm' loading={status === 'submitting'} disabled={status === 'submitting'}>
          Join updates
        </Button>
      </div>
      <p className='text-blue-light-200 mt-2 text-xs leading-5'>Protected by Google reCAPTCHA.</p>
      {message && (
        <p
          className={`mt-2 text-xs leading-5 ${status === 'success' ? 'text-success-300' : 'text-error-300'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
    </form>
  )
}
