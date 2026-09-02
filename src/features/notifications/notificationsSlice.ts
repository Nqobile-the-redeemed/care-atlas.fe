import { createSlice } from '@reduxjs/toolkit'

import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

import type { AppNotification, NotificationsState } from './notifications.types'

const initialState: NotificationsState = {
  current: null,
  history: []
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<AppNotification, 'id'> & { id?: string }>) => {
      const notification: AppNotification = {
        id: action.payload.id || `notif-${Date.now()}`,
        ...action.payload
      }

      state.current = notification
      state.history.unshift(notification)

      if (state.history.length > 50) {
        state.history.pop()
      }
    },
    hideNotification: state => {
      state.current = null
    },
    clearNotificationHistory: state => {
      state.history = []
    }
  }
})

export const { showNotification, hideNotification, clearNotificationHistory } = notificationsSlice.actions

export const selectCurrentNotification = (state: RootState) => state.notifications.current
export const selectNotificationHistory = (state: RootState) => state.notifications.history

export default notificationsSlice.reducer
