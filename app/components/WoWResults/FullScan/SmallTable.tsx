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
import {
  flexRender,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { classNames } from '~/utils'
import { Title } from '~/components/Common'
import MobileTable from './MobileTable'
import type { ColumnList } from '~/components/types'
import PaginationControls from '~/components/Tables/PaginationControls'

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
type DataType = Record<string, string | number | boolean | null | undefined>

function DesktopTable({
  data,
  sortingOrder,
  columnList,
  title,
  description
}: {
  data: Array<DataType>
  sortingOrder: Array<{ id: string; desc: boolean }>
  columnList: Array<ColumnList<any>>
  title: string
  description: string
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder] = useState<ColumnOrderState>([])

  const columnHelper = createColumnHelper<DataType>()

  const parseToLocaleString = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value).toLocaleString()
    }

    return value
  }

  const columns = columnList.map((col) => {
    // @ts-ignore
    return columnHelper.accessor(col.columnId, {
      header: col.header,
      cell: (props) =>
        col.accessor
          ? col.accessor({
              row: props.row.original,
              getValue: () => parseToLocaleString(props.getValue())
            })
          : parseToLocaleString(props.getValue())
    })
  })

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
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  })

  useEffect(() => {
    // @ts-ignore
    table.setSorting(sortingOrder)
  }, [table, sortingOrder])

  return (
    <div
      className={`hidden mt-0 sm:flex flex-col my-6 bg-white dark:bg-slate-700 p-4 sm:rounded-md shadow`}>
      <div className="mx-3">
        <Title title={title} />
      </div>
      <div className="mx-3">
        <p className="italic text-sm text-grey-500 dark:text-gray-300">
          {description}
        </p>
      </div>
      <div className="py-1 flex justify-between">
        <PaginationControls table={table} />
      </div>
      <div className="overflow-x-auto my-2">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-scroll max-h-96 shadow ring-1 ring-black ring-opacity-5">
            <table className="min-w-full relative divide-y divide-gray-300">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope={`col`}
                        onClick={header.column.getToggleSortingHandler()}
                        className={classNames(
                          header.column.getCanSort() ? 'cursor-pointer' : '',
                          `px-3 py-3.5 sticky bg-gray-50 top-0 text-sm font-semibold text-gray-900 dark:text-gray-100 dark:bg-gray-600 text-center`
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
                                ? 'bg-gray-200 rounded dark:bg-gray-500'
                                : '',
                              ` ml-1 flex flex-0 p-1 justify-center items-center`
                            )}>
                            {{
                              asc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}>
                                  <ChevronUpIcon className={`h-4 w-4`} />
                                </span>
                              ),
                              desc: (
                                <span
                                  className={`text-gray-900 group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-500 dark:text-gray-300 dark:group-hover:text-gray-100`}>
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
              <tbody className="divide-y divide-gray-200 bg-white dark:bg-slate-800 dark:divide-gray-500">
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
          <div>
            <p
              className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300`}>
              {`${data.length} results found`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const SmallTable = ({
  data,
  sortingOrder,
  columnList,
  title,
  description,
  mobileColumnList,
  columnSelectOptions
}: {
  data: Array<DataType>
  sortingOrder: Array<{ id: string; desc: boolean }>
  columnList: Array<ColumnList<any>>
  mobileColumnList: Array<ColumnList<any>>
  title: string
  description: string
  columnSelectOptions: Array<string>
}) => {
  return (
    <>
      <MobileTable
        data={data}
        sortingOrder={sortingOrder}
        columnList={mobileColumnList}
        title={title}
        description={description}
        rowLabels={columnList}
        columnSelectOptions={columnSelectOptions}
      />

      <DesktopTable
        data={data}
        sortingOrder={sortingOrder}
        columnList={columnList}
        title={title}
        description={description}
      />
    </>
  )
}

export default SmallTable
