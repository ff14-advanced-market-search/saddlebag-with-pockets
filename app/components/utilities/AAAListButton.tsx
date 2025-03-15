import { useState } from 'react'
import { SubmitButton } from '../form/SubmitButton'
import { Dialog } from '@headlessui/react'

export interface AAAListProps<DataType> {
  data: Array<DataType>
}

/**
* Creates a button that allows users to configure and copy a list of discounted prices based on specific criteria.
* @example
* AAAListButton({ data: itemsArray })
* No explicit return; performs clipboard operation.
* @param {AAAListProps<DataType extends { itemID: number }>} { data } - The data to be processed, where each item has an itemID.
* @returns {void} No return value; the function triggers side-effects such as setting local state and writing to the clipboard.
* @description
*   - Utilizes a modal dialog to collect user input for filtering and computing discounted prices.
*   - Parses and validates numeric input values for minimum market value, price, and discount percentage.
*   - Writes a JSON string of filtered and processed data to the clipboard.
*   - Uses state to manage the dialog visibility and stores user input values.
*/
export default function AAAListButton<DataType extends { itemID: number }>({
  data
}: AAAListProps<DataType>) {
  const [isOpen, setIsOpen] = useState(false)
  const [minValue, setMinValue] = useState('10000')
  const [minPrice, setMinPrice] = useState('1000')
  const [discount, setDiscount] = useState('30')

  /**
  * Formats data and writes it to the clipboard after applying discount and filtering conditions.
  * @example
  * formatDataAndCopyToClipboard(data, minValue, minPrice, discount)
  * // Sample return value depends on the data processed.
  * @param {Array} data - Array of objects where each object represents an item with pricing and value information.
  * @param {string|number} minValue - Minimum market value for filtering items.
  * @param {string|number} minPrice - Minimum price value for filtering items.
  * @param {string|number} discount - Discount percentage to apply to the filtered items.
  * @returns {void} This function does not return any value.
  * @description
  *   - Parses string inputs into integers to allow tolerant numeric filtering.
  *   - Uses either 'estimatedRegionMarketValue' or 'historicMarketValue' for evaluating market value.
  *   - Uses either 'avgTSMPrice' or 'historicPrice' for evaluating price.
  *   - The processed data is copied to the clipboard in JSON format.
  */
  const handleCopy = () => {
    const minMarketValue = parseInt(minValue) || 0
    const minPriceValue = parseInt(minPrice) || 0
    const discountPercent = parseInt(discount) || 0

    const formattedData = data.reduce((acc, item) => {
      // Get market value based on data type
      const marketValue =
        'estimatedRegionMarketValue' in item
          ? (item as any).estimatedRegionMarketValue
          : (item as any).historicMarketValue

      // Get price for filtering
      const price =
        'avgTSMPrice' in item
          ? (item as any).avgTSMPrice
          : (item as any).historicPrice

      // Skip if below minimum values
      if (marketValue < minMarketValue || price < minPriceValue) return acc

      const discountedPrice =
        Math.round(price * (discountPercent / 100) * 100) / 100

      return {
        ...acc,
        [item.itemID]: discountedPrice
      }
    }, {})

    navigator.clipboard.writeText(JSON.stringify(formattedData, null, 2))
    setIsOpen(false)
  }

  return (
    <>
      <SubmitButton
        type="button"
        title="Copy AAA List"
        onClick={() => setIsOpen(true)}
      />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold mb-4">AAA List Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Market Value
              </label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Average Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount Percentage
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Cancel
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Copy
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
