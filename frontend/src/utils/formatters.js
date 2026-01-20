/**
 * Format a number as USD currency.
 * @param {number|string} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value))
}

/**
 * Format a number with locale separators.
 * @param {number|string} value
 * @returns {string}
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }
  return new Intl.NumberFormat('en-US').format(Number(value))
}

/**
 * Format a number as a percentage with two decimals.
 * @param {number|string} value
 * @returns {string}
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }
  return `${Number(value).toFixed(2)}%`
}

/**
 * Format a timestamp string into a localized date-time.
 * @param {string|number|Date} value
 * @returns {string}
 */
export const formatTimestamp = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString()
}
