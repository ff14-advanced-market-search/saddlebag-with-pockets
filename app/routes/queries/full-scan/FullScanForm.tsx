import { Form } from '@remix-run/react'
import React, { useState } from 'react'
import { SubmitButton } from '~/components/form/SubmitButton'
import { Modal, ModalContent } from './CheckBoxModal'

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
  defaultOutOfStockChecked = true
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
}) => {
  const [ids, setIds] = useState(defaultFilters)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Form method="post">
        <div className="mt-5 md:mt-0 md:col-span-3 py-6">
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="scan-hours"
                    className="block text-sm font-medium text-gray-700">
                    Scan Hours
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      id="scan-hours"
                      defaultValue={defaultHours}
                      name="scan_hours"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                      hours
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The time period to search over. ex: <code>24</code> is the
                    past 24 hours. For more items to sell choose a higher
                    number.
                  </p>
                </div>
                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="sale-amt"
                    className="block text-sm font-medium text-gray-700">
                    Sale Amount
                  </label>
                  <input
                    type="number"
                    id="sale-amt"
                    defaultValue={defaultSalesAmount}
                    name="sale_amount"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Number of sales in that time. ex: `5` is 5 sales in that
                    selected time period. For more items to sell choose a lower
                    number.
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="roi"
                    className="block text-sm font-medium text-gray-700">
                    Return on Investment
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="roi"
                      defaultValue={defaultROI}
                      id="roi"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                      %
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Desired R.O.I (return on investment): ex: `50` means that
                    50% of the revenue you get from a sale should be all profit
                    (after tax). For more profit, choose a higher number from 1
                    to 100.
                  </p>
                </div>
                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="minimum_stack_size"
                    className="block text-sm font-medium text-gray-700">
                    Minimum Stack Size
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="minimum_stack_size"
                      defaultValue={defaultMinimumStackSize}
                      id="minimum_stack_size"
                      className="flex-1 min-w-0 block w-full px-3 py-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Desired Min Stack Size. ex: `10` is only show deals you can
                    get in stacks of 10 or greater. For more items to sell
                    choose a lower number.
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="minimum_profit_amount"
                    className="block text-sm font-medium text-gray-700">
                    Minimum Profit Amount
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="minimum_profit_amount"
                      defaultValue={defaultMinimumProfitAmount}
                      id="minimum_profit_amount"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                      gil
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Desired Min Profit Amount. ex: `10000` is only show deals
                    that yields 10000 gil profit or greater. For more items to
                    sell choose a lower number.
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="price_per_unit"
                    className="block text-sm font-medium text-gray-700">
                    Average Price Per Unit
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input
                      type="number"
                      name="price_per_unit"
                      defaultValue={defaultPricePerUnit}
                      id="price_per_unit"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <span
                      className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                      gil
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Desired Average Price Per Unit. ex: `10000` is only show
                    deals that sell on average for 10000 gil or greater. For
                    more items to sell choose a lower number.
                  </p>
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                  <label
                    htmlFor="filters"
                    className="block text-sm font-medium text-gray-700">
                    Item Filter
                  </label>
                  <div className={`mt-1 flex rounded-md shadow-sm`}>
                    <input name="filters" value={ids} hidden readOnly />
                    <button
                      className="w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left"
                      aria-label="Choose filters"
                      type="button"
                      onClick={() => setIsOpen(true)}>
                      Choose Filters
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
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
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="hq_only"
                          className="font-medium text-gray-700">
                          Enable HQ only
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
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
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="region_wide"
                          className="font-medium text-gray-700">
                          Region Wide Search
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                          Search all servers in all DataCenters in your region.
                        </p>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="col-span-6 sm:col-span-3 xl:col-span-2">
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
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="include_vendor"
                          className="font-medium text-gray-700">
                          Include Vendor Prices
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                          Compare market prices vs vendor prices on NQ items
                          that can be purchased from vendors.
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
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="out_of_stock"
                          className="font-medium text-gray-700">
                          Include Out of Stock
                        </label>
                        <p className="mt-2 text-sm text-gray-500">
                          Include out of stock items from the list (they will
                          show up as having 100% profit margins and 1 bil gil
                          profit).
                        </p>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton title="Search" loading={loading} onClick={onClick} />
        </div>
      </Form>
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          title={`Filters Selected: ${ids.length}`}>
          <ModalContent ids={ids} setIds={setIds} />
        </Modal>
      )}
    </>
  )
}

export default FullScanForm
