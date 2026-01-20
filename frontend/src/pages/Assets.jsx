import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import usePolling from '../hooks/usePolling'
import {
  fetchAssets,
  setFilterType,
  setSearchQuery,
  setSorting,
} from '../store/assetsSlice'
import LoadingPlaceholder from '../components/LoadingPlaceholder'
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters'

/**
 * Table skeleton row placeholder.
 * @returns {JSX.Element}
 */
const SkeletonRow = () => (
  <div className="grid grid-cols-6 gap-4 border-b border-gray-100 py-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <LoadingPlaceholder key={index} className="h-4 w-full" />
    ))}
  </div>
)

/**
 * Assets page with filtering, search, and sortable table.
 * @returns {JSX.Element}
 */
const Assets = () => {
  const dispatch = useDispatch()
  const { items, loading, error, lastUpdated, filterType, searchQuery, sorting } =
    useSelector((state) => state.assets)

  const pollAssets = useCallback(() => {
    dispatch(fetchAssets())
  }, [dispatch])

  usePolling(pollAssets, 30000, [pollAssets])

  const filteredItems = useMemo(() => {
    if (filterType === 'all') return items
    return items.filter((asset) => asset.assetType === filterType)
  }, [items, filterType])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'symbol',
        header: 'Symbol',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'currentPrice',
        header: 'Price',
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: 'changePercent',
        header: 'Change',
        cell: (info) => {
          const value = info.getValue()
          const color = Number(value) >= 0 ? 'text-green-600' : 'text-red-600'
          return <span className={color}>{formatPercent(value)}</span>
        },
      },
      {
        accessorKey: 'volume',
        header: 'Volume',
        cell: (info) => formatNumber(info.getValue()),
      },
      {
        accessorKey: 'assetType',
        header: 'Type',
        cell: (info) => (
          <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {info.getValue()}
          </span>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredItems,
    columns,
    state: {
      sorting,
      globalFilter: searchQuery,
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      dispatch(setSorting(nextSorting))
    },
    onGlobalFilterChange: (value) => dispatch(setSearchQuery(value)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue || '').toLowerCase()
      if (!search) return true
      const symbol = String(row.original.symbol || '').toLowerCase()
      const name = String(row.original.name || '').toLowerCase()
      return symbol.includes(search) || name.includes(search)
    },
  })

  /**
   * Render sort direction indicator for a column.
   * @param {import('@tanstack/react-table').Column} column
   * @returns {string|null}
   */
  const sortIndicator = (column) => {
    if (!column.getIsSorted()) return null
    return column.getIsSorted() === 'desc' ? '↓' : '↑'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Assets</h1>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="asset-type-filter" className="text-sm font-semibold text-gray-600">
              Asset Type
            </label>
            <select
              id="asset-type-filter"
              value={filterType}
              onChange={(event) => dispatch(setFilterType(event.target.value))}
              className="mt-1 block rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pulse-primary"
            >
              <option value="all">All</option>
              <option value="stock">Stocks</option>
              <option value="crypto">Crypto</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="asset-search" className="text-sm font-semibold text-gray-600">
              Search
            </label>
            <input
              id="asset-search"
              type="text"
              value={searchQuery}
              onChange={(event) => dispatch(setSearchQuery(event.target.value))}
              placeholder="Search by symbol or name"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pulse-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-6 gap-4 border-b border-gray-200 pb-2 text-sm font-semibold text-gray-600">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <button
                    key={header.id}
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center gap-2 text-left"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="text-xs text-gray-400">
                      {sortIndicator(header.column)}
                    </span>
                  </button>
                ))
              )}
            </div>

            {loading && items.length === 0 ? (
              <div className="space-y-2 pt-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id} className="grid grid-cols-6 gap-4 py-3 text-sm">
                    {row.getVisibleCells().map((cell) => (
                      <div key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!loading && table.getRowModel().rows.length === 0 && (
              <div className="py-6 text-center text-sm text-gray-500">
                No assets match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assets
