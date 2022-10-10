import type {
  FilterFn,
  ColumnFiltersState,
  ColumnOrderState
} from '@tanstack/table-core'
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/table-core'
import { useEffect, useState } from 'react'
import { flexRender, useReactTable } from '@tanstack/react-table'
import type { Listing, ListingResponseType } from '~/requests/GetListing'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/solid'
import { classNames } from '~/utils'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }

  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })
  return itemRank.passed
}

const Results = ({ data }: { data: ListingResponseType }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<Listing>()
  const columns = [
    columnHelper.accessor('hq', {
      header: 'Headquaters',
      cell: (info) => info.getValue().toString()
    }),
    columnHelper.accessor('lastReviewTime', {
      header: 'Last Review Time',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('pricePerUnit', {
      header: 'Price Per Unit',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('retainerName', {
      header: 'Retainer Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('unix_timestamp', {
      header: 'Timestamp:',
      cell: (info) => info.getValue()
    })
  ]

  const table = useReactTable({
    data: data.listings,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter,
      columnOrder
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'profit_amount') {
      if (table.getState().sorting[0]?.id !== 'profit_amount') {
        table.setSorting([
          {
            id: 'profit_amount',
            desc: true
          }
        ])
      }
    }
  }, [table])

  useEffect(() => {
    setColumnOrder([
      'id',
      'listing_price_diff.avg_price_diff',
      'min_price',
      'listing_time_diff.avg_time_diff'
    ])
  }, [])

  return (
    <div className={`mt-0 flex flex-col`}>
      <div className="py-2 sm:py-5">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-blue-600 p-2 shadow-lg sm:p-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex w-0 flex-1 items-center">
                <span className="flex rounded-lg bg-blue-800 p-2">
                  <ChevronDoubleRightIcon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </span>
                <p className="ml-3 truncate font-medium text-white">
                  <span className="md:hidden">This is a wide table!</span>
                  <span className="hidden md:inline">
                    Heads up, this table is pretty wide. You'll probably need to
                    scroll horizontally (left & right).
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope={`col`}
                        onClick={header.column.getToggleSortingHandler()}
                        className={classNames(
                          header.column.getCanSort() ? 'cursor-pointer' : '',
                          `whitespace-nowrap px-3 py-3.5 text-left text-sm font-semibold text-gray-900`
                        )}
                        key={header.id}>
                        <div className={`group inline-flex`}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          <div
                            className={classNames(
                              header.column.getIsSorted()
                                ? 'bg-gray-200 rounded bg-gray-200'
                                : '',
                              ` ml-1 flex-none p-1`
                            )}>
                            {{
                              asc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300`}>
                                  <ChevronUpIcon className={`h-4 w-4`} />
                                </span>
                              ),
                              desc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300`}>
                                  <ChevronDownIcon className={`h-4 w-4`} />
                                </span>
                              )
                            }[header.column.getIsSorted() as string] ?? (
                              <span
                                className={`invisible flex-none rounded text-gray-400 group-hover:visible group-focus:visible`}>
                                <ChevronDownIcon className={`h-4 w-4`} />
                              </span>
                            )}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500`}>
              {`${data.listings.length} results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
