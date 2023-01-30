import { useState } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'
import { getItemNameById, searchForItemName } from '~/utils/items'

export interface ItemSelected {
  id: string
  name: string
}

const DEFAULT_SELECT_VALUE = 'default'
const ItemSelect = ({
  onSelectChange,
  onTextChange,
  tooltip,
  selectId,
  itemList
}: {
  onSelectChange?: (selectValue?: ItemSelected) => void
  onTextChange?: (selectValue?: string) => void
  tooltip?: string
  selectId?: string
  itemList?: Array<[string, string]>
}) => {
  const [id, setId] = useState<string>(DEFAULT_SELECT_VALUE)
  const [name, setName] = useState('')
  const items = searchForItemName(name, itemList)?.sort()

  const selectIsDisabled = !name || name.length < 2 || !items || !items.length

  return (
    <div className="py-2 bg-white sm:p-4 dark:bg-slate-700">
      <div className="flex-1 min-w-full dir-col md:max-w-md">
        <div className="col-span-6 sm:col-span-3 xl:col-span-2">
          <div className="flex gap-2 relative">
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Search for Item by Name
            </label>
            {tooltip && <ToolTip data={tooltip} />}
          </div>
          <div className={`mt-1 flex rounded-md shadow-sm`}>
            <input
              type={'text'}
              id="itemName"
              value={name}
              placeholder="Potion ..."
              onChange={(e) => {
                setName(e.target.value)
                if (id !== DEFAULT_SELECT_VALUE) {
                  setId(DEFAULT_SELECT_VALUE)
                }

                if (onTextChange) {
                  onTextChange(e.target.value)
                }

                if (onSelectChange) {
                  onSelectChange(undefined)
                }
              }}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-300"
            />
            <span
              className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:text-gray-300 dark:bg-gray-700`}>
              Item
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mt-1 flex rounded-md shadow-sm`">
        <select
          id={selectId}
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
          value={id}
          name="itemId"
          disabled={selectIsDisabled}
          onChange={(e) => {
            const idChosen = e.target.value
            setId(idChosen)
            const chosenName = getItemNameById(idChosen, itemList)

            if (onSelectChange && idChosen && chosenName) {
              onSelectChange({ id: idChosen, name: chosenName })
            } else if (onSelectChange) {
              onSelectChange()
            }
          }}>
          <option disabled value={DEFAULT_SELECT_VALUE}>
            {selectIsDisabled ? '(nothing found)' : 'Choose item'}
          </option>
          {items &&
            items.map(([itemId, item], index) => (
              <option key={`${item}-${index}`} value={itemId}>
                {item}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default ItemSelect
