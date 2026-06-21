import { apiRequest } from './client'

export type ManagedWebsiteImage = {
  id: string
  pageSlug: string
  slotKey: string
  unsplashId: string
  url: string
  urls: {
    raw?: string
    full?: string
    regular?: string
    small?: string
    thumb?: string
  }
  width?: number
  height?: number
  color?: string
  alt?: string
  description?: string
  photographerName?: string
  photographerUsername?: string
  photographerUrl?: string
  unsplashUrl?: string
  source: 'unsplash'
}

export async function getPageImages(pageSlug: string) {
  return apiRequest<{ page: string; images: Record<string, ManagedWebsiteImage> }>(
    `/v1/images/page/${encodeURIComponent(pageSlug)}`
  )
}

export async function getImageSlot(slotKey: string) {
  return apiRequest<ManagedWebsiteImage>(`/v1/images/slot/${encodeURIComponent(slotKey)}`)
}
