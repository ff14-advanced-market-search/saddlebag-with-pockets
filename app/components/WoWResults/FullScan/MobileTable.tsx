import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { Title } from '~/components/Common'
import Label from '~/components/form/Label'
import Modal from '~/components/form/Modal'
import type { ColumnList } from '~/components/types'

const parseToLocaleString = (value: any) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  if (typeof value === 'string' && !isNaN(parseFloat(value))) {
    return parseFloat(value).toLocaleString()
  }

  return value
}

type Type = Record<string, any>

function MobileTable({
  data,
  sortingOrder,
  columnList,
  title,
  description,
  rowLabels,
  columnSelectOptions
}: {
  data: Array<Type>
  sortingOrder: Array<{ id: keyof Type; desc: boolean }>
  columnList: Array<{ header: string; columnId: string }>
  title?: string
  description?: string
  rowLabels: Array<ColumnList<any>>
  columnSelectOptions: Array<string>
}) {
  const [modal, setModal] = useState<{ title?: string; data: Type } | null>(
    null
  )
  const [columnSort, setColumnSort] = useState<string | undefined>(
    sortingOrder[0]?.id
  )

  const [desc, setDesc] = useState<boolean>(sortingOrder[0].desc || true)

  const [columns, setColumns] =
    useState<Array<{ header: string; columnId: string }>>(columnList)

  const sortingColumn = columnSort
  const sortedData = sortingColumn
    ? data
        .map((self) => self)
        .sort((a, b) => {
          const aValue = a[sortingColumn]
          const bValue = b[sortingColumn]
          if (!aValue || typeof aValue !== 'number') {
            return 0
          }

          if (!bValue || typeof bValue !== 'number') {
            return 0
          }

          return desc ? bValue - aValue : aValue - bValue
        })
    : data

  return (
    <div
      className={`flex flex-col sm:hidden my-4 bg-white dark:bg-slate-700 sm:rounded-md shadow max-w-screen`}>
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
      <div className="m-2 flex flex-col">
        <Label>Table sort by</Label>
        <select
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400"
          defaultValue={columnSort}
          onChange={(e) => {
            e.preventDefault()
            const value = e.target.value

            if (!value) return

            const filteredColumns = columns.filter(
              (col) => col.columnId !== columnSort
            )

            setColumnSort(value)

            const newColumn = rowLabels.find((row) => row.columnId === value)

            if (!newColumn) return

            setColumns([...filteredColumns, newColumn])
          }}>
          {columnSelectOptions.map((option, index) => {
            const row = rowLabels.find(({ columnId }) => columnId === option)
            if (!row) return <></>

            return (
              <option key={row.columnId + index} value={row.columnId}>
                {row.header}
              </option>
            )
          })}
        </select>
      </div>
      <div className="overflow-y-scroll max-h-96">
        <table className="max-w-screen relative divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="max-w-screen">
            <tr className="text-gray-900 font-semibold dark:text-gray-100">
              {columns.map((col) => {
                if (col.columnId === sortingColumn) {
                  return (
                    <th
                      key={col.columnId}
                      onClick={() => setDesc((state) => !state)}
                      className="py-2 px-3 sticky bg-gray-50 top-0 text-center cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-gray-600">
                      <div className="flex justify-center items-center p-2">
                        {col.header}
                        <div className="bg-gray-200 rounded dark:bg-gray-500 p-2">
                          {desc ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronUpIcon className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </th>
                  )
                }
                return (
                  <th
                    key={col.columnId}
                    className="p-2 sticky bg-gray-50 top-0 dark:bg-gray-600">
                    {col.header}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-slate-800 dark:divide-gray-500 max-w-screen">
            {sortedData.map((row, rowIndex) => {
              return (
                <tr
                  key={`${rowIndex}-row`}
                  className="text-gray-700 dark:text-gray-300"
                  onClick={() => {
                    setModal({ title, data: row })
                  }}>
                  {columns.map((col, i) => {
                    return (
                      <td
                        key={`cell-${rowIndex}-${i}`}
                        className={`p-2 ${
                          i !== 0 ? 'text-center' : 'text-left'
                        }`}>
                        {parseToLocaleString(row[col.columnId])}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)} title={modal.title}>
          <div className="bg-white dark:bg-slate-800 text-xs text-gray-800 dark:text-gray-200">
            {rowLabels.map((item, index) => {
              const modalItem =
                parseToLocaleString(modal.data[item.columnId]) || 'n/a'
              return (
                <div
                  key={`${index}-${item.header}`}
                  className="dark:border-b dark:border-gray-500 shadow my-2 p-1 rounded">
                  <p className="text-gray-900 dark:text-gray-100 font-semibold">
                    {item.header}:
                  </p>

                  <p>
                    {item.accessor
                      ? item.accessor({
                          row: modal.data,
                          getValue: () => modalItem
                        })
                      : modalItem}
                  </p>
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default MobileTable
