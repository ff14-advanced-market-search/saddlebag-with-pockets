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
import type { DirtySale } from '~/requests/FFXIV/GetHistory'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { classNames } from '~/utils'
import DateCell from '~/components/FFXIVResults/FullScan/DateCell'

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

const SuspiciousSaleTable = ({ data }: { data: Array<DirtySale> }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<DirtySale>()
  const columns = [
    columnHelper.accessor('pricePerUnit', {
      header: 'Price per unit',
      cell: (info) => info.getValue().toLocaleString().toLocaleString()
    }),
    columnHelper.accessor('server', {
      header: 'World',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('hq', {
      header: 'Quality',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('onMannequin', {
      header: 'Retailer',
      cell: (info) => (info.getValue() ? 'Mannequin' : 'Retainer')
    }),
    columnHelper.accessor('buyerName', {
      header: 'Buyer Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('timestamp', {
      header: 'Time',
      cell: (info) => <DateCell date={info.getValue() * 1000} fixRight={true} />
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
        id: 'pricePerUnit',
        desc: true
      }
    ])
  }, [table])

  return (
    <div
      className={`mt-0 flex flex-col my-6 bg-white dark:bg-slate-700 p-4 sm:rounded-md`}
    >
      <div className='overflow-x-auto my-2'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-scroll max-h-96 shadow ring-1 ring-black ring-opacity-5'>
            <table className='min-w-full relative divide-y divide-gray-300 dark:bg-gray-600 dark:divide-gray-600'>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope={`col`}
                        onClick={header.column.getToggleSortingHandler()}
                        className={classNames(
                          header.column.getCanSort() ? 'cursor-pointer' : '',
                          `whitespace-nowrap sticky top-0 px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-gray-100 dark:bg-gray-600`
                        )}
                        key={header.id}
                      >
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
                            )}
                          >
                            {{
                              asc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}
                                >
                                  <ChevronUpIcon className={`h-4 w-4`} />
                                </span>
                              ),
                              desc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}
                                >
                                  <ChevronDownIcon className={`h-4 w-4`} />
                                </span>
                              )
                            }[header.column.getIsSorted() as string] ?? (
                              <span
                                className={`invisible flex-none rounded text-gray-400 group-hover:visible group-focus:visible`}
                              >
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
              <tbody className='divide-y divide-gray-200 bg-white dark:bg-slate-800'>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className='whitespace-nowrap px-2 py-2 text-sm text-gray-900 dark:text-gray-100 text-center'
                      >
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
            <p
              className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300`}
            >
              {`${data.length} results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuspiciousSaleTable
