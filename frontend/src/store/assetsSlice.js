import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCrypto, getStocks } from '../services/api'

const normalizeAsset = (asset, type) => ({
  ...asset,
  assetType: type,
})

export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { rejectWithValue }) => {
    try {
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
