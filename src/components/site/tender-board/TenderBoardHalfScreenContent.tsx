'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

import {
  createPublicBooking,
  getBookingAvailability,
  getBookingEventTypes,
  type BookingEventType,
  type BookingSlot
} from '@/lib/api/bookings'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha'
import {
  getPublicTender,
  getPublicTenderFilters,
  resendTenderOnboardingOtp,
  saveTenderNotificationPreferences,
  sendTenderLead,
  verifyTenderOnboardingOtp,
  type TenderFilters,
  type TenderLeadKind
} from '@/lib/api/tenders'

import { emptyTenderBoardForm } from './constants'
import { RegionCountiesFormSection } from '../standalone-inputs'
import { TenderBoardLeadForm } from './TenderBoardLeadForm'
import { TenderBoardSelectedTenderPanel } from './TenderBoardSelectedTenderPanel'
import type { TenderBoardForm, TenderBoardPanelData, TenderBoardSelectedTender } from './types'
import { groupSlots, hasTenderDetails, tenderBookingMessage } from './utils'

type TenderBoardHalfScreenContentProps = {
  data: TenderBoardPanelData
  onClose: () => void
}

type FlowStep = 'form' | 'verify' | 'confirmed' | 'preferences'

type PendingSubmission = {
  id: string
  type: TenderLeadKind
  email: string
  reference?: string
}

export function TenderBoardHalfScreenContent({ data, onClose }: TenderBoardHalfScreenContentProps) {
  const [selectedTender, setSelectedTender] = useState<TenderBoardSelectedTender>(data.tender)
  const [leadKind, setLeadKind] = useState<TenderLeadKind>(data.initialLeadKind ?? 'enquiry')
  const [formStartedAt, setFormStartedAt] = useState(() => Math.floor(Date.now() / 1000))
  const [form, setForm] = useState<TenderBoardForm>(() => ({
    ...emptyTenderBoardForm,
    message: `I would like to discuss support for this tender: ${data.tender.title}. Please contact me with the next steps.`
  }))
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([])
  const [selectedEventSlug, setSelectedEventSlug] = useState('')
  const [slots, setSlots] = useState<BookingSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [bookingOptionsLoading, setBookingOptionsLoading] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('form')
  const [pendingSubmission, setPendingSubmission] = useState<PendingSubmission | null>(null)
  const [otpCode, setOtpCode] = useState('')
  const [otpMessage, setOtpMessage] = useState('Enter the six-digit code sent to your email address.')
  const [otpResendSeconds, setOtpResendSeconds] = useState(45)
  const [authToken, setAuthToken] = useState('')
  const [profileComplete, setProfileComplete] = useState(false)
  const [availableFilters, setAvailableFilters] = useState<TenderFilters>({ categories: [], regions: [] })
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTenderTypes, setSelectedTenderTypes] = useState<string[]>([])
  const [preferenceConsent, setPreferenceConsent] = useState(false)

  const selectedEventType = eventTypes.find(eventType => eventType.slug === selectedEventSlug)
  const slotGroups = useMemo(() => groupSlots(slots), [slots])

  useEffect(() => {
    setSelectedTender(data.tender)
    setLeadKind(data.initialLeadKind ?? 'enquiry')
    setSelectedSlot(null)
    setNotice('')
    setError('')
    setFormStartedAt(Math.floor(Date.now() / 1000))
    setFlowStep('form')
    setPendingSubmission(null)
    setOtpCode('')
    setOtpMessage('Enter the six-digit code sent to your email address.')
    setAuthToken('')
    setProfileComplete(false)
    setPreferenceConsent(false)
    setSelectedRegions([])
    setSelectedCounties([])
    setSelectedCategories([])
    setSelectedTenderTypes([])
    setForm({
      ...emptyTenderBoardForm,
      message: `I would like to discuss support for this tender: ${data.tender.title}. Please contact me with the next steps.`
    })
  }, [data])

  useEffect(() => {
    preloadRecaptcha()
  }, [])

  useEffect(() => {
    if (flowStep !== 'verify' || otpResendSeconds <= 0) return

    const timer = window.setTimeout(() => setOtpResendSeconds(seconds => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [flowStep, otpResendSeconds])

  useEffect(() => {
    if (hasTenderDetails(selectedTender)) return

    let alive = true

    async function loadDetails() {
      try {
        setDetailsLoading(true)
        const response = await getPublicTender(selectedTender.id)
        if (!alive) return
        setSelectedTender(response.data)
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'The tender details could not be loaded.')
      } finally {
        if (alive) setDetailsLoading(false)
      }
    }

    void loadDetails()

    return () => {
      alive = false
    }
  }, [selectedTender])

  useEffect(() => {
    if (flowStep !== 'preferences') return

    let alive = true

    getPublicTenderFilters()
      .then(response => {
        if (!alive) return
        setAvailableFilters(response.data)
      })
      .catch(() => {
        if (!alive) return
        setAvailableFilters({
          categories: selectedTender?.categories ?? [],
          regions: selectedTender?.regions ?? []
        })
      })

    return () => {
      alive = false
    }
  }, [flowStep, selectedTender])

  useEffect(() => {
    if (leadKind !== 'booking' || eventTypes.length > 0) return

    let alive = true

    async function loadEventTypes() {
      try {
        setBookingOptionsLoading(true)
        const response = await getBookingEventTypes()
        if (!alive) return

        setEventTypes(response.data)
        setSelectedEventSlug(
          response.data.find(eventType => eventType.slug === 'general-care-atlas-consultation')?.slug ??
            response.data[0]?.slug ??
            ''
        )
      } catch (err) {
        if (!alive) return
        setError(err instanceof Error ? err.message : 'Booking options could not be loaded.')
      } finally {
        if (alive) setBookingOptionsLoading(false)
      }
    }

    void loadEventTypes()

    return () => {
      alive = false
    }
  }, [eventTypes.length, leadKind])

  useEffect(() => {
    if (leadKind !== 'booking' || !selectedEventSlug) return

    let alive = true

    async function loadAvailability() {
      try {
        setBookingOptionsLoading(true)
        setSelectedSlot(null)
        const response = await getBookingAvailability({
          eventTypeSlug: selectedEventSlug,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London'
        })
        if (!alive) return
        setSlots(response.data.slots)
      } catch (err) {
        if (!alive) return
        setSlots([])
        setError(err instanceof Error ? err.message : 'Availability could not be loaded.')
      } finally {
        if (alive) setBookingOptionsLoading(false)
      }
    }

    void loadAvailability()

    return () => {
      alive = false
    }
  }, [leadKind, selectedEventSlug])

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setError('')
    setNotice('')

    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setSubmitting(false)
      return
    }
    if (form.password !== form.passwordConfirmation) {
      setError('Passwords do not match.')
      setSubmitting(false)
      return
    }

    try {
      if (leadKind === 'booking') {
        if (!selectedSlot) {
          setError('Choose an available meeting slot.')
          return
        }

        const response = await createPublicBooking({
          eventTypeSlug: selectedEventSlug,
          startAt: selectedSlot.startAt,
          endAt: selectedSlot.endAt,
          timezone: selectedSlot.timezone,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            companyName: form.company,
            password: form.password,
            passwordConfirmation: form.passwordConfirmation
          },
          intake: {
            serviceInterest: `Tender support: ${selectedTender.title}`,
            currentStage: selectedTender.sourceReference
              ? `Tender reference: ${selectedTender.sourceReference}`
              : 'Tender support booking',
            message: tenderBookingMessage(selectedTender, form.message),
            regions: selectedRegions,
            counties: selectedCounties
          },
          consent: form.consent,
          formStartedAt,
          sourceUrl: window.location.href,
          website: form.website
        })

        setNotice(
          `Meeting received. Your reference is ${response.data.bookingReference}. Verify your email to confirm it.`
        )
        setPendingSubmission({
          id: response.data.id,
          type: 'booking',
          email: form.email,
          reference: response.data.bookingReference
        })
        setSelectedRegions(selectedTender.regions ?? [])
        setSelectedCategories(selectedTender.categories ?? [])
        setFlowStep('verify')
        setOtpResendSeconds(45)
        setSelectedSlot(null)
        return
      }

      const recaptchaAction = `care_atlas_tender_${leadKind}`
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)

      const response = await sendTenderLead(selectedTender.id, leadKind, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        preferredContactMethod: form.preferredContactMethod,
        preferredSlot: form.preferredSlot,
        tenderPreferences: {
          categories: selectedTender.categories,
          regions: selectedRegions.length > 0 ? selectedRegions : selectedTender.regions,
          counties: selectedCounties,
          channels: ['email', 'whatsapp'],
          notes: form.tenderPreferenceNotes
        },
        company: form.company,
        address: {
          line1: form.line1,
          line2: form.line2,
          city: form.city,
          county: form.county,
          postcode: form.postcode,
          country: form.country
        },
        message: form.message,
        consent: form.consent,
        formStartedAt,
        sourceUrl: window.location.href,
        website: form.website,
        password: form.password,
        passwordConfirmation: form.passwordConfirmation,
        recaptchaToken,
        recaptchaAction
      })

      setNotice('Tender enquiry received. Verify your email to confirm it.')
      setPendingSubmission({
        id: response.data.id,
        type: 'enquiry',
        email: form.email
      })
      setSelectedRegions(selectedTender.regions ?? [])
      setSelectedCategories(selectedTender.categories ?? [])
      setFlowStep('verify')
      setOtpResendSeconds(45)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender request could not be sent.')
    } finally {
      setSubmitting(false)
    }
  }

  async function verifyOtp() {
    if (!pendingSubmission) return

    setSubmitting(true)
    setError('')
    try {
      const response = await verifyTenderOnboardingOtp({
        email: pendingSubmission.email,
        otpCode,
        submissionId: pendingSubmission.id,
        submissionType: pendingSubmission.type
      })

      setAuthToken(response.data.auth.token)
      setProfileComplete(response.data.profileComplete)
      setNotice('Verified. We have sent your confirmation email.')
      setFlowStep('confirmed')
    } catch (err) {
      setOtpMessage(err instanceof Error ? err.message : 'The code could not be verified.')
    } finally {
      setSubmitting(false)
    }
  }

  async function resendOtp() {
    if (!pendingSubmission || otpResendSeconds > 0) return

    setSubmitting(true)
    try {
      const response = await resendTenderOnboardingOtp(pendingSubmission.email)
      setOtpMessage(response.message)
      setOtpResendSeconds(45)
    } catch (err) {
      setOtpMessage(err instanceof Error ? err.message : 'A new code could not be sent yet.')
    } finally {
      setSubmitting(false)
    }
  }

  async function savePreferences() {
    if (!authToken) return

    if (!preferenceConsent) {
      setError('Confirm that you want to receive tender notifications.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await saveTenderNotificationPreferences(authToken, {
        optedIn: true,
        isActive: true,
        consentSource: 'care_atlas_tender_onboarding',
        regions: selectedRegions,
        categories: selectedCategories,
        tenderTypes: selectedTenderTypes
      })
      setNotice('Tender notifications saved.')
      if (!profileComplete) {
        window.location.href = '/profile-complete'
        return
      }
      setForm(emptyTenderBoardForm)
      setFormStartedAt(Math.floor(Date.now() / 1000))
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preferences could not be saved.')
    } finally {
      setSubmitting(false)
    }
  }

  function toggleValue(values: string[], value: string) {
    return values.includes(value) ? values.filter(item => item !== value) : [...values, value]
  }

  if (flowStep === 'verify' && pendingSubmission) {
    return (
      <div className='space-y-5 p-4 md:p-6'>
        <div>
          <p className='text-brand-700 text-xs font-semibold uppercase'>Email verification</p>
          <h2 className='mt-2 text-xl font-semibold text-gray-950'>Check your inbox</h2>
          <p className='mt-2 text-sm leading-6 text-gray-600'>{otpMessage}</p>
        </div>
        <input
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={6}
          value={otpCode}
          onChange={event => setOtpCode(event.target.value.replace(/\D/g, ''))}
          aria-label='Verification code'
          className='focus:border-brand-500 focus:ring-brand-500/10 h-14 w-full rounded-lg border border-gray-300 bg-white px-4 text-center text-xl tracking-[0.35em] text-gray-950 outline-hidden transition focus:ring-4'
        />
        <button
          type='button'
          disabled={submitting || otpCode.length !== 6}
          onClick={verifyOtp}
          className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden disabled:opacity-50'
        >
          {submitting ? 'Checking...' : 'Verify email'}
        </button>
        <button
          type='button'
          disabled={submitting || otpResendSeconds > 0}
          onClick={resendOtp}
          className='text-brand-700 hover:text-brand-800 w-full text-sm font-semibold disabled:text-gray-400'
        >
          {otpResendSeconds > 0 ? `Send a new code in ${otpResendSeconds}s` : 'Send a new code'}
        </button>
      </div>
    )
  }

  if (flowStep === 'confirmed') {
    return (
      <div className='space-y-5 p-4 md:p-6'>
        <div>
          <p className='text-success-700 text-xs font-semibold uppercase'>Received</p>
          <h2 className='mt-2 text-xl font-semibold text-gray-950'>
            Your {pendingSubmission?.type === 'booking' ? 'meeting request' : 'enquiry'} is confirmed
          </h2>
          <p className='mt-2 text-sm leading-6 text-gray-600'>
            We have sent a confirmation email. You can also receive alerts when similar tenders are published.
          </p>
        </div>
        <button
          type='button'
          onClick={() => setFlowStep('preferences')}
          className='bg-brand-600 hover:bg-brand-700 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white'
        >
          Send me tender notifications
        </button>
        <button
          type='button'
          onClick={() => {
            if (!profileComplete) {
              window.location.href = '/profile-complete'
              return
            }
            setForm(emptyTenderBoardForm)
            onClose()
          }}
          className='inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50'
        >
          Not now
        </button>
      </div>
    )
  }

  if (flowStep === 'preferences') {
    const tenderTypeOptions = ['services', 'framework', 'dynamic_market', 'open', 'selective']

    return (
      <div className='space-y-5 p-4 md:p-6'>
        <div>
          <p className='text-brand-700 text-xs font-semibold uppercase'>Tender notifications</p>
          <h2 className='mt-2 text-xl font-semibold text-gray-950'>Choose matching preferences</h2>
        </div>
        <RegionCountiesFormSection
          id='tender-preferences'
          selectedRegions={selectedRegions}
          selectedCounties={selectedCounties}
          onRegionsChange={setSelectedRegions}
          onCountiesChange={setSelectedCounties}
        />
        <fieldset className='space-y-2'>
          <legend className='text-sm font-semibold text-gray-900'>Categories</legend>
          <div className='grid gap-2'>
            {availableFilters.categories.map(category => (
              <label key={category} className='flex items-center gap-2 text-sm text-gray-700'>
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(category)}
                  onChange={() => setSelectedCategories(current => toggleValue(current, category))}
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className='space-y-2'>
          <legend className='text-sm font-semibold text-gray-900'>Tender types</legend>
          <div className='grid gap-2'>
            {tenderTypeOptions.map(type => (
              <label key={type} className='flex items-center gap-2 text-sm text-gray-700 capitalize'>
                <input
                  type='checkbox'
                  checked={selectedTenderTypes.includes(type)}
                  onChange={() => setSelectedTenderTypes(current => toggleValue(current, type))}
                />
                {type.replace(/_/g, ' ')}
              </label>
            ))}
          </div>
        </fieldset>
        <label className='flex gap-3 text-sm leading-6 text-gray-600'>
          <input
            required
            type='checkbox'
            checked={preferenceConsent}
            onChange={event => setPreferenceConsent(event.target.checked)}
            className='mt-1 h-4 w-4 rounded border-gray-300'
          />
          I agree to receive tender notification emails and understand I can unsubscribe later.
        </label>
        {error && <p className='bg-error-50 text-error-700 rounded-lg p-3 text-sm font-medium'>{error}</p>}
        <button
          type='button'
          disabled={submitting}
          onClick={savePreferences}
          className='bg-brand-600 hover:bg-brand-700 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white disabled:opacity-50'
        >
          {submitting ? 'Saving...' : 'Save preferences'}
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <TenderBoardSelectedTenderPanel
        selectedTender={selectedTender}
        detailsLoading={detailsLoading}
        onBookMeeting={() => setLeadKind('booking')}
        onSendEnquiry={() => setLeadKind('enquiry')}
      />

      <TenderBoardLeadForm
        selectedTender={selectedTender}
        leadKind={leadKind}
        setLeadKind={setLeadKind}
        form={form}
        setForm={setForm}
        selectedEventSlug={selectedEventSlug}
        setSelectedEventSlug={setSelectedEventSlug}
        eventTypes={eventTypes}
        selectedEventType={selectedEventType}
        slots={slots}
        slotGroups={slotGroups}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        bookingOptionsLoading={bookingOptionsLoading}
        notice={notice}
        error={error}
        submitting={submitting}
        onSubmit={submitLead}
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
        selectedCounties={selectedCounties}
        setSelectedCounties={setSelectedCounties}
      />
    </div>
  )
}
