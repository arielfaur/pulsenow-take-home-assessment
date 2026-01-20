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

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }
  return new Intl.NumberFormat('en-US').format(Number(value))
}

export const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }
  return `${Number(value).toFixed(2)}%`
}

export const formatTimestamp = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString()
}
