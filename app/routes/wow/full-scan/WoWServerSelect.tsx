import { findWoWServersIdByName } from '~/utils/WoWServers'
import { useState } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'

export interface ServerSelected {
  id: number
  name: string
}

const DEFAULT_SELECT_VALUE = 'default'

const WoWServerSelect = ({
  onSelectChange,
  onTextChange,
  formName,
  title,
  toolTip
}: {
  onSelectChange?: (selectValue?: ServerSelected) => void
  onTextChange?: (selectValue?: string) => void
  formName: string
  title?: string
  toolTip?: string
}) => {
  const [id, setId] = useState<string>(DEFAULT_SELECT_VALUE)
  const [name, setName] = useState('')
  const servers = findWoWServersIdByName(name)

  const selectIsDisabled =
    !name || name.length < 2 || !servers || !servers.length

  return (
    <div className="py-2 bg-white dark:bg-slate-700">
      <div className="flex-1 min-w-full dir-col md:max-w-md">
        <div className="col-span-6 sm:col-span-3 xl:col-span-2">
          <div className="relative flex flex-1 items-center gap-1 relative">
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-gray-700 dark:text-grey-100">
              Search for {title || 'server'} by name
            </label>
            {toolTip && <ToolTip data={toolTip} />}
          </div>

          <div className={`mt-1 flex rounded-md shadow-sm relative`}>
            <input
              type={'text'}
              id="itemName"
              value={name}
              placeholder="Search here..."
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
              Server Name
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mt-1 flex rounded-md shadow-sm`">
        <select
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          value={id}
          name={formName}
          disabled={selectIsDisabled}
          onChange={(e) => {
            const value = e.target.value

            const [idChosen, chosenName] = value.split('---')

            if (isNaN(parseInt(idChosen))) {
              return
            }

            setId(value)

            if (onSelectChange && idChosen && chosenName) {
              onSelectChange({ id: parseInt(idChosen), name: chosenName })
            } else if (onSelectChange) {
              onSelectChange()
            }
          }}>
          <option disabled value={DEFAULT_SELECT_VALUE}>
            {selectIsDisabled ? '(nothing found)' : 'Choose item'}
          </option>
          {servers &&
            servers.map(({ name, id }) => (
              <option key={name} value={`${id}---${name}`} label={name}>
                {name}
              </option>
            ))}
        </select>
      </div>
    </div>
  )
}

export default WoWServerSelect
