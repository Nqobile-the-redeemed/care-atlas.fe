export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> = {}
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL?.replace(/\/$/, '') ?? ''

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const url = buildApiUrl(path)
  // #region debug-point A:request-url
  fetch('http://127.0.0.1:7777/event', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: 'public-tenders-404',
      runId: 'pre-fix',
      hypothesisId: 'A',
      location: 'src/lib/api/client.ts:26',
      msg: '[DEBUG] apiRequest built URL',
      data: {
        apiBaseUrl: API_BASE_URL,
        path,
        url
      },
      ts: Date.now()
    })
  }).catch(() => {})
  // #endregion
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers
    }
  })
  // #region debug-point B:response-shape
  fetch('http://127.0.0.1:7777/event', {
    method: 'POST',
    body: JSON.stringify({
      sessionId: 'public-tenders-404',
      runId: 'pre-fix',
      hypothesisId: 'B',
      location: 'src/lib/api/client.ts:45',
      msg: '[DEBUG] apiRequest received response',
      data: {
        url,
        status: response.status,
        ok: response.ok,
        contentType: response.headers.get('content-type'),
        poweredBy: response.headers.get('x-powered-by')
      },
      ts: Date.now()
    })
  }).catch(() => {})
  // #endregion

  let body: Partial<ApiEnvelope<T>> = {}

  try {
    body = (await response.json()) as Partial<ApiEnvelope<T>>
  } catch {
    // Preserve the status-based fallback below when an upstream proxy returns HTML.
  }

  if (!response.ok || body.success === false) {
    throw new ApiError(body.message ?? 'The request could not be completed.', response.status, body.errors)
  }

  return {
    success: body.success ?? true,
    message: body.message ?? 'Success',
    data: body.data as T,
    errors: body.errors
  }
}
