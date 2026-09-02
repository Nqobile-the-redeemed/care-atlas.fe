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
import { getPublicTender, sendTenderLead, type TenderLeadKind } from '@/lib/api/tenders'

import { emptyTenderBoardForm } from './constants'
import { TenderBoardLeadForm } from './TenderBoardLeadForm'
import { TenderBoardSelectedTenderPanel } from './TenderBoardSelectedTenderPanel'
import type { TenderBoardForm, TenderBoardPanelData, TenderBoardSelectedTender } from './types'
import { groupSlots, hasTenderDetails, tenderBookingMessage } from './utils'

type TenderBoardHalfScreenContentProps = {
  data: TenderBoardPanelData
  onClose: () => void
}

/**
 * Migrated tender review + response workspace.
 * This keeps the previous right-panel workflows intact, but moves them into a
 * drawer-local state boundary so board browsing and tender work can happen independently.
 */
export function TenderBoardHalfScreenContent({ data }: TenderBoardHalfScreenContentProps) {
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

  const selectedEventType = eventTypes.find(eventType => eventType.slug === selectedEventSlug)
  const slotGroups = useMemo(() => groupSlots(slots), [slots])

  useEffect(() => {
    setSelectedTender(data.tender)
    setLeadKind(data.initialLeadKind ?? 'enquiry')
    setSelectedSlot(null)
    setNotice('')
    setError('')
    setFormStartedAt(Math.floor(Date.now() / 1000))
    setForm({
      ...emptyTenderBoardForm,
      message: `I would like to discuss support for this tender: ${data.tender.title}. Please contact me with the next steps.`
    })
  }, [data])

  useEffect(() => {
    preloadRecaptcha()
  }, [])

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

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setSubmitting(false)
      return
    }
    if (!form.passwordConfirmation) {
      setError('Confirm your password.')
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
            message: tenderBookingMessage(selectedTender, form.message)
          },
          consent: form.consent,
          formStartedAt,
          sourceUrl: window.location.href,
          website: form.website
        })

        setNotice(
          response.data.googleMeetUrl
            ? `Meeting booked. Your reference is ${response.data.bookingReference}. The Google Meet link has been sent by email.`
            : `Meeting booked. Your reference is ${response.data.bookingReference}. We will confirm the Meet link shortly.`
        )
        setForm(emptyTenderBoardForm)
        setSelectedSlot(null)
        setFormStartedAt(Math.floor(Date.now() / 1000))
        return
      }

      const recaptchaAction = `care_atlas_tender_${leadKind}`
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)

      await sendTenderLead(selectedTender.id, leadKind, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        preferredContactMethod: form.preferredContactMethod,
        preferredSlot: form.preferredSlot,
        tenderPreferences: {
          categories: selectedTender.categories,
          regions: selectedTender.regions,
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

      setNotice('Tender enquiry sent.')
      setForm(emptyTenderBoardForm)
      setFormStartedAt(Math.floor(Date.now() / 1000))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender request could not be sent.')
    } finally {
      setSubmitting(false)
    }
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
      />
    </div>
  )
}
