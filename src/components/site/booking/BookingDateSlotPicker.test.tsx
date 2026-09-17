import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { BookingSlot } from '@/lib/api/bookings'

import { BookingDateSlotPicker } from './BookingDateSlotPicker'

const slots: BookingSlot[] = [
  {
    startAt: '2026-09-21T09:00:00.000Z',
    endAt: '2026-09-21T09:30:00.000Z',
    label: '09:00',
    date: '2026-09-21',
    timezone: 'Europe/London'
  },
  {
    startAt: '2026-10-02T10:30:00.000Z',
    endAt: '2026-10-02T11:00:00.000Z',
    label: '10:30',
    date: '2026-10-02',
    timezone: 'Europe/London'
  }
]

const slotGroups = {
  '2026-09-21': [slots[0]],
  '2026-10-02': [slots[1]]
}

describe('BookingDateSlotPicker', () => {
  it('requires a date before selecting slots and supports future month navigation', async () => {
    const user = userEvent.setup()
    const onSelectSlot = vi.fn()
    const onClearSlot = vi.fn()

    render(
      <BookingDateSlotPicker
        slots={slots}
        slotGroups={slotGroups}
        selectedSlot={null}
        onSelectSlot={onSelectSlot}
        onClearSlot={onClearSlot}
      />
    )

    expect(screen.getByText('September 2026')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /21 Sept, 1 slots available/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /22 Sept, no slots available/i })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Next booking month' }))
    expect(screen.getByText('October 2026')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /2 Oct, 1 slots available/i }))
    await user.click(screen.getByRole('button', { name: /10:30/i }))

    expect(onClearSlot).toHaveBeenCalled()
    expect(onSelectSlot).toHaveBeenCalledWith(slots[1])
  })
})
