import { Form } from '@remix-run/react'
import React, { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { SubmitButton } from '~/components/form/SubmitButton'
import TitleTooltip from '~/components/Common/TitleTooltip'
import { Modal, ModalContent } from './CheckBoxModal'

const noop = () => {}

const FullScanForm = ({
  loading,
  onClick,
  defaultHours = 24,
  defaultSalesAmount = 5,
  defaultROI = 50,
  defaultMinimumStackSize = 1,
  defaultMinimumProfitAmount = 10000,
  defaultPricePerUnit = 10000,
  defaultFilters = [0],
  defaultHQChecked = false,
  defaultRegionWideChecked = false,
  defaultIncludeVendorChecked = false,
  defaultOutOfStockChecked = true,
  error
}: {
  loading: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  defaultHours?: number
  defaultSalesAmount?: number
  defaultROI?: number
  defaultMinimumStackSize?: number
  defaultMinimumProfitAmount?: number
  defaultPricePerUnit?: number
  defaultFilters?: Array<number>
  defaultHQChecked?: boolean
  defaultRegionWideChecked?: boolean
  defaultIncludeVendorChecked?: boolean
  defaultOutOfStockChecked?: boolean
  error?: string
}) => {
  const [ids, setIds] = useState(defaultFilters)
  const [isOpen, setIsOpen] = useState(false)
  const [formOpened, setFormOpened] = useState(false)
  const [hqChecked, setHQChecked] = useState(defaultHQChecked)

  const handleSearchParamChange = (
    paramName: string,
    newValue: string | undefined
  ) => {
    if (!document || !window) return
    const url = new window.URL(document.URL)

    if (newValue) {
      url.searchParams.set(paramName, newValue)
    }

    window.history.replaceState({}, '', url.toString())
  }

  const handleCopyButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!window || !document) {
      return
    }

    if (!window.isSecureContext) {
      alert('Failed to copy address to clipboard.')
      return
    }

    await navigator.clipboard.writeText(document.URL)

    alert('Address copied to clipboard')
  }

  return (
    <>
      <Form method="post">
        <div className="mt-5 md:mt-0 md:col-span-3 py-6">
          <div className="shadow sm:rounded-md">
            <div className="px-4 py-5 shadow sm:rounded-md bg-white sm:p-6 dark:bg-slate-700">
              <div className="flex justify-end mb-2">
                <SubmitButton
                  title="Share this search!"
                  onClick={handleCopyButton}
                  type="button"
                />
              </div>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="scan-hours"
                    className="block text-sm font-medium text-gray-700">
                    <TitleTooltip
                      title="Scan Hours"
                      relative
                      toolTip={
                        <>
                          The time period to search over. ex:{' '}
                          <code className="font-mono">24</code> is the past 24
                          hours. For more items to sell choose a higher number.
                        </>
                      }
                    />
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      id="scan-hours"
                      defaultValue={defaultHours}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value)
                        if (isNaN(value)) {
                          handleSearchParamChange('hours', '')
                          return
                        }

                        handleSearchParamChange('hours', value.toString())
                      }}
                      name="scan_hours"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-400`}>
                      hours
                    </span>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="sale-amt"
                    className="block text-sm font-medium text-gray-700">
                    <TitleTooltip
                      title="Sale Amount"
                      relative
                      toolTip={
                        <>
                          Number of sales in that time. ex:{' '}
                          <code className="font-mono">5</code> is 5 sales in
                          that selected time period. For more items to sell
                          choose a lower number.
                        </>
                      }
                    />
                  </label>
                  <input
                    type="number"
                    id="sale-amt"
                    defaultValue={defaultSalesAmount}
                    onChange={(event) => {
                      const value = parseFloat(event.target.value)
                      if (isNaN(value)) {
                        handleSearchParamChange('salesAmount', '')
                        return
                      }
                      handleSearchParamChange('salesAmount', value.toString())
                    }}
                    name="sale_amount"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="roi"
                    className="block text-sm font-medium text-gray-700">
                    <TitleTooltip
                      title="Return on Investment"
                      relative
                      toolTip={
                        <>
                          Desired R.O.I (return on investment): ex:{' '}
                          <code className="font-mono">50</code> means that 50%
                          of the revenue you get from a sale should be all
                          profit (after tax). For more profit, choose a higher
                          number from 1 to 100.
                        </>
                      }
                    />
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="roi"
                      defaultValue={defaultROI}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value)
                        if (isNaN(value)) {
                          handleSearchParamChange('ROI', '')
                          return
                        }
                        handleSearchParamChange('ROI', value.toString())
                      }}
                      id="roi"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-400`}>
                      %
                    </span>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="price_per_unit"
                    className="block text-sm font-medium text-gray-700">
                    <TitleTooltip
                      title="Average Price Per Unit"
                      relative
                      toolTip={
                        <>
                          Desired Average Price Per Unit. ex:{' '}
                          <code className="font-mono">10000</code> is only show
                          deals that sell on average for 10000 gil or greater.
                          For more items to sell choose a lower number.
                        </>
                      }
                    />
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="price_per_unit"
                      defaultValue={defaultPricePerUnit}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value)
                        if (isNaN(value)) {
                          handleSearchParamChange('pricePerUnit', '')
                          return
                        }
                        handleSearchParamChange(
                          'pricePerUnit',

                          value.toString()
                        )
                      }}
                      id="price_per_unit"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-400`}>
                      gil
                    </span>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="minimum_profit_amount"
                    className="block text-sm font-medium text-gray-700">
                    <TitleTooltip
                      title="Minimum Profit Amount"
                      relative
                      toolTip={
                        <>
                          Desired Min Profit Amount. ex:{' '}
                          <code className="font-mono">10000</code> is only show
                          deals that yields 10000 gil profit or greater. For
                          more items to sell choose a lower number.
                        </>
                      }
                    />
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="minimum_profit_amount"
                      defaultValue={defaultMinimumProfitAmount}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value)
                        if (isNaN(value)) {
                          handleSearchParamChange(
                            'minimumProfitAmount',

                            ''
                          )
                          return
                        }
                        handleSearchParamChange(
                          'minimumProfitAmount',

                          value.toString()
                        )
                      }}
                      id="minimum_profit_amount"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700 dark:border-gray-400`}>
                      gil
                    </span>
                  </div>
                </div>
              </div>

              <>
                <div className="w-full flex justify-center items-center">
                  <button
                    className="text-center text-sm font-medium flex grow-0 shrink-0 justify-center items-center my-2 dark:text-gray-200"
                    type="button"
                    onClick={() => setFormOpened((state) => !state)}>
                    Advanced Search Options
                    <ChevronDownIcon
                      className={
                        'h-4 w-4 transition duration-200' +
                        (formOpened ? 'transform rotate-180' : '')
                      }
                    />
                  </button>
                </div>
                <div
                  className={
                    formOpened
                      ? 'grid grid-cols-6 gap-6'
                      : 'max-h-0 p-0 m-0 overflow-hidden'
                  }>
                  <div className={`col-span-6 sm:col-span-3 xl:col-span-2`}>
                    <label
                      htmlFor="minimum_stack_size"
                      className="block text-sm font-medium text-gray-700">
                      <TitleTooltip
                        title="Minimum Stack Size"
                        relative
                        toolTip={
                          <>
                            Desired Min Stack Size. ex:{' '}
                            <code className="font-mono">10</code> is only show
                            deals you can get in stacks of 10 or greater. For
                            more items to sell choose a lower number.
                          </>
                        }
                      />
                    </label>
                    <div className={`mt-1 flex rounded-md shadow-sm`}>
                      <input
                        type="number"
                        name="minimum_stack_size"
                        defaultValue={defaultMinimumStackSize}
                        onChange={(event) => {
                          const value = parseFloat(event.target.value)
                          if (isNaN(value)) {
                            handleSearchParamChange('minimumStackSize', '')
                            return
                          }
                          handleSearchParamChange(
                            'minimumStackSize',

                            value.toString()
                          )
                        }}
                        id="minimum_stack_size"
                        className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                    <label
                      htmlFor="filters"
                      className="block text-sm my-1 font-medium text-gray-700 dark:text-gray-300">
                      Item Filter
                    </label>
                    <div className={`mt-1 flex rounded-md shadow-sm`}>
                      <input
                        name="filters"
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

                  <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Force HQ only</legend>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="hq_only"
                            aria-describedby="comments-description"
                            name="hq_only"
                            type="checkbox"
                            defaultChecked={defaultHQChecked}
                            onChange={(event) => {
                              const value = event.target.checked

                              handleSearchParamChange(
                                'hQChecked',
                                value.toString()
                              )
                              setHQChecked(value)
                            }}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="hq_only"
                            className="font-medium text-gray-700 dark:text-gray-200">
                            Enable HQ only
                          </label>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                            Only search for hq prices
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Region Wide Search</legend>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="region_wide"
                            aria-describedby="comments-description"
                            name="region_wide"
                            type="checkbox"
                            defaultChecked={defaultRegionWideChecked}
                            onChange={(event) => {
                              const value = event.target.checked

                              handleSearchParamChange(
                                'regionWideChecked',
                                value.toString()
                              )
                            }}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="region_wide"
                            className="font-medium text-gray-700 dark:text-gray-200">
                            Region Wide Search
                          </label>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                            Search all servers in all DataCenters in your
                            region.
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Include Out of Stock</legend>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="out_of_stock"
                            aria-describedby="comments-description"
                            name="out_of_stock"
                            type="checkbox"
                            defaultChecked={defaultOutOfStockChecked}
                            onChange={(event) => {
                              const value = event.target.checked

                              handleSearchParamChange(
                                'outOfStockChecked',
                                value.toString()
                              )
                            }}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="out_of_stock"
                            className="font-medium text-gray-700 dark:text-gray-200">
                            Include Out of Stock
                          </label>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                            Include out of stock items from the list (they will
                            show up as having 100% profit margins and 1 bil gil
                            profit).
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div
                    className={
                      hqChecked === true
                        ? 'h-0 w-0 p-0 m-0 overflow-hidden'
                        : 'col-span-6 sm:col-span-3 xl:col-span-2'
                    }>
                    <fieldset className="space-y-5">
                      <legend className="sr-only">Include Vendor Prices</legend>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="include_vendor"
                            aria-describedby="comments-description"
                            name="include_vendor"
                            type="checkbox"
                            defaultChecked={defaultIncludeVendorChecked}
                            onChange={(event) => {
                              const value = event.target.checked

                              handleSearchParamChange(
                                'includeVendorChecked',
                                value.toString()
                              )
                            }}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="include_vendor"
                            className="font-medium text-gray-700 dark:text-gray-200">
                            Include Vendor Prices
                          </label>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                            Compare market prices vs vendor prices on NQ items
                            that can be purchased from vendors.
                          </p>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          {error && (
            <p className="self-start text-red-500 dark:text-red-300">{error}</p>
          )}
          <SubmitButton title="Search" loading={loading} onClick={onClick} />
        </div>
      </Form>
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          title={`Filters Selected: ${ids.length}`}>
          <ModalContent
            ids={ids}
            setIds={(newIds) => {
              setIds(newIds)
              handleSearchParamChange('filters', newIds.join(','))
            }}
          />
        </Modal>
      )}
    </>
  )
}

export default FullScanForm