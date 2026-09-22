import { afterEach, describe, expect, it, vi } from 'vitest'

describe('Care Atlas public form API contracts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('sends enquiry security metadata and reCAPTCHA evidence', async () => {
    vi.stubEnv('NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE', 'careatlas.co.uk')

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true, message: 'received', data: { id: 'query-1' } })
    })
    vi.stubGlobal('fetch', fetchMock)

    const { sendEnquiry } = await import('./enquiries')
    await sendEnquiry({
      name: 'Example Client',
      email: 'client@example.test',
      subject: 'Contact Care Atlas',
      enquiryType: 'contact',
      comment: 'Please contact me about Care Atlas support.',
      details: { Region: 'London' },
      consent: true,
      formStartedAt: 123456,
      sourceUrl: 'https://careatlas.co.uk/contact',
      website: '',
      attachments: [],
      recaptchaToken: 'recaptcha-token',
      recaptchaAction: 'care_atlas_contact'
    })

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = request.body as FormData

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/v1/web-queries')
    expect(Object.fromEntries(body.entries())).toMatchObject({
      consent: '1',
      form_started_at: '123456',
      source_url: 'https://careatlas.co.uk/contact',
      web_source: 'careatlas.co.uk',
      recaptcha_token: 'recaptcha-token',
      recaptcha_action: 'care_atlas_contact'
    })
  })

  it('creates a public booking without sending an employee identifier', async () => {
    vi.stubEnv('NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_CARE_ATLAS_WEB_SOURCE', 'careatlas.co.uk')

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ success: true, message: 'booked', data: { id: 'booking-1' } })
    })
    vi.stubGlobal('fetch', fetchMock)

    const { createPublicBooking } = await import('./bookings')
    await createPublicBooking({
      eventTypeSlug: 'general-care-atlas-consultation',
      startAt: '2026-09-25T09:00:00.000Z',
      endAt: '2026-09-25T09:30:00.000Z',
      timezone: 'Europe/London',
      customer: {
        name: 'Example Client',
        email: 'client@example.test'
      },
      intake: {
        message: 'I would like to discuss my care business.',
        regions: ['London'],
        counties: ['Greater London']
      },
      consent: true,
      formStartedAt: 123456,
      sourceUrl: 'https://careatlas.co.uk/contact',
      website: '',
      recaptchaToken: 'recaptcha-token',
      recaptchaAction: 'care_atlas_booking'
    })

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(request.body)) as Record<string, unknown>

    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8000/v1/public/bookings')
    expect(body).toMatchObject({
      consent: true,
      web_source: 'careatlas.co.uk',
      recaptcha_token: 'recaptcha-token',
      recaptcha_action: 'care_atlas_booking'
    })
    expect(body).not.toHaveProperty('consultant_user_id')
    expect(body).not.toHaveProperty('consultantUserId')
  })
})
