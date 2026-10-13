import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import {
  TenderCareSpecificationFilters,
  TenderCareSpecificationSummary,
  readCareSpecifications
} from './TenderCareSpecificationFilters'

describe('Care specification filters', () => {
  it('restores repeated selections from a shared URL', () => {
    expect(
      readCareSpecifications(
        new URLSearchParams('service_regulation=mixed&service_regulation=unknown&cqc_eligibility=not_required')
      )
    ).toEqual({ service_regulation: ['mixed', 'unknown'], cqc_eligibility: ['not_required'], support_type: [] })
  })

  it('shows readable labels, counts and independent multi-select controls', () => {
    const toggle = vi.fn()
    render(
      <TenderCareSpecificationFilters
        groups={[
          {
            key: 'service_regulation',
            label: 'Service regulation',
            options: [
              { value: 'mixed', label: 'Mixed services', count: 1 },
              { value: 'unknown', label: 'Not established', count: 7 }
            ]
          }
        ]}
        selected={{ service_regulation: ['mixed'] }}
        onToggle={toggle}
      />
    )
    fireEvent.click(screen.getByText('Service regulation', { selector: 'summary' }))
    expect(screen.getByRole('checkbox', { name: /Mixed services/ })).toBeChecked()
    fireEvent.click(screen.getByRole('checkbox', { name: /Not established/ }))
    expect(toggle).toHaveBeenCalledWith('service_regulation', 'unknown')
  })

  it('does not display unsupported eligibility claims', () => {
    render(<TenderCareSpecificationSummary profile={{ reviewStatus: 'pending', evidence: [] }} />)
    expect(screen.queryByText('Care service requirements')).not.toBeInTheDocument()
  })

  it('keeps regulated Homecare distinct from non-regulated community support', () => {
    render(
      <TenderCareSpecificationSummary
        profile={{
          reviewStatus: 'reviewed',
          components: [
            { service: 'standard_community_support', regulation: 'non_regulated' },
            { service: 'homecare', regulation: 'regulated' }
          ],
          evidence: [{ document: 'Specification', locator: '3.2', excerpt: 'Mixed framework.' }]
        }}
      />
    )
    expect(screen.getByText(/Non-regulated support/)).toBeInTheDocument()
    expect(screen.getByText(/Regulated care/)).toBeInTheDocument()
    expect(screen.getByText(/Specification - 3.2/)).toBeInTheDocument()
  })
})
