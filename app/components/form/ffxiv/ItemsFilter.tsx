import React, { useState } from 'react'
import { Modal, ModalContent } from './CheckBoxModal'

const noop = () => {}

const ItemsFilter = ({
  defaultFilters = [0],
  formName = 'filters',
  onChange
}: {
  defaultFilters?: Array<number>
  onChange?: (newIds: Array<number>) => void
  formName?: string
}) => {
  const [ids, setIds] = useState(defaultFilters)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="col-span-6 sm:col-span-3 xl:col-span-2">
        <label
          htmlFor={formName}
          className="block text-sm my-1 font-medium text-gray-700 dark:text-gray-300">
          Item Filter
        </label>
        <div className={`mt-1 flex rounded-md shadow-sm`}>
          <input
            name={formName}
            value={ids.map((item) => item.toString())}
            hidden
            onChange={noop}
          />
          <button
            className="w-full py-2 px-4 text-sm bg-gray-100 hover:bg-gray-300 border border-gray-300 rounded text-left dark:bg-gray-500 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-400"
            aria-label="Choose filters"
            type="button"
            onClick={() => setIsOpen(true)}>
            Choose Filters
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          Filters applied: {ids.length}
        </p>
      </div>
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          title={`Filters Selected: ${ids.length}`}>
          <ModalContent
            ids={ids}
            setIds={(newIds) => {
              setIds(newIds)
              onChange?.(newIds)
            }}
          />
        </Modal>
      )}
    </>
  )
}

export default ItemsFilter
