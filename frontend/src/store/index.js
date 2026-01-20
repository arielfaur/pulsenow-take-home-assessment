import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './dashboardSlice'
import assetsReducer from './assetsSlice'

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    assets: assetsReducer,
  },
})

export default store
