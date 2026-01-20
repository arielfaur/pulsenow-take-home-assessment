import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getNews } from '../services/api'

/**
 * Fetch latest news.
 * @returns {Promise<object[]>}
 */
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().news
      const isInitialLoad = !state?.items?.length
      if (isInitialLoad) {
        // TODO: Remove this artificial delay once backend latency is realistic.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const response = await getNews()
      return response.data?.data ?? response.data ?? []
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load news')
    }
  }
)

/**
 * News slice state.
 */
const newsSlice = createSlice({
  name: 'news',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load news'
      })
  },
})

export default newsSlice.reducer
