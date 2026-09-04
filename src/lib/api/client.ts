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
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers
    }
  })

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
