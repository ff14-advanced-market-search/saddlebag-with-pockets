import { useState } from 'react'
import { SubmitButton } from '../form/SubmitButton'
import { Dialog } from '@headlessui/react'

export interface PBSListProps<DataType> {
  data: Array<DataType>
}

/**
 * Renders a button that opens a dialog to copy a formatted PBS list based on specified market and price filters.
 * @example
 * PBSListButton({ data: [{ itemID: 1, itemName: 'Sample Item' }] })
 * // Opens a dialog allowing configuration and copying of the PBS list.
 * @param {Object} { data } - The data object containing items with itemID and itemName.
 * @returns {JSX.Element} The button and dialog component for PBS list manipulation.
 * @description
 *   - Filters the input data based on configurable minimum market values and discounts.
 *   - Formats selected data entries according to a PBS specification.
 *   - Copies the generated PBS list to the clipboard when confirmed.
 */
export default function PBSListButton<
  DataType extends { itemID: number; itemName: string }
>({ data }: PBSListProps<DataType>) {
  const [isOpen, setIsOpen] = useState(false)
  const [minValue, setMinValue] = useState('10000')
  const [minPrice, setMinPrice] = useState('1000')
  const [discount, setDiscount] = useState('30')

  /**
   * Processes and filters market data to calculate discounted prices and formats them as PBS entries.
   * @example
   * processAndFormatData([{itemName: "Widget", estimatedRegionMarketValue: 100, avgTSMPrice: 90}], "100", "80", "10")
   * Returns formatted and discounted PBS entry text.
   * @param {Array} data - An array of objects, each representing market data for an item.
   * @param {string|number} minValue - The minimum market value to filter items by.
   * @param {string|number} minPrice - The minimum price to filter items by.
   * @param {string|number} discount - The discount percentage to apply to item prices.
   * @returns {void} Writes the formatted PBS string to the clipboard.
   * @description
   *   - Assumes all prices and values are numbers, using 0 as default if parsing fails.
   *   - Finds market value and price depending on property existence within item objects.
   *   - Concatenates PBS formatted entries for each valid item to a single string.
   *   - Copies the concatenated string to the clipboard and closes the dialog.
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

      // Format as PBS entry
      const pbsEntry = `Snipe^${item.itemName};;0;0;0;0;0;0;0;${Math.round(
        discountedPrice
      )};;#;;`
      return acc + pbsEntry
    }, '')

    navigator.clipboard.writeText(formattedData)
    setIsOpen(false)
  }

  return (
    <>
      <SubmitButton
        type="button"
        title="Copy PBS List"
        onClick={() => setIsOpen(true)}
      />

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-bold mb-4">PBS List Settings</h3>

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
