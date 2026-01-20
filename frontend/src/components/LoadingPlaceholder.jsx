/**
 * Render a skeleton block or spinner for loading placeholders.
 * @param {object} props
 * @param {'skeleton'|'spinner'} [props.variant]
 * @param {string} [props.className]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.label]
 */
const LoadingPlaceholder = ({
  variant = 'skeleton',
  className = '',
  size = 'md',
  label = 'Loading',
}) => {
  if (variant === 'spinner') {
    const spinnerSize = {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-[3px]',
    }[size]

    return (
      <div
        role="status"
        aria-label={label}
        className={`inline-block animate-spin rounded-full border-gray-300 border-t-pulse-primary ${spinnerSize} ${className}`}
      />
    )
  }

  return (
    <div
      aria-label={label}
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  )
}

export default LoadingPlaceholder
