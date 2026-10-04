import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HalfScreenModalProvider } from '@/context/HalfScreenModalContext'
import type { PublicTender } from '@/lib/api/tenders'

import { HalfScreenModal } from '../HalfScreenModal'
import { TenderShareButton } from './TenderShareButton'

const trackEventMock = vi.fn()
const writeTextMock = vi.fn(async () => undefined)
const shareMock = vi.fn<(payload: ShareData) => Promise<void>>().mockResolvedValue(undefined)

vi.mock('@/components/analytics/trackEvent', () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args)
}))

const sampleTender: PublicTender = {
  id: 'tender-1',
  title: 'Supported Living Tender',
  buyer: 'Example Council',
  sourceReference: 'REF-100',
  category: 'Supported Living',
  categories: ['Supported Living'],
  keywords: ['Adult social care'],
  region: 'London',
  regions: ['London'],
  summary: 'A public summary for providers.',
  value: { minMinor: null, maxMinor: 25000000, currency: 'GBP' },
  publishedAt: null,
  submissionDeadline: '2026-10-10T11:00:00Z',
  daysRemaining: 12,
  contractStartDate: '2027-01-01',
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
  publicPath: '/tenders/tender-1'
}

function renderShareButton() {
  render(
    <HalfScreenModalProvider>
      <TenderShareButton tender={sampleTender} />
      <HalfScreenModal />
    </HalfScreenModalProvider>
  )
}

describe('TenderShareButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'share', { configurable: true, value: shareMock })
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true })
  })

  it('opens the established half-screen modal with the generated advert', async () => {
    const user = userEvent.setup()
    renderShareButton()

    await user.click(screen.getByRole('button', { name: 'Share' }))

    expect(await screen.findByRole('dialog', { name: 'Share tender' })).toBeInTheDocument()
    expect(screen.getByText('Tender advert preview')).toBeInTheDocument()
    expect(screen.getByText(/Buyer: Example Council/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy advert' })).toBeInTheDocument()
    expect(trackEventMock).toHaveBeenCalledWith('tender_share_modal_opened')
  })

  it('copies the full advert and provides accessible feedback', async () => {
    const user = userEvent.setup()
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: writeTextMock } })
    renderShareButton()

    await user.click(screen.getByRole('button', { name: 'Share' }))
    await user.click(await screen.findByRole('button', { name: 'Copy advert' }))

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('TENDER OPPORTUNITY'))
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('https://www.careatlas.co.uk/tenders/tender-1'))
    expect(await screen.findByRole('status')).toHaveTextContent('Tender advert copied.')
  })

  it('sends text and URL separately to the native share sheet', async () => {
    const user = userEvent.setup()
    renderShareButton()

    await user.click(screen.getByRole('button', { name: 'Share' }))
    const shareButtons = await screen.findAllByRole('button', { name: 'Share' })
    await user.click(shareButtons.at(-1)!)

    await waitFor(() => {
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Supported Living Tender',
          url: 'https://www.careatlas.co.uk/tenders/tender-1'
        })
      )
    })
    const [payload] = shareMock.mock.calls[0]!
    expect(payload.text).not.toContain('https://www.careatlas.co.uk/tenders/tender-1')
  })
})
