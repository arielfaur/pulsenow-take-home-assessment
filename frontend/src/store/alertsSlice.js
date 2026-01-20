import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getAlerts } from '../services/api'

/**
 * Fetch latest alerts.
 * @returns {Promise<object[]>}
 */
export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().alerts
      const isInitialLoad = !state?.items?.length
      if (isInitialLoad) {
        // TODO: Remove this artificial delay once backend latency is realistic.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const response = await getAlerts()
      return response.data?.data ?? response.data ?? []
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load alerts')
    }
  }
)

/**
 * Alerts slice state.
 */
const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load alerts'
      })
  },
})

export default alertsSlice.reducer
