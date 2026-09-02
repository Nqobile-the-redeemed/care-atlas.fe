import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ApiError } from '@/lib/api/client'
import { type EnquiryReceipt, type EnquirySubmission, sendEnquiry } from '@/lib/api/enquiries'
import type { RootState } from '@/store'

type SubmissionStatus = 'idle' | 'submitting' | 'succeeded' | 'failed'

type SubmissionState = {
  status: SubmissionStatus
  error?: string
  receipt?: EnquiryReceipt
}

type EnquiriesState = {
  submissions: Record<string, SubmissionState>
}

const initialState: EnquiriesState = {
  submissions: {}
}

export const submitEnquiry = createAsyncThunk<EnquiryReceipt, EnquirySubmission, { rejectValue: string }>(
  'enquiries/submit',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await sendEnquiry(payload)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        const validationMessage = Object.values(error.errors).flat()[0]
        return rejectWithValue(validationMessage ?? error.message)
      }

      return rejectWithValue(error instanceof Error ? error.message : 'Your enquiry could not be sent.')
    }
  }
)

const enquiriesSlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(submitEnquiry.pending, (state, action) => {
        state.submissions[action.meta.arg.enquiryType] = {
          status: 'submitting'
        }
      })
      .addCase(submitEnquiry.fulfilled, (state, action) => {
        state.submissions[action.meta.arg.enquiryType] = {
          status: 'succeeded',
          receipt: action.payload
        }
      })
      .addCase(submitEnquiry.rejected, (state, action) => {
        state.submissions[action.meta.arg.enquiryType] = {
          status: 'failed',
          error: action.payload ?? 'Your enquiry could not be sent.'
        }
      })
  }
})

export const selectEnquiriesState = (state: RootState) => state.enquiries
export const selectEnquirySubmission = (enquiryType: string) => (state: RootState) =>
  state.enquiries.submissions[enquiryType]

export default enquiriesSlice.reducer
