import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getDashboard, getPortfolio } from '../services/api'

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboard()
      return response.data?.data ?? null
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load dashboard data')
    }
  }
)

export const fetchPortfolio = createAsyncThunk(
  'dashboard/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPortfolio()
      return response.data?.data ?? null
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load portfolio data')
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    portfolio: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load dashboard data'
      })
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.portfolio = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load portfolio data'
      })
  },
})

export default dashboardSlice.reducer
