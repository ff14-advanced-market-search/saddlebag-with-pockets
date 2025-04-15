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
  dataAccessor?: (originalRow: Type) => string | number | null | undefined
  accessor?: (props: {
    row: Type
    getValue: Getter<unknown>
  }) => JSX.Element | null
  sortUndefined?: false | 'first' | 'last' | undefined
}

/**
 * Displays a sortable and filterable table with customizable columns and global search.
 *
 * @example
 * <FullTable
 *   data={[{ name: "Alice", age: 30 }]}
 *   sortingOrder={[{ id: "name", desc: false }]}
 *   columnList={[{ columnId: "name", header: "Name" }]}
 *   order={["name", "age"]}
 *   globalFilter="a"
 *   setGlobalFilter={setFilter}
 * />
 *
 * @param data - The array of data objects to display in the table.
 * @param sortingOrder - Initial sorting configuration for columns.
 * @param columnList - List of column definitions, including headers, accessors, and sorting options.
 * @param order - Optional array specifying the order of columns.
 * @param globalFilter - Optional global filter string applied to all columns.
 * @param setGlobalFilter - Optional state setter for updating the global filter.
 * @returns The rendered table component with sorting and filtering capabilities.
 *
 * @remark
 * Values that are `null` or `undefined` are displayed as "N/A". Numeric values are formatted using locale strings.
 */
function FullTable<Type>({
  data,
  sortingOrder,
  columnList,
  order,
  globalFilter,
  setGlobalFilter
}: {
  data: Array<Type>
  sortingOrder: Array<{ id: keyof Type; desc: boolean }>
  columnList: Array<ColumnList<Type>>
  description?: string
  order?: Array<string>
  globalFilter?: string
  setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnOrder] = useState<ColumnOrderState>(order || [])

  const columnHelper = createColumnHelper<Type>()

  const parseToLocaleString = (value: any) => {
    if (value === undefined || value === null) {
      return 'N/A'
    }
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    if (typeof value === 'string' && !isNaN(Number.parseFloat(value))) {
      return Number.parseFloat(value).toLocaleString()
    }
    return String(value)
  }

  const columns = columnList.map((col) => {
    const columnDef = col.dataAccessor
      ? columnHelper.accessor(col.dataAccessor, {
          id: col.columnId,
          header: col.header,
          cell: (props) =>
            col.accessor
              ? col.accessor({
                  row: props.row.original,
                  getValue: props.getValue
                })
              : parseToLocaleString(props.getValue()),
          enableSorting: true,
          // @ts-ignore - Type definition expects 1/-1, but implementation/docs use 'last'/'first'
          sortUndefined: col.sortUndefined ?? undefined
        })
      : columnHelper.accessor(col.columnId as any, {
          header: col.header,
          cell: (props) =>
            col.accessor
              ? col.accessor({
                  row: props.row.original,
                  getValue: props.getValue
                })
              : parseToLocaleString(props.getValue()),
          enableSorting: true,
          // @ts-ignore - Type definition expects 1/-1, but implementation/docs use 'last'/'first'
          sortUndefined: col.sortUndefined ?? undefined
        })

    return columnDef
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
    getColumnCanGlobalFilter: () => true,
    debugHeaders: true,
    debugColumns: false
  })

  useEffect(() => {
    // @ts-ignore
    table.setSorting(sortingOrder)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (document !== undefined && window !== undefined) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  return (
    <div className="mt-2 max-w-full max-h-[calc(100vh_-_64px)] overflow-scroll">
      <table className="divide-y divide-gray-300 relative dark:bg-gray-600 dark:divide-gray-600 dark:text-gray-100">
        <thead className="bg-gray-50 dark:bg-gray-600">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  scope={`col`}
                  onClick={header.column.getToggleSortingHandler()}
                  className={classNames(
                    header.column.getCanSort() ? 'cursor-pointer' : '',
                    `px-3 py-3.5 text-left text-sm font-semibold text-gray-900 bg-gray-50 sticky top-0 dark:text-gray-100 dark:bg-gray-600`
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
                  className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 text-center dark:text-gray-100">
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
