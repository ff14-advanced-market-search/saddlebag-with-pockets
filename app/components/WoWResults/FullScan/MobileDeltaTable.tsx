import { useState, useMemo } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Title } from '~/components/Common'
import Label from '~/components/form/Label'
import Modal from '~/components/form/Modal'
import type { ColumnList } from '~/components/types'
import DebouncedInput from '~/components/Common/DebouncedInput'

const parseToLocaleString = <T extends number | string>(
  value: T
): string | T => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  if (typeof value === 'string') {
    const parsedValue = Number.parseFloat(value)
    if (!Number.isNaN(parsedValue)) {
      return parsedValue.toLocaleString()
    }
  }
  return value
}

type DataType = Record<string, any>

type MobileDeltaTableProps = {
  data: Array<DataType>
  sortingOrder: Array<{ id: string; desc: boolean }>
  columnList: Array<ColumnList<any>>
  title?: string
  description?: string
  columnSelectOptions: Array<string>
}

const MobileDeltaTable = ({
  data,
  sortingOrder,
  columnList,
  title,
  description,
  columnSelectOptions
}: MobileDeltaTableProps) => {
  const [modal, setModal] = useState<{ title?: string; data: DataType } | null>(
    null
  )
  const [columnSort, setColumnSort] = useState<string>(
    sortingOrder[0]?.id || columnList[0]?.columnId || ''
  )
  const [desc, setDesc] = useState<boolean>(sortingOrder[0]?.desc ?? true)
  const [globalFilter, setGlobalFilter] = useState('')

  const handleSort = (columnId: string) => {
    if (columnId === columnSort) {
      setDesc((state) => !state)
    } else {
      setColumnSort(columnId)
      setDesc(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSort(columnId)
    }
  }

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    if (!globalFilter) return data
    return data.filter((row) =>
      columnList.some((col) => {
        const value = col.accessor
          ? col.accessor({ row, getValue: () => row[col.columnId] })
          : row[col.columnId]
        return String(value).toLowerCase().includes(globalFilter.toLowerCase())
      })
    )
  }, [data, globalFilter, columnList])

  const sortedData = useMemo(() => {
    if (!columnSort) return filteredData
    const col = columnList.find((c) => c.columnId === columnSort)
    return [...filteredData].sort((a, b) => {
      const aValue = col?.dataAccessor ? col.dataAccessor(a) : a[columnSort]
      const bValue = col?.dataAccessor ? col.dataAccessor(b) : b[columnSort]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return desc ? bValue - aValue : aValue - bValue
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return desc
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue)
      }
      return 0
    })
  }, [filteredData, columnSort, desc, columnList])

  return (
    <div className="flex flex-col sm:hidden mt-4 bg-white dark:bg-slate-700 sm:rounded-md shadow w-full mb-24">
      {!!title && (
        <div className="mx-2">
          <Title title={title} />
        </div>
      )}
      {!!description && (
        <div className="mx-2">
          <p className="italic text-sm text-grey-500 dark:text-gray-300">
            {description}
          </p>
        </div>
      )}
      <div className="m-2 flex flex-col gap-2">
        <Label>Search</Label>
        <DebouncedInput
          onDebouncedChange={setGlobalFilter}
          className="w-full p-2 rounded-md"
          placeholder="Search..."
        />
        <Label>Table sort by</Label>
        <select
          className="block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400"
          value={columnSort}
          onChange={(e) => {
            setColumnSort(e.target.value)
          }}>
          {columnSelectOptions.map((option) => {
            const col = columnList.find(({ columnId }) => columnId === option)
            if (!col) return null
            return (
              <option key={col.columnId} value={col.columnId}>
                {col.header}
              </option>
            )
          })}
        </select>
      </div>
      <div className="overflow-y-scroll max-h-[calc(100vh-160px)]">
        <table className="w-full relative divide-y divide-gray-300 dark:divide-gray-600">
          <thead>
            <tr className="text-gray-900 font-semibold dark:text-gray-100">
              {columnList.map((col) => (
                <th
                  key={col.columnId}
                  className={`py-2 px-3 sticky bg-gray-50 top-0 text-center text-gray-900 dark:text-gray-100 dark:bg-gray-600`}>
                  <button
                    type="button"
                    onClick={() => handleSort(col.columnId)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, col.columnId)
                    }}
                    className="w-full h-full flex justify-center items-center p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-sort={
                      col.columnId === columnSort
                        ? desc
                          ? 'descending'
                          : 'ascending'
                        : undefined
                    }>
                    {col.header}
                    {col.columnId === columnSort && (
                      <span className="ml-1">
                        {desc ? (
                          <ChevronDownIcon className="h-4 w-4 inline" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4 inline" />
                        )}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-slate-800 dark:divide-gray-500">
            {sortedData.map((row, rowIndex) => (
              <tr
                key={`${rowIndex}-row`}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setModal({ title, data: row })
                }}>
                {columnList.map((col, i) => (
                  <td
                    key={`cell-${rowIndex}-${i}`}
                    className={`p-2 ${i !== 0 ? 'text-center' : 'text-left'}`}>
                    {col.accessor
                      ? col.accessor({ row, getValue: () => row[col.columnId] })
                      : parseToLocaleString(row[col.columnId])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal onClose={() => setModal(null)} title={modal.title}>
          <div className="bg-white dark:bg-slate-800 text-sm text-gray-800 dark:text-gray-200">
            {columnList.map((item, index) => {
              const value = item.accessor
                ? item.accessor({
                    row: modal.data,
                    getValue: () => modal.data[item.columnId]
                  })
                : parseToLocaleString(modal.data[item.columnId]) || 'n/a'
              return (
                <div
                  key={`${index}-${item.header}`}
                  className="dark:border-b dark:border-gray-500 shadow my-2 p-1 rounded">
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    {item.header}:
                  </p>
                  <div>{value}</div>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MobileDeltaTable
