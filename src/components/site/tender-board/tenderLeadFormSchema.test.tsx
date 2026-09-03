import { describe, it, expect } from 'vitest'

import { TenderBoardFormYup, emptyTenderBoardFormValues } from './tenderLeadFormSchema'
import { emptyTenderBoardForm } from './constants'
import type { TenderBoardForm } from './types'

function buildValidForm(): TenderBoardForm {
  return {
    ...structuredClone(emptyTenderBoardFormValues),
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '020 7946 0000',
    line1: '10 Downing Street',
    city: 'London',
    postcode: 'SW1A 2AA',
    message: 'I would like to discuss this tender opportunity in detail please.',
    consent: true
  }
}

describe('TenderBoardFormYup schema', () => {
  it('TR-SV-1: emptyTenderBoardFormValues equals emptyTenderBoardForm baseline contract', () => {
    expect(emptyTenderBoardFormValues).toEqual(emptyTenderBoardForm)
  })

  it('TR-SV-2: valid form passes validation with empty optional fields', async () => {
    const valid = buildValidForm()
    const result = await TenderBoardFormYup.validate(valid, { abortEarly: false })
    expect(result).toMatchObject(valid)
  })

  it('TR-SV-3: missing required fields produces matching error messages', async () => {
    const invalid: TenderBoardForm = structuredClone(emptyTenderBoardFormValues)
    const err = await TenderBoardFormYup.validate(invalid, { abortEarly: false })
      .then(() => null)
      .catch(caught => caught)
    expect(err).not.toBeNull()
    const errors: string[] = err?.inner?.map((e: { message: string }) => e.message) ?? [err?.message]
    expect(errors.some(m => /full name is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /email is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /phone number is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /address line 1 is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /city is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /postcode is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /message is required/i.test(String(m)))).toBe(true)
    expect(errors.some(m => /consent/i.test(String(m)))).toBe(true)
  })

  it('TR-SV-4: password min length + passwordConfirmation match enforced together', async () => {
    const base = buildValidForm()
    base.password = 'short'
    base.passwordConfirmation = 'different'
    const e1 = await TenderBoardFormYup.validate(base, { abortEarly: false })
      .then(() => null)
      .catch(c => c)
    expect(e1).not.toBeNull()
    const e1Errors: string[] = e1?.inner?.map((m: { message: string }) => m.message) ?? []
    expect(e1Errors.some((m: string) => /8 characters/i.test(m))).toBe(true)
    expect(e1Errors.some((m: string) => /passwords must match|confirm your password/i.test(m))).toBe(true)

    const correct = buildValidForm()
    correct.password = 'goodpassword'
    correct.passwordConfirmation = 'goodpassword'
    const r = await TenderBoardFormYup.validate(correct, { abortEarly: false })
    expect(r.password).toBe('goodpassword')
    expect(r.passwordConfirmation).toBe('goodpassword')
  })

  it('TR-SV-5: invalid email + short message are rejected', async () => {
    const bad = buildValidForm()
    bad.email = 'not-an-email'
    bad.message = 'too short'
    const err = await TenderBoardFormYup.validate(bad, { abortEarly: false })
      .then(() => null)
      .catch(c => c)
    expect(err).not.toBeNull()
    const errors: string[] = err?.inner?.map((e: { message: string }) => e.message) ?? []
    expect(errors.some((m: string) => /valid email/i.test(m))).toBe(true)
    expect(errors.some((m: string) => /10 characters/i.test(m))).toBe(true)
  })
})
