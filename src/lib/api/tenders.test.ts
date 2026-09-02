import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getPublicTenders', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('targets the public tender endpoint on the configured API origin', async () => {
    vi.stubEnv('NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL', 'http://localhost:8000')

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      json: async () => ({
        success: true,
        message: 'ok',
        data: []
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const { getPublicTenders } = await import('./tenders')

    await getPublicTenders({ keyword: 'care', category: 'services', region: 'London' })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8000/v1/public/tenders?keyword=care&category=services&region=London',
      expect.objectContaining({
        cache: 'no-store',
        headers: expect.objectContaining({
          Accept: 'application/json'
        })
      })
    )
  })
})
