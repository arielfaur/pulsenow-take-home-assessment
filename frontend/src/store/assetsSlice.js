import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCrypto, getStocks } from '../services/api'

/**
 * Normalize asset data with a consistent type marker.
 * @param {object} asset
 * @param {'stock'|'crypto'} type
 * @returns {object}
 */
const normalizeAsset = (asset, type) => ({
  ...asset,
  assetType: type,
})

/**
 * Fetch stocks and crypto assets and return a unified list.
 * @returns {Promise<object[]>}
 */
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState().assets
      const isInitialLoad = !state?.items?.length
      if (isInitialLoad) {
        // TODO: Remove this artificial delay once backend latency is realistic.
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      const [stocksResponse, cryptoResponse] = await Promise.all([
        getStocks(),
        getCrypto(),
      ])
      const stocks = stocksResponse.data?.data ?? stocksResponse.data ?? []
      const crypto = cryptoResponse.data?.data ?? cryptoResponse.data ?? []
      return [
        ...stocks.map((asset) => normalizeAsset(asset, 'stock')),
        ...crypto.map((asset) => normalizeAsset(asset, 'crypto')),
      ]
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load assets')
    }
  }
)

/**
 * Assets slice state for unified assets table.
 */
const assetsSlice = createSlice({
  name: 'assets',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
    filterType: 'all',
    searchQuery: '',
    sorting: [{ id: 'currentPrice', desc: true }],
  },
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSorting: (state, action) => {
      state.sorting = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to load assets'
      })
  },
})

export const { setFilterType, setSearchQuery, setSorting } = assetsSlice.actions

export default assetsSlice.reducer
