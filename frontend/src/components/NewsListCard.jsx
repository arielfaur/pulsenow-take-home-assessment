import LoadingPlaceholder from './LoadingPlaceholder'
import { formatTimestamp } from '../utils/formatters'

/**
 * News list card.
 * @param {object} props
 * @param {boolean} props.loading
 * @param {object[]} props.items
 */
const NewsListCard = ({ loading, items }) => (
  <div className="space-y-4">
    {loading && items.length === 0
      ? Array.from({ length: 5 }).map((_, index) => (
          <LoadingPlaceholder key={index} className="h-12 w-full" />
        ))
      : items.map((news) => (
          <div
            key={news.id}
            className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 dark:border-gray-800"
          >
            <div>
              <p className="font-semibold">{news.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {news.source} • {formatTimestamp(news.timestamp)}
              </p>
            </div>
            <span className="text-xs font-semibold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-300">
              {news.category}
            </span>
          </div>
        ))}
  </div>
)

export default NewsListCard
