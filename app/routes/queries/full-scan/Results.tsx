import type {
  FilterFn,
  SortingFn,
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
  getSortedRowModel,
  sortingFns
} from '@tanstack/table-core'
import { useEffect, useState } from 'react'
import { flexRender, useReactTable } from '@tanstack/react-table'
import type { ResponseType } from '~/requests/FullScan'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import {
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/solid'
import { classNames } from '~/utils'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import FinalFantasyBadgedLink from '~/components/utilities/FinalFantasyBagdedLink'

type ResultTableProps = {
  rows: Array<ResponseType>
}

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

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const Results = ({ rows }: ResultTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<ResponseType & { id: number }>()
  const columns = [
    columnHelper.accessor('avg_ppu', {
      header: 'Average Price Per Unit',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('home_server_price', {
      header: 'Home Server Price',
      cell: (info) => (!info.getValue() ? 'No Listing' : info.getValue())
    }),
    columnHelper.accessor('home_update_time', {
      header: 'Home Server Info Last Updated At',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('ppu', {
      header: 'Lowest Price Per Unit',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('profit_amount', {
      header: 'Profit Amount',
      cell: (info) => (info.getValue() === 99999999999 ? '∞' : info.getValue())
    }),
    columnHelper.accessor('profit_raw_percent', {
      header: 'Profit Percentage',
      cell: (info) => (info.getValue() === 99999999999 ? '∞' : info.getValue())
    }),
    columnHelper.accessor('real_name', {
      header: 'Item Name',
      cell: ({ getValue }) => (
        <span className={`font-bold select-all`}>{getValue()}</span>
      ),
      footer: (props) => props.column.id
    }),
    columnHelper.accessor('sale_rates', {
      header: 'Sale Rates',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('server', {
      header: 'Lowest Price Server',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('stack_size', {
      header: 'Lowest Price Stack Size',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('update_time', {
      header: 'Lowest Price Last Update Time',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('ROI', {
      header: 'Return on Investment',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('url', {
      header: 'Universalis Link',
      cell: (info) => <UniversalisBadgedLink link={info.getValue()} />
    }),
    columnHelper.accessor('npc_vendor_info', {
      header: 'NPC Vendor Info',
      cell: (info) => {
        const value = info.getValue()
        if (!value) return null
        return <FinalFantasyBadgedLink link={value} />
      }
    }),
    columnHelper.accessor('id', {
      header: 'Item Data',
      cell: (info) => (
        <ItemDataLink link={'/queries/item-data/' + info.getValue()} />
      )
    })
  ]

  const table = useReactTable({
    // @ts-ignore
    data: rows,
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
      'real_name',
      'id',
      'url',
      'npc_vendor_info',
      'server',
      'home_server_price',
      'ppu',
      'profit_amount',
      'sale_rates',
      'avg_ppu',
      'ROI',
      'profit_raw_percent',
      'stack_size',
      'update_time',
      'home_update_time'
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
                    scroll horizontally (left & right). Click a column name to
                    sort by that column.
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
                          `px-3 py-3.5 text-left text-sm font-semibold text-gray-900`
                        )}
                        key={header.id}>
                        <div className={`group inline-flex  min-w-[100px]`}>
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
              {`${rows.length} results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
