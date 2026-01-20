import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard, fetchPortfolio } from '../store/dashboardSlice'
import usePolling from '../hooks/usePolling'
import SectionCard from '../components/SectionCard'
import PortfolioSummaryCard from '../components/PortfolioSummaryCard'
import TopMoversCard from '../components/TopMoversCard'
import NewsListCard from '../components/NewsListCard'
import AlertsListCard from '../components/AlertsListCard'

/**
 * Dashboard page with portfolio, movers, news, and alerts.
 * @returns {JSX.Element}
 */
const Dashboard = () => {
  const dispatch = useDispatch()
  const { dashboard, portfolio } = useSelector((state) => state.dashboard)

  const pollDashboard = useCallback(() => {
    dispatch(fetchDashboard())
    dispatch(fetchPortfolio())
  }, [dispatch])

  usePolling(pollDashboard, 30000, [pollDashboard])

  const portfolioSummary = portfolio?.data || dashboard?.data?.portfolio
  const topGainers = dashboard?.data?.topGainers?.slice(0, 3) || []
  const topLosers = dashboard?.data?.topLosers?.slice(0, 3) || []
  const recentNews = dashboard?.data?.recentNews?.slice(0, 5) || []
  const activeAlerts = dashboard?.data?.activeAlerts?.slice(0, 5) || []
  const lastUpdated =
    dashboard?.lastUpdated || portfolio?.lastUpdated || null
  const error = dashboard?.error || portfolio?.error
  const isDashboardLoading = dashboard?.loading && !dashboard?.data
  const isPortfolioLoading = portfolio?.loading && !portfolio?.data

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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Portfolio Summary" className="lg:col-span-1">
          <PortfolioSummaryCard loading={isPortfolioLoading} data={portfolioSummary} />
        </SectionCard>

        <SectionCard title="Top Movers" className="lg:col-span-2">
          <TopMoversCard
            loading={isDashboardLoading}
            gainers={topGainers}
            losers={topLosers}
          />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recent News">
          <NewsListCard loading={isDashboardLoading} items={recentNews} />
        </SectionCard>

        <SectionCard title="Active Alerts">
          <AlertsListCard loading={isDashboardLoading} items={activeAlerts} />
        </SectionCard>
      </div>
    </div>
  )
}

export default Dashboard
