export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface AppNotification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
}

export interface NotificationsState {
  current: AppNotification | null
  history: AppNotification[]
}
