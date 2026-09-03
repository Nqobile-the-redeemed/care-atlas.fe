import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HalfScreenModalProvider } from '@/context/HalfScreenModalContext'

import { HalfScreenModal } from './HalfScreenModal'
import { TenderBoardClient } from './TenderBoardClient'

vi.mock('@/lib/recaptcha', () => ({
  preloadRecaptcha: vi.fn(),
  getRecaptchaToken: vi.fn(async () => 'test-token')
}))

vi.mock('@/lib/api/tenders', () => ({
  getPublicTenders: vi.fn(async () => ({
    data: [
      {
        id: 'tender-1',
        title: 'Supported Living Tender',
        buyer: 'Example Council',
        sourceReference: 'REF-100',
        category: 'Care',
        categories: ['Care'],
        region: 'London',
        regions: ['London'],
        summary: 'Public summary',
        value: { minMinor: 12500000, maxMinor: 25000000, currency: 'GBP' },
        publishedAt: null,
        submissionDeadline: '2026-10-10',
        daysRemaining: 12,
        contractStartDate: null,
        contractEndDate: null,
        states: [],
        indicativePricing: {
          upfrontFeeMinor: 250000,
          successFeeMinor: null,
          currency: 'GBP',
          reviewed: true
        },
        locked: false,
        lastSeenAt: null
      }
    ]
  })),
  getPublicTender: vi.fn(async () => ({
    data: {
      id: 'tender-1',
      title: 'Supported Living Tender',
      buyer: 'Example Council',
      sourceReference: 'REF-100',
      category: 'Care',
      categories: ['Care'],
      region: 'London',
      regions: ['London'],
      summary: 'Public summary',
      value: { minMinor: 12500000, maxMinor: 25000000, currency: 'GBP' },
      publishedAt: null,
      submissionDeadline: '2026-10-10',
      daysRemaining: 12,
      contractStartDate: null,
      contractEndDate: null,
      states: [],
      indicativePricing: {
        upfrontFeeMinor: 250000,
        successFeeMinor: null,
        currency: 'GBP',
        reviewed: true
      },
      locked: false,
      lastSeenAt: null,
      description: 'Full detailed description',
      buyerType: 'Local authority',
      stage: 'open',
      procedureType: 'Open',
      procurementType: 'Services',
      clarificationDeadline: null,
      deliveryLocations: ['London'],
      cpvCodes: ['85000000'],
      isFramework: false,
      isDynamicMarket: false,
      smeSuitable: true,
      vcseSuitable: null,
      sourceNoticeUrl: 'https://example.com/notice',
      responsePortalUrl: 'https://example.com/portal',
      sourceUpdatedAt: null,
      lots: []
    }
  })),
  sendTenderLead: vi.fn(async () => ({ data: { id: 'lead-1' } }))
}))

vi.mock('@/lib/api/bookings', () => ({
  getBookingEventTypes: vi.fn(async () => ({
    data: [
      {
        id: 'event-1',
        slug: 'general-care-atlas-consultation',
        name: 'General consultation',
        description: 'Review scope and next steps.',
        durationMinutes: 45,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        minimumNoticeMinutes: 0,
        maxDaysAhead: 30,
        locationType: 'google_meet',
        isActive: true
      }
    ]
  })),
  getBookingAvailability: vi.fn(async () => ({
    data: {
      eventType: {
        id: 'event-1',
        slug: 'general-care-atlas-consultation',
        name: 'General consultation',
        description: 'Review scope and next steps.',
        durationMinutes: 45,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        minimumNoticeMinutes: 0,
        maxDaysAhead: 30,
        locationType: 'google_meet',
        isActive: true
      },
      timezone: 'Europe/London',
      slots: [
        {
          startAt: '2026-09-10T10:00:00.000Z',
          endAt: '2026-09-10T10:45:00.000Z',
          label: '10:00',
          date: '2026-09-10',
          timezone: 'Europe/London'
        }
      ]
    }
  })),
  createPublicBooking: vi.fn(async () => ({
    data: {
      id: 'booking-1',
      bookingReference: 'BK-100',
      status: 'confirmed',
      customer: {
        name: 'Alex',
        email: 'alex@example.com',
        phone: '01234',
        companyName: 'Example Care'
      },
      eventType: {
        id: 'event-1',
        slug: 'general-care-atlas-consultation',
        name: 'General consultation',
        durationMinutes: 45
      },
      startAt: '2026-09-10T10:00:00.000Z',
      endAt: '2026-09-10T10:45:00.000Z',
      timezone: 'Europe/London',
      locationType: 'google_meet',
      googleMeetUrl: 'https://meet.google.com/test',
      googleSyncError: null,
      intake: {}
    }
  }))
}))

describe('TenderBoardClient', () => {
  it('opens the tender drawer and renders migrated detail and workflow content', async () => {
    const user = userEvent.setup()

    render(
      React.createElement(
        HalfScreenModalProvider,
        null,
        React.createElement(TenderBoardClient),
        React.createElement(HalfScreenModal)
      )
    )

    expect(await screen.findByText('Supported Living Tender')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open details' }))

    expect(await screen.findByRole('dialog', { name: 'Supported Living Tender' })).toBeInTheDocument()
    expect(await screen.findByText('Tender details')).toBeInTheDocument()
    expect(await screen.findByText('Full detailed description')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /booking/i }))

    expect(await screen.findByText('Available times')).toBeInTheDocument()
    expect(await screen.findByText('Review scope and next steps.')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument()
    })
  })
})
