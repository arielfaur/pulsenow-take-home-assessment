import { useEffect } from 'react'

/**
 * Run a polling callback on an interval with optional dependency control.
 * @param {Function} callback
 * @param {number} intervalMs
 * @param {Array} deps
 * @param {boolean} enabled
 */
const usePolling = (callback, intervalMs, deps = [], enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined
    callback()
    const intervalId = setInterval(callback, intervalMs)
    return () => clearInterval(intervalId)
  }, [enabled, intervalMs, ...deps])
}

export default usePolling
