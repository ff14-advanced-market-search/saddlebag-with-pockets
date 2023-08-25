import React, { useState } from 'react'

import Modal from '../Modal'
import { CheckBoxRow } from './CheckBoxModal'

const noop = () => {}

const DoHFilter = ({
  formName = 'jobs',
  defaultValue,
  title,
  options
}: {
  defaultValue: Array<number>
  formName?: string
  title: string
  options: Array<{ value: number; label: string }>
}) => {
  const [jobs, setJobs] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const selectedCount = `DoH applied: ${jobs.length}`

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  return (
    <>
      <div className="col-span-6 sm:col-span-3 xl:col-span-2">
        <label
          htmlFor={formName}
          className="block text-sm my-1 font-medium text-gray-700 dark:text-gray-300">
          {title}
        </label>
        <div className={`mt-1 flex rounded-md shadow-sm`}>
          <input
            name={formName}
            value={jobs.map((job) => job.toString())}
            hidden
            onChange={noop}
          />
          <button
            className="w-full py-2 px-4 text-sm bg-gray-100 hover:bg-gray-300 border border-gray-300 rounded text-left dark:bg-gray-500 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-400"
            aria-label="Choose filters"
            type="button"
            onClick={handleOpen}>
            Choose DoH
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-400">{selectedCount}</p>
      </div>
      {isOpen && (
        <Modal onClose={handleClose} title={selectedCount}>
          <>
            {options.map((option) => {
              const isSelected = jobs.includes(option.value)
              return (
                <CheckBoxRow
                  key={`${option.label}-${option.value}`}
                  title={option.label}
                  selected={isSelected}
                  onChange={(e) => {
                    e.stopPropagation()
                    if (isSelected) {
                      setJobs(jobs.filter((id) => id !== option.value))
                      return
                    }
                    setJobs([...jobs, option.value])
                  }}
                  id={option.value}
                />
              )
            })}
          </>
        </Modal>
      )}
    </>
  )
}

export default DoHFilter
