import { configureStore } from '@reduxjs/toolkit'
import enquiriesReducer from './features/enquiries/enquiriesSlice'
import imagesReducer from './features/images/imagesSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      enquiries: enquiriesReducer,
      images: imagesReducer
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
