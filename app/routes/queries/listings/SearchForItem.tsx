import { useState } from 'react'
import { SubmitButton } from '~/components/form/SubmitButton'
import { getItemNameById, searchForItemName } from '~/utils/items'

export const SearchForItem = ({
  onClick,
  loading,
  error,
  onSelectChange
}: {
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    item?: { id: number; name: string }
  ) => void
  loading: boolean
  error?: string
  onSelectChange?: (selectValue: { id: number; name: string }) => void
}) => {
  const [id, setId] = useState<number | undefined>()
  const [name, setName] = useState('')
  const items = searchForItemName(name)?.sort()

  const selectIsDisabled = !name || name.length < 2
  return (
    <div className="mt-3 md:mt-0 md:col-span-3 py-3">
      <div className="shadow overflow-hidden sm:rounded-md">
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
                  onChange={(e) => setName(e.target.value)}
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
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              defaultValue={''}
              disabled={selectIsDisabled}
              onChange={(e) => {
                const idChosen = parseInt(e.target.value)
                setId(idChosen)
                const chosenName = getItemNameById(idChosen)

                if (onSelectChange && idChosen && chosenName) {
                  onSelectChange({ id: idChosen, name: chosenName })
                }
              }}>
              <option value={''} disabled>
                {selectIsDisabled ? '(nothing found)' : 'Choose item'}
              </option>
              {items &&
                items.map(([id, item]) => (
                  <option key={item} value={id}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="px-4 py-2 bg-white sm:p-2">
          <div className="flex justify-between">
            {<p className="text-red-500 mx-2">{error ? error : ''}</p>}
            <SubmitButton
              title="Search"
              onClick={(event) => {
                if (id && name) {
                  onClick(event, { id, name })
                  return
                }
                onClick(event)
              }}
              loading={loading}
              disabled={!id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
