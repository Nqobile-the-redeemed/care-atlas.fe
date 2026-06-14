export type CheckoutSessionRequest = {
  productSlug: string
  quantity: number
  successUrl: string
  cancelUrl: string
  customer?: {
    name?: string
    email?: string
    phone?: string
    organisation?: string
  }
}

export type CheckoutSessionResponse = {
  checkoutUrl: string
  sessionId?: string
}

export type QuoteRequestPayload = {
  productSlug: string
  serviceSlug: string
  name: string
  email: string
  phone?: string
  organisation?: string
  message: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL?.replace(/\/$/, '') ?? ''

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'The checkout request could not be completed.'
}

export async function createCheckoutSession(payload: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  const response = await fetch(buildApiUrl('/api/checkout/create-session'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    let message = 'The checkout endpoint returned an error.'

    try {
      const body = (await response.json()) as { error?: string; message?: string }
      message = body.error ?? body.message ?? message
    } catch {
      // The backend contract allows JSON errors, but this fallback keeps the UI usable during setup.
    }

    throw new Error(message)
  }

  const data = (await response.json()) as Partial<CheckoutSessionResponse> & { url?: string }
  const checkoutUrl = data.checkoutUrl ?? data.url

  if (!checkoutUrl) {
    throw new Error('The checkout endpoint did not return a checkoutUrl.')
  }

  return {
    checkoutUrl,
    sessionId: data.sessionId
  }
}

export async function submitQuoteRequest(payload: QuoteRequestPayload) {
  try {
    const response = await fetch(buildApiUrl('/api/quotes'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      return {
        ok: false,
        message: 'The quote request endpoint returned an error.'
      }
    }

    return {
      ok: true,
      message: 'Quote request sent.'
    }
  } catch (error) {
    return {
      ok: false,
      message: getErrorMessage(error)
    }
  }
}

export function getCheckoutUrls(origin: string, productSlug: string) {
  return {
    successUrl: `${origin}/checkout/success?product=${productSlug}&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/checkout/cancelled?product=${productSlug}`
  }
}
