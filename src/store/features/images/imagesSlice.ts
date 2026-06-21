import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '@/lib/api/client'
import { getPageImages, type ManagedWebsiteImage } from '@/lib/api/images'

type ImagesState = {
  pages: Record<string, Record<string, ManagedWebsiteImage>>
  loadingPages: Record<string, boolean>
  errors: Record<string, string | undefined>
}

const initialState: ImagesState = {
  pages: {},
  loadingPages: {},
  errors: {}
}

export const fetchPageImages = createAsyncThunk<
  { page: string; images: Record<string, ManagedWebsiteImage> },
  string,
  { rejectValue: string }
>('images/fetchPage', async (pageSlug, { rejectWithValue }) => {
  try {
    const response = await getPageImages(pageSlug)
    return response.data
  } catch (error) {
    return rejectWithValue(error instanceof ApiError ? error.message : 'Website images could not be loaded.')
  }
})

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPageImages.pending, (state, action) => {
        state.loadingPages[action.meta.arg] = true
        state.errors[action.meta.arg] = undefined
      })
      .addCase(fetchPageImages.fulfilled, (state, action) => {
        state.loadingPages[action.payload.page] = false
        state.pages[action.payload.page] = action.payload.images
      })
      .addCase(fetchPageImages.rejected, (state, action) => {
        state.loadingPages[action.meta.arg] = false
        state.errors[action.meta.arg] = action.payload ?? 'Website images could not be loaded.'
      })
  }
})

export default imagesSlice.reducer
