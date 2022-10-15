import { useState } from 'react'
import { getItemNameById, searchForItemName } from '~/utils/items'

export interface ItemSelected {
  id: string
  name: string
}

const DEFAULT_SELECT_VALUE = 'default'
const ItemSelect = ({
  onSelectChange,
  onTextChange
}: {
  onSelectChange?: (selectValue?: ItemSelected) => void
  onTextChange?: (selectValue?: string) => void
}) => {
  const [id, setId] = useState<string>(DEFAULT_SELECT_VALUE)
  const [name, setName] = useState('')
  const items = searchForItemName(name)?.sort()

  const selectIsDisabled = !name || name.length < 2 || !items || !items.length

  return (
    <div className="px-4 py-2 bg-white sm:p-4">
      <div className="flex-1 min-w-full dir-col md:max-w-md">
        <div className="col-span-6 sm:col-span-3 xl:col-span-2">
          <label
            htmlFor="itemName"
            className="block text-sm font-medium text-gray-700">
            Search for Item by Name
          </label>
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
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            <span
              className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
              Item
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mt-1 flex rounded-md shadow-sm`">
        <select
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={id}
          defaultValue={DEFAULT_SELECT_VALUE}
          name="itemId"
          disabled={selectIsDisabled}
          onChange={(e) => {
            const idChosen = e.target.value
            setId(idChosen)
            const chosenName = getItemNameById(idChosen)

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
            items.map(([itemId, item]) => (
              <option
                key={item}
                value={itemId}
                selected={id?.toString() === itemId}>
                {item}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default ItemSelect
