import { afterEach, describe, it, expect } from 'vitest'
import { render, waitFor, cleanup, fireEvent } from '@testing-library/react'

import { StandaloneMultiSelect } from '@/components/site/standalone-inputs'
import type { MultiSelectOption } from '@/components/site/standalone-inputs'

const options: MultiSelectOption[] = [
  { code: 'NW', name: 'North West', description: 'North West England' },
  { code: 'LDN', name: 'London', description: 'Greater London' },
  { code: 'SE', name: 'South East', description: 'South East England' },
  { code: 'SW', name: 'South West', description: 'South West England' }
]

afterEach(() => {
  cleanup()
})

describe('StandaloneMultiSelect', () => {
  it('TR-1.1: renders placeholder on empty combobox input', () => {
    const placeholder = 'Pick regions...'
    const { container } = render(
      <StandaloneMultiSelect
        name='t1'
        options={options}
        value={[]}
        onChange={() => {}}
        placeholder={placeholder}
        label='Regions'
      />
    )

    const input = container.querySelector(`input[id="t1"][role="combobox"]`) as HTMLInputElement | null
    expect(input).toBeTruthy()
    expect(input?.placeholder).toBe(placeholder)
  })

  it('TR-1.2: search string filters listbox options (debounced)', async () => {
    const { container } = render(
      <StandaloneMultiSelect name='t2' options={options} value={[]} onChange={() => {}} label='Regions' />
    )

    const input = container.querySelector('input[id="t2"][role="combobox"]') as HTMLInputElement | null
    expect(input).toBeTruthy()

    fireEvent.focus(input!)
    fireEvent.click(input!)
    fireEvent.change(input!, { target: { value: 'London' } })

    await waitFor(
      () => {
        const listbox = container.querySelector(`[id="t2-listbox"][role="listbox"]`)
        expect(listbox).toBeTruthy()
        const txt = listbox?.textContent || ''
        expect(txt).toMatch(/London/i)
        expect(/North West/i.test(txt)).toBe(false)
      },
      { timeout: 3000 }
    )
  })

  it('TR-1.3: removing selected chip via close button calls onChange with fewer items', () => {
    let received: MultiSelectOption[] | null = null
    const initial: MultiSelectOption[] = [options[0], options[1]]

    const { container, getAllByRole, rerender, getByText } = render(
      <StandaloneMultiSelect
        name='t3'
        options={options}
        value={initial}
        onChange={next => {
          received = next
        }}
        label='Regions'
      />
    )

    expect(getByText('North West')).toBeTruthy()
    expect(getByText('London')).toBeTruthy()

    const buttons = getAllByRole('button')
    const removeButtons = buttons.filter(b => {
      const aria = `${b.getAttribute('aria-label') || ''} ${b.title || ''}`
      const isDropdownToggle = /toggle|dropdown|expand/i.test(aria)
      if (isDropdownToggle) return false
      const text = (b.textContent || '').trim()
      const hasCloseIcon = text === '×' || text === '✕' || text === 'x'
      const hasCloseLabel = /remove|close chip|deselect|delete tag/i.test(aria)
      return hasCloseIcon || hasCloseLabel
    })
    expect(removeButtons.length).toBeGreaterThanOrEqual(1)

    fireEvent.click(removeButtons[0])
    expect(received).not.toBeNull()
    expect(Array.isArray(received)).toBe(true)
    expect((received as unknown as MultiSelectOption[]).length).toBe(1)

    rerender(
      <StandaloneMultiSelect
        name='t3'
        options={options}
        value={received as unknown as MultiSelectOption[]}
        onChange={() => {}}
        label='Regions'
      />
    )
    const input = container.querySelector(`input[id="t3"][role="combobox"]`)
    expect(input).toBeTruthy()
  })

  it('TR-1.4: renders error alert when error string provided', () => {
    const { getByText, getByRole } = render(
      <StandaloneMultiSelect
        name='t4'
        options={options}
        value={[]}
        onChange={() => {}}
        label='Regions'
        error='Pick at least one region.'
      />
    )

    expect(getByText('Pick at least one region.')).toBeTruthy()
    expect(getByRole('alert')).toBeTruthy()
  })

  it('TR-1.5: enableAddNewOption=false hides create-option UI when searching non-existent value', () => {
    const { container, queryAllByRole, queryByText } = render(
      <StandaloneMultiSelect
        name='t5'
        options={options}
        value={[]}
        onChange={() => {}}
        label='Regions'
        enableAddNewOption={false}
      />
    )

    const input = container.querySelector('input[id="t5"][role="combobox"]') as HTMLInputElement | null
    expect(input).toBeTruthy()

    fireEvent.focus(input!)
    fireEvent.click(input!)
    fireEvent.change(input!, { target: { value: 'an-unlisted-option-that-does-not-exist-xyz' } })

    const buttons = queryAllByRole('button')
    const anyCreate = buttons.find(b => /create new|add ".+"|new option|create option/i.test(b.textContent || ''))
    expect(anyCreate).toBeUndefined()
    expect(queryByText(/create new option|add new option/i)).toBeNull()
  })
})
