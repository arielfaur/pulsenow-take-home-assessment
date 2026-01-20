import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithStore } from '../testUtils.jsx'

vi.mock('../hooks/usePolling', () => ({
  default: () => {},
}))

describe('Dashboard', () => {
  it('renders portfolio summary and dashboard sections', async () => {
    const { default: Dashboard } = await import('../pages/Dashboard')
    const preloadedState = {
      dashboard: {
        data: {
          topGainers: [
            {
              symbol: 'AAPL',
              name: 'Apple Inc.',
              currentPrice: 180,
              changePercent: 2.5,
            },
          ],
          topLosers: [
            {
              symbol: 'TSLA',
              name: 'Tesla Inc.',
              currentPrice: 240,
              changePercent: -1.2,
            },
          ],
          recentNews: [
            {
              id: 'news-1',
              title: 'Market rallies',
              source: 'Pulse Wire',
              timestamp: '2024-01-01T10:00:00.000Z',
              category: 'macro',
            },
          ],
          activeAlerts: [
            {
              id: 'alert-1',
              message: 'Price spike detected',
              severity: 'high',
              timestamp: '2024-01-01T09:00:00.000Z',
            },
          ],
        },
        portfolio: {
          totalValue: 1000,
          totalChange: 50,
          totalChangePercent: 5,
        },
        loading: false,
        error: null,
        lastUpdated: 1704100000000,
      },
    }

    renderWithStore(<Dashboard />, { preloadedState })

    expect(screen.getByText('Portfolio Summary')).toBeInTheDocument()
    expect(screen.getByText('$1,000.00')).toBeInTheDocument()
    expect(screen.getByText('AAPL')).toBeInTheDocument()
    expect(screen.getByText('TSLA')).toBeInTheDocument()
    expect(screen.getByText('Market rallies')).toBeInTheDocument()
    expect(screen.getByText('Price spike detected')).toBeInTheDocument()
  })
})
