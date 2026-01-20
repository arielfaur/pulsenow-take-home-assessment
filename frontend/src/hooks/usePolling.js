import { useEffect } from 'react'

const usePolling = (callback, intervalMs, deps = [], enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined
    callback()
    const intervalId = setInterval(callback, intervalMs)
    return () => clearInterval(intervalId)
  }, [enabled, intervalMs, ...deps])
}

export default usePolling
