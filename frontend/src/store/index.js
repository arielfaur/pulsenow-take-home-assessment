import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './dashboardSlice'
import assetsReducer from './assetsSlice'
import newsReducer from './newsSlice'
import alertsReducer from './alertsSlice'

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    assets: assetsReducer,
    news: newsReducer,
    alerts: alertsReducer,
  },
})

export default store
