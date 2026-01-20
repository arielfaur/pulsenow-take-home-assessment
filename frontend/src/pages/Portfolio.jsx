import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { fetchPortfolio } from '../store/dashboardSlice'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import SectionCard from '../components/SectionCard'
import PortfolioSummaryCard from '../components/PortfolioSummaryCard'
import { formatCurrency, formatPercent } from '../utils/formatters'

/**
 * Portfolio page with summary, chart, and holdings list.
 * @returns {JSX.Element}
 */
const Portfolio = () => {
  const dispatch = useDispatch()
  const { portfolio } = useSelector((state) => state.dashboard)
  const data = portfolio?.data
  const loading = portfolio?.loading
  const error = portfolio?.error

  useEffect(() => {
    dispatch(fetchPortfolio())
  }, [dispatch])

  const chartData = useMemo(() => {
    if (!data?.totalValue) return []
    const points = 7
    const changePercent = Number(data.totalChangePercent || 0) / 100
    const startValue = data.totalValue / (1 + changePercent || 1)
    const step = (data.totalValue - startValue) / (points - 1 || 1)
    return Array.from({ length: points }, (_, index) => ({
      label: `Day ${index + 1}`,
      value: Number((startValue + step * index).toFixed(2)),
    }))
  }, [data])

  const changeColor = (value) =>
    Number(value) >= 0 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Portfolio</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Portfolio Summary" className="lg:col-span-1">
          <PortfolioSummaryCard loading={loading} data={data} />
        </SectionCard>

        <SectionCard title="Portfolio Value" className="lg:col-span-2">
          {loading ? (
            <LoadingPlaceholder className="h-64 w-full" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.2} />
                  <XAxis dataKey="label" stroke="#9ca3af" />
                  <YAxis
                    stroke="#9ca3af"
                    tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelStyle={{ color: '#111827' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Holdings">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingPlaceholder key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {(data?.assets || []).map((asset) => (
              <div key={asset.assetId} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">{asset.assetId}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {asset.quantity} units
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(asset.value)}</p>
                  <p className={`text-sm ${changeColor(asset.changePercent)}`}>
                    {formatPercent(asset.changePercent)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default Portfolio
