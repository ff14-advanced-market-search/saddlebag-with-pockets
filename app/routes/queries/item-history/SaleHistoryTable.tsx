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
import type { StackChance } from '~/requests/GetHistory'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
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

const SaleHistoryTable = ({ data }: { data: Array<StackChance> }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<StackChance>()
  const columns = [
    columnHelper.accessor('stack_size', {
      header: 'Bundle Size',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('average_price_for_size', {
      header: 'Avg Price per item',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('number_of_sales', {
      header: 'No# Sales',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('percent_of_sales', {
      header: '% of Sales',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('percent_of_total_quantity_sold', {
      header: '% of Total Sold',
      cell: (info) => info.getValue()
    })
  ]

  const table = useReactTable({
    data: data,
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
    table.setSorting([
      {
        id: 'percent_of_sales',
        desc: true
      }
    ])
  }, [table])

  return (
    <div
      className={`mt-0 flex flex-col my-6 bg-white p-4 sm:rounded-md shadow`}>
      <h2 className="text-xl font-semibold text-blue-900 py-2 ml-8">
        Region Wide Sale History
      </h2>
      <p className="italic text-sm text-grey-500 px-3">
        This table shows the sale history for the last 14 days in your region.
        Including which bundle size is most popular and what price it is selling
        for.
      </p>
      <div className="overflow-x-auto max-h-96 my-2">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full divide-y divide-gray-300 overflow-hidden">
              <thead className="bg-gray-50 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope={`col`}
                        onClick={header.column.getToggleSortingHandler()}
                        className={classNames(
                          header.column.getCanSort() ? 'cursor-pointer' : '',
                          `whitespace-nowrap px-3 py-3.5 text-center text-sm font-semibold text-gray-900`
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
                        className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-center">
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
              {`${data.length} results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaleHistoryTable
