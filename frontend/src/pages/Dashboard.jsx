import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard, fetchPortfolio } from '../store/dashboardSlice'
import usePolling from '../hooks/usePolling'
import {
  formatCurrency,
  formatPercent,
  formatTimestamp,
} from '../utils/formatters'

const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const { data, portfolio, loading, error, lastUpdated } = useSelector(
    (state) => state.dashboard
  )

  const pollDashboard = useCallback(() => {
    dispatch(fetchDashboard())
    dispatch(fetchPortfolio())
  }, [dispatch])

  usePolling(pollDashboard, 30000, [pollDashboard])

  const portfolioSummary = portfolio || data?.portfolio
  const topGainers = data?.topGainers?.slice(0, 3) || []
  const topLosers = data?.topLosers?.slice(0, 3) || []
  const recentNews = data?.recentNews?.slice(0, 5) || []
  const activeAlerts = data?.activeAlerts?.slice(0, 5) || []

  const changeColor = (value) =>
    Number(value) >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
          {!portfolioSummary && loading ? (
            <div className="space-y-3">
              <SkeletonBlock className="h-8 w-32" />
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-6 w-24" />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {formatCurrency(portfolioSummary?.totalValue)}
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-lg font-semibold ${changeColor(
                    portfolioSummary?.totalChange
                  )}`}
                >
                  {formatCurrency(portfolioSummary?.totalChange)}
                </span>
                <span
                  className={`text-sm ${changeColor(
                    portfolioSummary?.totalChangePercent
                  )}`}
                >
                  {formatPercent(portfolioSummary?.totalChangePercent)}
                </span>
              </div>
              <p className="text-sm text-gray-500">24h portfolio change</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Movers</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Gainers
              </p>
              <div className="space-y-3">
                {loading && topGainers.length === 0
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonBlock key={index} className="h-12 w-full" />
                    ))
                  : topGainers.map((asset) => (
                      <div
                        key={`gainer-${asset.symbol}`}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{asset.symbol}</p>
                          <p className="text-sm text-gray-500">{asset.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(asset.currentPrice)}
                          </p>
                          <p className={`text-sm ${changeColor(asset.changePercent)}`}>
                            {formatPercent(asset.changePercent)}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Losers
              </p>
              <div className="space-y-3">
                {loading && topLosers.length === 0
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonBlock key={index} className="h-12 w-full" />
                    ))
                  : topLosers.map((asset) => (
                      <div
                        key={`loser-${asset.symbol}`}
                        className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{asset.symbol}</p>
                          <p className="text-sm text-gray-500">{asset.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(asset.currentPrice)}
                          </p>
                          <p className={`text-sm ${changeColor(asset.changePercent)}`}>
                            {formatPercent(asset.changePercent)}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent News</h2>
          <div className="space-y-4">
            {loading && recentNews.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-12 w-full" />
                ))
              : recentNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold">{news.title}</p>
                      <p className="text-sm text-gray-500">
                        {news.source} • {formatTimestamp(news.timestamp)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {news.category}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-4">
            {loading && activeAlerts.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-12 w-full" />
                ))
              : activeAlerts.map((alert) => {
                  const severityColor = {
                    critical: 'bg-red-100 text-red-700',
                    high: 'bg-orange-100 text-orange-700',
                    medium: 'bg-yellow-100 text-yellow-700',
                    low: 'bg-green-100 text-green-700',
                  }[alert.severity] || 'bg-gray-100 text-gray-600'
                  return (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold">{alert.message}</p>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${severityColor}`}>
                        {alert.severity}
                      </span>
                    </div>
                  )
                })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
