import { createAsyncThunk, createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import {
  createPublicBooking,
  getBookingAvailability,
  getBookingEventTypes,
  type BookingEventType,
  type BookingSlot
} from '@/lib/api/bookings'
import {
  getPublicTender,
  getPublicTenders,
  sendTenderLead,
  type PublicTender,
  type PublicTenderDetail,
  type TenderLeadKind
} from '@/lib/api/tenders'
import { showNotification } from '@/features/notifications/notificationsSlice'
import type { RootState } from '@/store'

import type { TenderBoardFilters, TenderBoardForm, TenderBoardPanelData, TenderBoardState } from './tenderBoard.types'

type TenderBoardThunkConfig = {
  state: RootState
  rejectValue: string
}

type SubmitTenderBoardLeadPayload = {
  sourceUrl: string
  recaptchaToken?: string | null
  recaptchaAction?: string
}

const defaultFilters: TenderBoardFilters = {
  keyword: '',
  category: '',
  region: ''
}

const emptyTenderBoardForm: TenderBoardForm = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  preferredContactMethod: 'email',
  preferredSlot: '',
  company: '',
  message: '',
  consent: false,
  website: ''
}

function buildInitialTenderBoardForm(title: string): TenderBoardForm {
  return {
    ...emptyTenderBoardForm,
    message: `I would like to discuss support for this tender: ${title}. Please contact me with the next steps.`
  }
}

const initialState: TenderBoardState = {
  filters: {
    draft: defaultFilters,
    applied: defaultFilters
  },
  items: [],
  loading: true,
  error: null,
  workspace: {
    selectedTender: null,
    leadKind: 'enquiry',
    formStartedAt: Math.floor(Date.now() / 1000),
    form: buildInitialTenderBoardForm(''),
    detailsLoading: false,
    detailsError: null,
    submitting: false,
    submitError: null,
    notice: null,
    eventTypes: [],
    selectedEventSlug: '',
    slots: [],
    selectedSlot: null,
    bookingOptionsLoading: false,
    bookingError: null,
    handoffUrl: null
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export const fetchTenderBoardTenders = createAsyncThunk<PublicTender[], TenderBoardFilters, TenderBoardThunkConfig>(
  'tenderBoard/fetchTenders',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getPublicTenders(filters)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'The tender list could not be loaded.'))
    }
  }
)

export const fetchTenderBoardTenderDetails = createAsyncThunk<PublicTenderDetail, string, TenderBoardThunkConfig>(
  'tenderBoard/fetchTenderDetails',
  async (tenderId, { rejectWithValue }) => {
    try {
      const response = await getPublicTender(tenderId)
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'The tender details could not be loaded.'))
    }
  }
)

export const fetchTenderBoardBookingEventTypes = createAsyncThunk<BookingEventType[], void, TenderBoardThunkConfig>(
  'tenderBoard/fetchBookingEventTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBookingEventTypes()
      return response.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Booking options could not be loaded.'))
    }
  }
)

export const fetchTenderBoardBookingAvailability = createAsyncThunk<
  BookingSlot[],
  { eventTypeSlug: string; timezone: string },
  TenderBoardThunkConfig
>('tenderBoard/fetchBookingAvailability', async (payload, { rejectWithValue }) => {
  try {
    const response = await getBookingAvailability(payload)
    return response.data.slots
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Availability could not be loaded.'))
  }
})

export const submitTenderBoardLead = createAsyncThunk<string, SubmitTenderBoardLeadPayload, TenderBoardThunkConfig>(
  'tenderBoard/submitLead',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    const workspace = getState().tenderBoard.workspace
    const selectedTender = workspace.selectedTender

    if (!selectedTender) {
      return rejectWithValue('Choose a tender before sending an enquiry.')
    }

    try {
      if (workspace.leadKind === 'booking') {
        if (!workspace.selectedSlot) {
          return rejectWithValue('Choose an available meeting slot.')
        }

        const response = await createPublicBooking({
          eventTypeSlug: workspace.selectedEventSlug,
          startAt: workspace.selectedSlot.startAt,
          endAt: workspace.selectedSlot.endAt,
          timezone: workspace.selectedSlot.timezone,
          customer: {
            name: workspace.form.name,
            email: workspace.form.email,
            phone: workspace.form.phone,
            companyName: workspace.form.company
          },
          intake: {
            serviceInterest: `Tender support: ${selectedTender.title}`,
            currentStage: selectedTender.sourceReference
              ? `Tender reference: ${selectedTender.sourceReference}`
              : 'Tender support booking',
            message: `${workspace.form.message}\n\nTender: ${selectedTender.title}`
          },
          consent: workspace.form.consent,
          formStartedAt: workspace.formStartedAt,
          sourceUrl: payload.sourceUrl,
          website: workspace.form.website,
          recaptchaToken: payload.recaptchaToken,
          recaptchaAction: payload.recaptchaAction
        })

        const notice = response.data.handoff?.url
          ? `Meeting booked. Your reference is ${response.data.bookingReference}. Continue to Orbit Mirai to track it.`
          : `Meeting booked. Your reference is ${response.data.bookingReference}.`

        dispatch(
          showNotification({
            type: 'success',
            title: 'Meeting booked',
            message: notice
          })
        )

        return notice
      }

      const response = await sendTenderLead(selectedTender.id, workspace.leadKind, {
        name: workspace.form.name,
        email: workspace.form.email,
        phone: workspace.form.phone,
        whatsapp: workspace.form.whatsapp,
        preferredContactMethod: workspace.form.preferredContactMethod,
        preferredSlot: workspace.form.preferredSlot,
        tenderPreferences: {
          categories: selectedTender.categories,
          regions: selectedTender.regions,
          channels: ['email', 'whatsapp'],
          notes: ''
        },
        company: workspace.form.company,
        message: workspace.form.message,
        consent: workspace.form.consent,
        formStartedAt: workspace.formStartedAt,
        sourceUrl: payload.sourceUrl,
        website: workspace.form.website,
        recaptchaToken: payload.recaptchaToken,
        recaptchaAction: payload.recaptchaAction
      })

      const notice = response.data.handoff?.url
        ? 'Tender enquiry sent. Continue to Orbit Mirai to track it.'
        : 'Tender enquiry sent.'

      dispatch(
        showNotification({
          type: 'success',
          title: 'Enquiry sent',
          message: notice
        })
      )

      return notice
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'The tender request could not be sent.'))
    }
  }
)

const tenderBoardSlice = createSlice({
  name: 'tenderBoard',
  initialState,
  reducers: {
    setTenderBoardKeyword: (state, action: PayloadAction<string>) => {
      state.filters.draft.keyword = action.payload
    },
    setTenderBoardCategory: (state, action: PayloadAction<string>) => {
      state.filters.draft.category = action.payload
    },
    setTenderBoardRegion: (state, action: PayloadAction<string>) => {
      state.filters.draft.region = action.payload
    },
    applyTenderBoardFilters: state => {
      state.filters.applied = { ...state.filters.draft }
    },
    initializeTenderBoardWorkspace: (state, action: PayloadAction<TenderBoardPanelData>) => {
      state.workspace.selectedTender = action.payload.tender
      state.workspace.leadKind = action.payload.initialLeadKind ?? 'enquiry'
      state.workspace.formStartedAt = Math.floor(Date.now() / 1000)
      state.workspace.form = buildInitialTenderBoardForm(action.payload.tender.title)
      state.workspace.detailsLoading = false
      state.workspace.detailsError = null
      state.workspace.submitting = false
      state.workspace.submitError = null
      state.workspace.notice = null
      state.workspace.handoffUrl = null
      state.workspace.selectedEventSlug = ''
      state.workspace.slots = []
      state.workspace.selectedSlot = null
      state.workspace.bookingError = null
      state.workspace.handoffUrl = null
    },
    setTenderBoardLeadKind: (state, action: PayloadAction<TenderLeadKind>) => {
      state.workspace.leadKind = action.payload
      state.workspace.notice = null
      state.workspace.submitError = null
      state.workspace.bookingError = null
      state.workspace.handoffUrl = null
    },
    updateTenderBoardFormValue: (
      state,
      action: PayloadAction<{ field: keyof TenderBoardForm; value: TenderBoardForm[keyof TenderBoardForm] }>
    ) => {
      state.workspace.form[action.payload.field] = action.payload.value as never
    },
    setTenderBoardSelectedEventSlug: (state, action: PayloadAction<string>) => {
      state.workspace.selectedEventSlug = action.payload
      state.workspace.selectedSlot = null
      state.workspace.slots = []
      state.workspace.notice = null
      state.workspace.handoffUrl = null
      state.workspace.bookingError = null
      state.workspace.submitError = null
    },
    setTenderBoardSelectedSlot: (state, action: PayloadAction<BookingSlot | null>) => {
      state.workspace.selectedSlot = action.payload
      state.workspace.notice = null
      state.workspace.handoffUrl = null
      state.workspace.submitError = null
    },
    clearTenderBoardFeedback: state => {
      state.workspace.notice = null
      state.workspace.submitError = null
      state.workspace.bookingError = null
      state.workspace.detailsError = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTenderBoardTenders.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenderBoardTenders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTenderBoardTenders.rejected, (state, action) => {
        state.loading = false
        state.items = []
        state.error = action.payload ?? 'The tender list could not be loaded.'
      })
      .addCase(fetchTenderBoardTenderDetails.pending, state => {
        state.workspace.detailsLoading = true
        state.workspace.detailsError = null
      })
      .addCase(fetchTenderBoardTenderDetails.fulfilled, (state, action) => {
        state.workspace.detailsLoading = false
        state.workspace.selectedTender = action.payload
      })
      .addCase(fetchTenderBoardTenderDetails.rejected, (state, action) => {
        state.workspace.detailsLoading = false
        state.workspace.detailsError = action.payload ?? 'The tender details could not be loaded.'
      })
      .addCase(fetchTenderBoardBookingEventTypes.pending, state => {
        state.workspace.bookingOptionsLoading = true
        state.workspace.bookingError = null
      })
      .addCase(fetchTenderBoardBookingEventTypes.fulfilled, (state, action) => {
        state.workspace.bookingOptionsLoading = false
        state.workspace.eventTypes = action.payload
        state.workspace.selectedEventSlug =
          action.payload.find(eventType => eventType.slug === 'general-care-atlas-consultation')?.slug ??
          action.payload[0]?.slug ??
          ''
      })
      .addCase(fetchTenderBoardBookingEventTypes.rejected, (state, action) => {
        state.workspace.bookingOptionsLoading = false
        state.workspace.bookingError = action.payload ?? 'Booking options could not be loaded.'
      })
      .addCase(fetchTenderBoardBookingAvailability.pending, state => {
        state.workspace.bookingOptionsLoading = true
        state.workspace.bookingError = null
        state.workspace.selectedSlot = null
        state.workspace.slots = []
      })
      .addCase(fetchTenderBoardBookingAvailability.fulfilled, (state, action) => {
        state.workspace.bookingOptionsLoading = false
        state.workspace.slots = action.payload
      })
      .addCase(fetchTenderBoardBookingAvailability.rejected, (state, action) => {
        state.workspace.bookingOptionsLoading = false
        state.workspace.bookingError = action.payload ?? 'Availability could not be loaded.'
        state.workspace.slots = []
      })
      .addCase(submitTenderBoardLead.pending, state => {
        state.workspace.submitting = true
        state.workspace.submitError = null
        state.workspace.notice = null
      })
      .addCase(submitTenderBoardLead.fulfilled, (state, action) => {
        const selectedTender = state.workspace.selectedTender

        state.workspace.submitting = false
        state.workspace.notice = action.payload
        state.workspace.handoffUrl = null
        state.workspace.formStartedAt = Math.floor(Date.now() / 1000)
        state.workspace.form = buildInitialTenderBoardForm(selectedTender?.title ?? '')
        state.workspace.selectedSlot = null
      })
      .addCase(submitTenderBoardLead.rejected, (state, action) => {
        state.workspace.submitting = false
        state.workspace.submitError = action.payload ?? 'The tender request could not be sent.'
      })
  }
})

export const {
  setTenderBoardKeyword,
  setTenderBoardCategory,
  setTenderBoardRegion,
  applyTenderBoardFilters,
  initializeTenderBoardWorkspace,
  setTenderBoardLeadKind,
  updateTenderBoardFormValue,
  setTenderBoardSelectedEventSlug,
  setTenderBoardSelectedSlot,
  clearTenderBoardFeedback
} = tenderBoardSlice.actions

export default tenderBoardSlice.reducer

export const selectTenderBoardState = (state: RootState) => state.tenderBoard
export const selectTenderBoardDraftFilters = (state: RootState) => state.tenderBoard.filters.draft
export const selectTenderBoardAppliedFilters = (state: RootState) => state.tenderBoard.filters.applied
export const selectTenderBoardItems = (state: RootState) => state.tenderBoard.items
export const selectTenderBoardLoading = (state: RootState) => state.tenderBoard.loading
export const selectTenderBoardError = (state: RootState) => state.tenderBoard.error
export const selectTenderBoardWorkspace = (state: RootState) => state.tenderBoard.workspace
export const selectTenderBoardSelectedTender = (state: RootState) => state.tenderBoard.workspace.selectedTender
export const selectTenderBoardLeadKind = (state: RootState) => state.tenderBoard.workspace.leadKind
export const selectTenderBoardForm = (state: RootState) => state.tenderBoard.workspace.form
export const selectTenderBoardDetailsLoading = (state: RootState) => state.tenderBoard.workspace.detailsLoading
export const selectTenderBoardSubmitting = (state: RootState) => state.tenderBoard.workspace.submitting
export const selectTenderBoardNotice = (state: RootState) => state.tenderBoard.workspace.notice
export const selectTenderBoardEventTypes = (state: RootState) => state.tenderBoard.workspace.eventTypes
export const selectTenderBoardSelectedEventSlug = (state: RootState) => state.tenderBoard.workspace.selectedEventSlug
export const selectTenderBoardSlots = (state: RootState) => state.tenderBoard.workspace.slots
export const selectTenderBoardSelectedSlot = (state: RootState) => state.tenderBoard.workspace.selectedSlot
export const selectTenderBoardBookingOptionsLoading = (state: RootState) =>
  state.tenderBoard.workspace.bookingOptionsLoading
export const selectTenderBoardWorkspaceError = createSelector([selectTenderBoardWorkspace], workspace => {
  return workspace.submitError ?? workspace.bookingError ?? workspace.detailsError
})
export const selectTenderBoardCategories = createSelector([selectTenderBoardItems], items =>
  Array.from(new Set(items.flatMap(tender => tender.categories))).sort()
)
export const selectTenderBoardRegions = createSelector([selectTenderBoardItems], items =>
  Array.from(new Set(items.flatMap(tender => tender.regions))).sort()
)
export const selectTenderBoardSelectedEventType = createSelector(
  [selectTenderBoardEventTypes, selectTenderBoardSelectedEventSlug],
  (eventTypes, selectedEventSlug) => eventTypes.find(eventType => eventType.slug === selectedEventSlug)
)
