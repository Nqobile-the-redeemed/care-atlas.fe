import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { InstagramTenderLinks } from './InstagramTenderLinks'
vi.mock('@/lib/api/client', () => ({
  apiRequest: vi.fn(async () => ({
    data: [
      { title: 'Adult homecare', reference: 'ABC12345', trackingUrl: 'https://api.orbitmirai.com/v1/r/one' },
      { title: 'Supported living', reference: 'DEF67890', trackingUrl: 'https://api.orbitmirai.com/v1/r/two' }
    ]
  }))
}))
it('finds the post reference and follows its tracked booking link', async () => {
  render(<InstagramTenderLinks />)
  await screen.findByText('Adult homecare')
  fireEvent.change(screen.getByLabelText('Tender title or reference'), { target: { value: 'abc12345' } })
  expect(screen.queryByText('Supported living')).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'View tender and book a consultation' })).toHaveAttribute(
    'href',
    'https://api.orbitmirai.com/v1/r/one'
  )
})
