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
import type { Listing, ListingResponseType } from '~/requests/FFXIV/GetListing'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { classNames } from '~/utils'
import DateCell from '../FullScan/DateCell'
import CSVButton from '~/components/utilities/CSVButton'

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

/**
 * Renders a table displaying listing information for FFXIV items.
 * @example
 * ListingTable({ data: sampleData })
 * <table>...</table>
 * @param {Object} data - The data object containing listings to be displayed.
 * @param {ListingResponseType} data.listings - An array of listing data.
 * @returns {JSX.Element} A table element showcasing item listings.
 * @description
 *   - Uses custom hooks and a state management system to handle column filters and global filters.
 *   - Provides functionalities like sorting, filtering, and CSV export within the table.
 *   - Displays tooltip icons for sortable columns which indicate sort direction.
 *   - Utilizes FlexRender for dynamic rendering of headers and cells.
 */
const ListingTable = ({ data }: { data: ListingResponseType }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<Listing>()
  const columns = [
    columnHelper.accessor('pricePerUnit', {
      header: 'Price Per Unit',
      cell: (info) => info.getValue().toLocaleString()
    }),
    columnHelper.accessor('hq', {
      header: 'Quality',
      cell: (info) => (info.getValue() ? 'High' : null)
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => info.getValue().toLocaleString()
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => info.getValue().toLocaleString()
    }),
    columnHelper.accessor('retainerName', {
      header: 'Retainer Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('unix_timestamp', {
      header: 'Last Review Time',
      cell: (info) => <DateCell date={info.getValue() * 1000} fixRight={true} />
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
    table.setSorting([
      {
        id: 'pricePerUnit',
        desc: false
      }
    ])
  }, [table])

  return (
    <div className={`mt-0 flex flex-col`}>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-scroll max-h-96 shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y relative divide-gray-300">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope={`col`}
                        onClick={header.column.getToggleSortingHandler()}
                        className={classNames(
                          header.column.getCanSort() ? 'cursor-pointer' : '',
                          `whitespace-nowrap px-3 sticky top-0 bg-gray-50 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 dark:bg-gray-600 z-50`
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
                                ? 'bg-gray-200 rounded bg-gray-200 dark:bg-gray-500'
                                : '',
                              ` ml-1 flex-none p-1`
                            )}>
                            {{
                              asc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}>
                                  <ChevronUpIcon className={`h-4 w-4`} />
                                </span>
                              ),
                              desc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}>
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
              <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">
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
          <div className="flex justify-between">
            <p
              className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300`}>
              {`${data.listings.length} results found`}
            </p>
            <div className="my-2 mr-1">
              <CSVButton
                data={data.listings}
                filename="saddlebag-item-listings.csv"
                columns={[
                  { value: 'retainerName', title: 'Retainer' },
                  { value: 'total', title: 'Total' },
                  {
                    value: 'quantity',
                    title: 'Quantity'
                  },
                  { value: 'pricePerUnit', title: 'Price per unit' },
                  {
                    value: 'hq',
                    title: 'Is High Quality'
                  },
                  { value: 'lastReviewTime', title: 'Last Reviewed' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingTable
