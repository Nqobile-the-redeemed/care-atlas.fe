import { configureStore } from '@reduxjs/toolkit'
import enquiriesReducer from '@/features/enquiries/enquiriesSlice'
import imagesReducer from '@/features/images/imagesSlice'
import notificationsReducer from '@/features/notifications/notificationsSlice'
import tenderBoardReducer from '@/features/tenders/tenderBoardSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      enquiries: enquiriesReducer,
      images: imagesReducer,
      notifications: notificationsReducer,
      tenderBoard: tenderBoardReducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActionPaths: ['meta.arg.attachments']
        }
      })
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
