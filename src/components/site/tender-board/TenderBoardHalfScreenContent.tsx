'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormik, type FormikProps } from 'formik'

import {
  createPublicBooking,
  getBookingAvailability,
  getBookingEventTypes,
  type BookingEventType,
  type BookingSlot
} from '@/lib/api/bookings'
import { getRecaptchaToken, preloadRecaptcha } from '@/lib/recaptcha'
import { getPublicTender, sendTenderLead, type TenderLeadKind } from '@/lib/api/tenders'

import { TenderBoardFormYup, emptyTenderBoardFormValues } from './tenderLeadFormSchema'
import { Button } from '../ui'
import { TenderBoardLeadForm } from './TenderBoardLeadForm'
import { TenderBoardSelectedTenderPanel } from './TenderBoardSelectedTenderPanel'
import type { TenderBoardForm, TenderBoardPanelData, TenderBoardSelectedTender } from './types'
import { groupSlots, hasTenderDetails, tenderBookingMessage } from './utils'

type TenderBoardHalfScreenContentProps = {
  data: TenderBoardPanelData
  onClose: () => void
}

type FlowStep = 'form' | 'confirmed'

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
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [handoffUrl, setHandoffUrl] = useState<string | null>(null)
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([])
  const [selectedEventSlug, setSelectedEventSlug] = useState('')
  const [slots, setSlots] = useState<BookingSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [bookingOptionsLoading, setBookingOptionsLoading] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('form')
  const [pendingSubmission, setPendingSubmission] = useState<PendingSubmission | null>(null)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])

  const formik: FormikProps<TenderBoardForm> = useFormik<TenderBoardForm>({
    initialValues: {
      ...structuredClone(emptyTenderBoardFormValues),
      message: `I would like to discuss support for this tender: ${data.tender.title}. Please contact me with the next steps.`
    },
    validationSchema: TenderBoardFormYup,
    initialTouched: {},
    initialErrors: {},
    enableReinitialize: false,
    onSubmit: async () => {}
  })

  const selectedEventType = eventTypes.find(eventType => eventType.slug === selectedEventSlug)
  const slotGroups = useMemo(() => groupSlots(slots), [slots])

  useEffect(() => {
    setSelectedTender(data.tender)
    setLeadKind(data.initialLeadKind ?? 'enquiry')
    setSelectedSlot(null)
    setNotice('')
    setHandoffUrl(null)
    setError('')
    setFormStartedAt(Math.floor(Date.now() / 1000))
    setFlowStep('form')
    setPendingSubmission(null)
    setSelectedRegions([])
    setSelectedCounties([])
    formik.resetForm({
      values: {
        ...structuredClone(emptyTenderBoardFormValues),
        message: `I would like to discuss support for this tender: ${data.tender.title}. Please contact me with the next steps.`
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function submitLead(values: TenderBoardForm) {
    setSubmitting(true)
    setError('')
    setNotice('')

    try {
      await TenderBoardFormYup.validate(values, { abortEarly: false, stripUnknown: false })
    } catch (validateErr) {
      const firstMessage =
        validateErr instanceof Error ? validateErr.message : 'Please review the form and fix the highlighted fields.'
      setError(firstMessage)
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
          consultantUserId: selectedSlot.consultantUserId ?? null,
          timezone: selectedSlot.timezone,
          customer: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            companyName: values.company
          },
          intake: {
            serviceInterest: `Tender support: ${selectedTender.title}`,
            currentStage: selectedTender.sourceReference
              ? `Tender reference: ${selectedTender.sourceReference}`
              : 'Tender support booking',
            message: tenderBookingMessage(selectedTender, values.message),
            regions: selectedRegions,
            counties: selectedCounties
          },
          consent: values.consent,
          formStartedAt,
          sourceUrl: window.location.href,
          website: values.website,
          recaptchaToken: await getRecaptchaToken('care_atlas_tender_booking'),
          recaptchaAction: 'care_atlas_tender_booking'
        })

        setHandoffUrl(response.data.handoff?.url ?? null)
        setNotice(`Meeting received. Your reference is ${response.data.bookingReference}.`)
        setPendingSubmission({
          id: response.data.id,
          type: 'booking',
          email: values.email,
          reference: response.data.bookingReference
        })
        setSelectedRegions(selectedTender.regions ?? [])
        setFlowStep('confirmed')
        setSelectedSlot(null)
        return
      }

      const recaptchaAction = `care_atlas_tender_${leadKind}`
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)

      const response = await sendTenderLead(selectedTender.id, leadKind, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        whatsapp: values.whatsapp,
        preferredContactMethod: values.preferredContactMethod,
        preferredSlot: values.preferredSlot,
        tenderPreferences: {
          categories: selectedTender.categories,
          regions: selectedRegions.length > 0 ? selectedRegions : selectedTender.regions,
          counties: selectedCounties,
          channels: ['email', 'whatsapp'],
          notes: ''
        },
        company: values.company,
        message: values.message,
        consent: values.consent,
        formStartedAt,
        sourceUrl: window.location.href,
        website: values.website,
        recaptchaToken,
        recaptchaAction
      })

      setHandoffUrl(response.data.handoff?.url ?? null)
      setNotice('Tender enquiry received.')
      setPendingSubmission({
        id: response.data.id,
        type: 'enquiry',
        email: values.email
      })
      setSelectedRegions(selectedTender.regions ?? [])
      setFlowStep('confirmed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The tender request could not be sent.')
    } finally {
      setSubmitting(false)
    }
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
            Care Atlas uses Orbit Mirai to manage tender enquiries, meetings, documents and follow-up. Continue there to
            track this opportunity, or stay here for now.
          </p>
        </div>
        {handoffUrl && (
          <a
            href={handoffUrl}
            className='bg-brand-600 hover:bg-brand-700 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 text-sm font-semibold text-white'
          >
            Continue to Orbit Mirai
          </a>
        )}
        <Button
          variant='secondary'
          onClick={() => {
            formik.resetForm({ values: structuredClone(emptyTenderBoardFormValues) })
            onClose()
          }}
          fullWidth
          className='border-gray-300 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
        >
          Maybe later
        </Button>
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
        formik={formik}
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
        handoffUrl={handoffUrl}
        submitting={submitting}
        onSubmit={submitLead}
      />
    </div>
  )
}
