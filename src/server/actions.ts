import { ApiError, apiRequest, type ApiEnvelope } from '@/lib/api/client'

type ApiSuccessResponse<T> = ApiEnvelope<T> & {
  success: true
}

type ApiErrorResponse = {
  success: false
  message: string
  errors?: Record<string, string[]>
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

function normalizeApiError(error: unknown, fallback: string): ApiErrorResponse {
  if (error instanceof ApiError) {
    return {
      success: false,
      message: error.message,
      errors: error.errors
    }
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : fallback
  }
}

async function makeRequest<T>(path: string, init: RequestInit, fallback: string): Promise<ApiResponse<T>> {
  try {
    return await apiRequest<T>(path, init)
  } catch (error) {
    return normalizeApiError(error, fallback)
  }
}

export async function get<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  return makeRequest<T>(path, init, 'The request could not be completed.')
}

export async function post<TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody,
  init: RequestInit = {}
): Promise<ApiResponse<TResponse>> {
  return makeRequest<TResponse>(
    path,
    {
      ...init,
      method: 'POST',
      body: body as BodyInit | null | undefined
    },
    'The request could not be completed.'
  )
}

export async function put<TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody,
  init: RequestInit = {}
): Promise<ApiResponse<TResponse>> {
  return makeRequest<TResponse>(
    path,
    {
      ...init,
      method: 'PUT',
      body: body as BodyInit | null | undefined
    },
    'The request could not be completed.'
  )
}

export async function patch<TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody,
  init: RequestInit = {}
): Promise<ApiResponse<TResponse>> {
  return makeRequest<TResponse>(
    path,
    {
      ...init,
      method: 'PATCH',
      body: body as BodyInit | null | undefined
    },
    'The request could not be completed.'
  )
}

export async function remove<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
  return makeRequest<T>(
    path,
    {
      ...init,
      method: 'DELETE'
    },
    'The request could not be completed.'
  )
}
