import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDashboard, getPortfolio } from '../services/api'

/**
 * Fetch dashboard summary data with an initial artificial delay.
 * @returns {Promise<object|null>}
 */
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().dashboard
      const isInitialLoad = !state?.dashboard?.data && !state?.portfolio?.data
      if (isInitialLoad) {
        // TODO: Remove this artificial delay once backend latency is realistic.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const response = await getDashboard()
      return response.data?.data ?? null
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load dashboard data')
    }
  }
)

/**
 * Fetch portfolio summary data.
 * @returns {Promise<object|null>}
 */
export const fetchPortfolio = createAsyncThunk(
  'dashboard/fetchPortfolio',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().dashboard
      const isInitialLoad = !state?.portfolio?.data
      if (isInitialLoad) {
        // TODO: Remove this artificial delay once backend latency is realistic.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const response = await getPortfolio()
      return response.data?.data ?? null
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load portfolio data')
    }
  }
)

/**
 * Dashboard slice state for dashboard + portfolio panels.
 */
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    dashboard: {
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    },
    portfolio: {
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.loading = true
        state.dashboard.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false
        state.dashboard.data = action.payload
        state.dashboard.lastUpdated = Date.now()
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.loading = false
        state.dashboard.error = action.payload || 'Failed to load dashboard data'
      })
      .addCase(fetchPortfolio.pending, (state) => {
        state.portfolio.loading = true
        state.portfolio.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolio.loading = false
        state.portfolio.data = action.payload
        state.portfolio.lastUpdated = Date.now()
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.portfolio.loading = false
        state.portfolio.error = action.payload || 'Failed to load portfolio data'
      })
  },
})

export default dashboardSlice.reducer
