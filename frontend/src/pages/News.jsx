import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNews } from '../store/newsSlice'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { formatTimestamp } from '../utils/formatters'

/**
 * News page with latest market headlines.
 * @returns {JSX.Element}
 */
const News = () => {
  const dispatch = useDispatch()
  const { items, loading, error, lastUpdated } = useSelector(
    (state) => state.news
  )

  useEffect(() => {
    dispatch(fetchNews())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">News</h1>
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
            {items.map((news) => (
              <div key={news.id} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold">{news.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {news.source} • {formatTimestamp(news.timestamp)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {news.summary}
                  </p>
                </div>
                <span className="text-xs font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-300">
                  {news.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No news available.
          </div>
        )}
      </div>
    </div>
  )
}

export default News
