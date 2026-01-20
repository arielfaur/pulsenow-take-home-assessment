import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import dashboardReducer from './store/dashboardSlice'
import assetsReducer from './store/assetsSlice'

export const renderWithStore = (
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: { dashboard: dashboardReducer, assets: assetsReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
