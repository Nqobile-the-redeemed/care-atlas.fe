import { describe, expect, it } from 'vitest'
import { TenderBoardFormYup, emptyTenderBoardFormValues } from './tenderLeadFormSchema'
const form = {
  ...emptyTenderBoardFormValues,
  name: 'Example Client',
  email: 'client@example.test',
  phone: '07700900123',
  message: 'Please help with this tender.',
  consent: true
}
describe('guest WhatsApp opt-in', () => {
  it('is optional and off by default', async () => {
    expect(emptyTenderBoardFormValues.whatsappTenderAlerts).toBe(false)
    await expect(TenderBoardFormYup.validate(form)).resolves.toBeDefined()
  })
  it('requires a phone with international country code when selected', async () => {
    await expect(TenderBoardFormYup.validate({ ...form, whatsappTenderAlerts: true })).rejects.toThrow('country code')
    await expect(
      TenderBoardFormYup.validate({ ...form, whatsappTenderAlerts: true, phone: '+447700900123' })
    ).resolves.toBeDefined()
    await expect(TenderBoardFormYup.validate({ ...form, whatsappTenderAlerts: true, phone: '' })).rejects.toThrow()
  })
})
