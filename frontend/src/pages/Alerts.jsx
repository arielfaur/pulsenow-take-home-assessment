import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAlerts } from '../store/alertsSlice'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { formatTimestamp } from '../utils/formatters'

/**
 * Alerts page with severity grouping.
 * @returns {JSX.Element}
 */
const Alerts = () => {
  const dispatch = useDispatch()
  const { items, loading, error, lastUpdated } = useSelector(
    (state) => state.alerts
  )

  useEffect(() => {
    dispatch(fetchAlerts())
  }, [dispatch])

  const severityMeta = {
    critical: { label: 'Critical', color: 'bg-red-100 text-red-700', icon: '🚨' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700', icon: '⚠️' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
    low: { label: 'Low', color: 'bg-green-100 text-green-700', icon: '✅' },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Alerts</h1>
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

      <div className="bg-white p-6 rounded-lg shadow space-y-4 dark:bg-gray-950 dark:shadow-none dark:border dark:border-gray-800">
        {loading && items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingPlaceholder key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((alert) => {
              const meta = severityMeta[alert.severity] || {
                label: alert.severity || 'Alert',
                color: 'bg-gray-100 text-gray-600',
                icon: '🔔',
              }
              return (
                <div key={alert.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{meta.icon}</span>
                    <div>
                      <p className="font-semibold">{alert.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold uppercase px-2 py-1 rounded-full ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No alerts available.
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts
