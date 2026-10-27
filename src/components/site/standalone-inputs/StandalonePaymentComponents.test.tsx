import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StandalonePaymentDialog } from './StandalonePaymentDialog'
import { StandalonePaymentSummary } from './StandalonePaymentSummary'
import { StandaloneSecurePaymentField } from './StandaloneSecurePaymentField'

describe('standalone payment components', () => {
  it('renders an accessible payment dialog and closes it with Escape', () => {
    const onClose = vi.fn()

    render(
      <StandalonePaymentDialog title='Confirm purchase' onClose={onClose}>
        <p>Payment form</p>
      </StandalonePaymentDialog>
    )

    expect(screen.getByRole('dialog', { name: 'Confirm purchase' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('keeps a busy payment dialog open', () => {
    const onClose = vi.fn()

    render(
      <StandalonePaymentDialog title='Confirm purchase' busy onClose={onClose}>
        <p>Payment form</p>
      </StandalonePaymentDialog>
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Close payment dialog' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders payment summary values and secure-field errors', () => {
    render(
      <>
        <StandalonePaymentSummary
          items={[{ label: 'Credit pack', value: '100 credits' }]}
          totalValue='£100.00'
          note='One-time purchase'
        />
        <StandaloneSecurePaymentField error='Payment could not be confirmed.'>
          <div>Provider payment element</div>
        </StandaloneSecurePaymentField>
      </>
    )

    expect(screen.getByLabelText('Payment summary')).toHaveTextContent('£100.00')
    expect(screen.getByLabelText('Payment details')).toHaveTextContent('Provider payment element')
    expect(screen.getByRole('alert')).toHaveTextContent('Payment could not be confirmed.')
  })
})
