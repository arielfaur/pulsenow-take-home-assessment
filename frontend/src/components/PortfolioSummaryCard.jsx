import LoadingPlaceholder from './LoadingPlaceholder'
import { formatCurrency, formatPercent } from '../utils/formatters'

/**
 * Portfolio summary card for total value and change.
 * @param {object} props
 * @param {boolean} props.loading
 * @param {object|null} props.data
 */
const PortfolioSummaryCard = ({ loading, data }) => {
  const changeColor = (value) =>
    Number(value) >= 0 ? 'text-green-600' : 'text-red-600'

  if (loading) {
    return (
      <div className="space-y-3">
        <LoadingPlaceholder className="h-8 w-32" />
        <LoadingPlaceholder className="h-6 w-40" />
        <LoadingPlaceholder className="h-6 w-24" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-3xl font-bold">{formatCurrency(data?.totalValue)}</p>
      <div className="flex items-baseline gap-2">
        <span className={`text-lg font-semibold ${changeColor(data?.totalChange)}`}>
          {formatCurrency(data?.totalChange)}
        </span>
        <span className={`text-sm ${changeColor(data?.totalChangePercent)}`}>
          {formatPercent(data?.totalChangePercent)}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">24h portfolio change</p>
    </div>
  )
}

export default PortfolioSummaryCard
