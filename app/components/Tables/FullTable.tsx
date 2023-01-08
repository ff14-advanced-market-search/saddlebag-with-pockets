import type {
  FilterFn,
  ColumnFiltersState,
  ColumnOrderState,
  Getter
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

export type ColumnList<Type> = {
  columnId: string
  header: string
  accessor?: (props: {
    row: Type
    getValue: Getter<unknown>
  }) => JSX.Element | null
}

function FullTable<Type>({
  data,
  sortingOrder,
  columnList,
  order
}: {
  data: Array<Type>
  sortingOrder: Array<{ id: keyof Type; desc: boolean }>
  columnList: Array<ColumnList<Type>>
  description: string
  order?: Array<string>
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnOrder] = useState<ColumnOrderState>(order || [])

  const columnHelper = createColumnHelper<Type>()

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
    debugHeaders: true,
    debugColumns: false
  })

  useEffect(() => {
    // @ts-ignore
    table.setSorting(sortingOrder)
  }, [table, sortingOrder])

  useEffect(() => {
    if (document !== undefined && window !== undefined) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  return (
    <div className="mt-2 max-w-full max-h-[calc(100vh_-_64px)] overflow-scroll">
      <table className="divide-y divide-gray-300 relative">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  scope={`col`}
                  onClick={header.column.getToggleSortingHandler()}
                  className={classNames(
                    header.column.getCanSort() ? 'cursor-pointer' : '',
                    `px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50 sticky top-0`
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
                        ` ml-1 flex flex-0 p-1 justify-center items-center`
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FullTable
