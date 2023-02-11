import { useState } from 'react'
import { Title } from '~/components/Common'
import Modal from '~/components/form/Modal'

const parseToLocaleString = (value: any) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  if (typeof value === 'string' && !isNaN(parseFloat(value))) {
    return parseFloat(value).toLocaleString()
  }

  return value
}

function MobileTable<Type>({
  data,
  sortingOrder,
  columnList,
  title,
  description,
  rowLabels
}: {
  data: Array<Type>
  sortingOrder: Array<{ id: string; desc: boolean }>
  columnList: Array<{ header: string; columnId: string }>
  title: string
  description: string
  rowLabels: Array<{
    columnId: string
    header: string
    accessor?: (props: any) => JSX.Element
  }>
}) {
  const [modal, setModal] = useState<{ title: string; data: Type } | null>(null)

  const sortingColumn = sortingOrder.length ? sortingOrder[0] : undefined
  const sortedData = sortingColumn
    ? data
        .map((self) => self)
        .sort((a, b) => {
          return sortingColumn.desc
            ? b[sortingColumn.id] - a[sortingColumn.id]
            : a[sortingColumn.id] - b[sortingColumn.id]
        })
    : data
  return (
    <div
      className={`flex flex-col sm:hidden my-4 bg-white dark:bg-slate-700 p-2 sm:rounded-md shadow max-w-screen`}>
      <div className="mx-2">
        <Title title={title} />
      </div>
      <div className="mx-2">
        <p className="italic text-sm text-grey-500 dark:text-gray-300">
          {description}
        </p>
      </div>
      <div className="overflow-y-scroll max-h-96">
        <table className="max-w-screen relative divide-y divide-gray-300 dark:divide-gray-600">
          <thead className="max-w-screen">
            <tr className="text-gray-900 font-semibold dark:text-gray-100">
              {columnList.map((col) => (
                <th
                  key={col.columnId}
                  className="p-2 sticky bg-gray-50 top-0 dark:bg-gray-600">
                  {col.header}
                </th>
              ))}
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
                  {columnList.map((col, i) => {
                    return (
                      <td key={`cell-${rowIndex}-${i}`} className="p-2">
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
