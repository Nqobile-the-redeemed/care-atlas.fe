import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { HalfScreenModal } from '@/components/site/HalfScreenModal'

import { HalfScreenModalProvider, useHalfScreenModal } from './HalfScreenModalContext'

function ExamplePanel({ data, onClose }: { data: { label: string }; onClose: () => void }) {
  return React.createElement(
    'div',
    null,
    React.createElement('p', null, data.label),
    React.createElement('button', { type: 'button', onClick: onClose }, 'Dismiss')
  )
}

function ExampleHarness() {
  const { openModal, updateModalData } = useHalfScreenModal()

  return React.createElement(
    'div',
    null,
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: () =>
          openModal(
            { label: 'Initial tender workspace' },
            {
              id: 'example-panel',
              component: ExamplePanel
            },
            {
              headerConfig: {
                title: 'Tender workspace',
                subtitle: 'Provider test'
              }
            }
          )
      },
      'Open panel'
    ),
    React.createElement(
      'button',
      { type: 'button', onClick: () => updateModalData({ label: 'Updated tender workspace' }) },
      'Update panel'
    )
  )
}

describe('HalfScreenModalContext', () => {
  it('opens, updates, and closes the half-screen drawer', async () => {
    const user = userEvent.setup()

    render(
      React.createElement(
        HalfScreenModalProvider,
        null,
        React.createElement(ExampleHarness),
        React.createElement(HalfScreenModal)
      )
    )

    await user.click(screen.getByRole('button', { name: 'Open panel' }))

    expect(screen.getByRole('dialog', { name: 'Tender workspace' })).toBeInTheDocument()
    expect(screen.getByText('Initial tender workspace')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Update panel' }))
    expect(screen.getByText('Updated tender workspace')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close tender details' }))
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
  })
})
