import { screen } from '@testing-library/react'
import { act } from 'react';
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithStore } from '../testUtils.jsx'

vi.mock('../hooks/usePolling', () => ({
  default: () => {},
}))

describe('Assets', () => {
  it('renders assets and filters by search', async () => {
    const user = userEvent.setup()
    const { default: Assets } = await import('../pages/Assets')
    const preloadedState = {
      assets: {
        items: [
          {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            currentPrice: 180,
            changePercent: 2.5,
            volume: 1000,
            assetType: 'stock',
          },
          {
            symbol: 'BTC',
            name: 'Bitcoin',
            currentPrice: 43000,
            changePercent: -1.1,
            volume: 2000,
            assetType: 'crypto',
          },
        ],
        loading: false,
        error: null,
        lastUpdated: 1704100000000,
        filterType: 'all',
        searchQuery: '',
        sorting: [{ id: 'currentPrice', desc: true }],
      },
    }

    await act(async () => {
      renderWithStore(<Assets />, { preloadedState })
    })

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()

    await act(async () => {
      await user.type(screen.getByLabelText('Search'), 'AAPL')
    })

    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.queryByText('BTC')).not.toBeInTheDocument()
  })
})
