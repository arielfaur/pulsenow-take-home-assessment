import LoadingPlaceholder from './LoadingPlaceholder'
import { formatCurrency, formatPercent } from '../utils/formatters'

/**
 * Top gainers/losers card.
 * @param {object} props
 * @param {boolean} props.loading
 * @param {object[]} props.gainers
 * @param {object[]} props.losers
 */
const TopMoversCard = ({ loading, gainers, losers }) => {
  const changeColor = (value) =>
    Number(value) >= 0 ? 'text-green-600' : 'text-red-600'

  const renderRow = (asset, keyPrefix) => (
    <div
      key={`${keyPrefix}-${asset.symbol}`}
      className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-800"
    >
      <div>
        <p className="font-semibold">{asset.symbol}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{formatCurrency(asset.currentPrice)}</p>
        <p className={`text-sm ${changeColor(asset.changePercent)}`}>
          {formatPercent(asset.changePercent)}
        </p>
      </div>
    </div>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase mb-3 dark:text-gray-400">
          Gainers
        </p>
        <div className="space-y-3">
          {loading && gainers.length === 0
            ? Array.from({ length: 3 }).map((_, index) => (
                <LoadingPlaceholder key={index} className="h-8 w-full" />
              ))
            : gainers.map((asset) => renderRow(asset, 'gainer'))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase mb-3 dark:text-gray-400">
          Losers
        </p>
        <div className="space-y-3">
          {loading && losers.length === 0
            ? Array.from({ length: 3 }).map((_, index) => (
                <LoadingPlaceholder key={index} className="h-12 w-full" />
              ))
            : losers.map((asset) => renderRow(asset, 'loser'))}
        </div>
      </div>
    </div>
  )
}

export default TopMoversCard
