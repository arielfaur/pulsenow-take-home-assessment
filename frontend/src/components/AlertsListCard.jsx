import LoadingPlaceholder from './LoadingPlaceholder'
import { formatTimestamp } from '../utils/formatters'

/**
 * Alerts list card.
 * @param {object} props
 * @param {boolean} props.loading
 * @param {object[]} props.items
 */
const AlertsListCard = ({ loading, items }) => (
  <div className="space-y-4">
    {loading && items.length === 0
      ? Array.from({ length: 5 }).map((_, index) => (
          <LoadingPlaceholder key={index} className="h-12 w-full" />
        ))
      : items.map((alert) => {
          const severityColor = {
            critical: 'bg-red-100 text-red-700',
            high: 'bg-orange-100 text-orange-700',
            medium: 'bg-yellow-100 text-yellow-700',
            low: 'bg-green-100 text-green-700',
          }[alert.severity] || 'bg-gray-100 text-gray-600'

          return (
            <div
              key={alert.id}
              className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 dark:border-gray-800"
            >
              <div>
                <p className="font-semibold">{alert.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTimestamp(alert.timestamp)}
                </p>
              </div>
              <span
                className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${severityColor}`}
              >
                {alert.severity}
              </span>
            </div>
          )
        })}
  </div>
)

export default AlertsListCard
