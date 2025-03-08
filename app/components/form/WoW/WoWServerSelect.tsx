import { findWoWServersIdByName } from '~/utils/WoWServers'
import { useState } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'
import type { WoWServerRegion } from '~/requests/WoW/WOWScan'

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
  toolTip,
  defaultServerId = DEFAULT_SELECT_VALUE,
  defaultServerName = '',
  regionValue = 'NA'
}: {
  onSelectChange?: (selectValue?: ServerSelected) => void
  onTextChange?: (selectValue?: string) => void
  formName: string
  title?: string
  toolTip?: string
  defaultServerId?: string
  defaultServerName?: string
  regionValue?: WoWServerRegion
}) => {
  const [id, setId] = useState<string>(defaultServerId)
  const [name, setName] = useState(defaultServerName)
  const servers = findWoWServersIdByName(name, regionValue)

  const selectIsDisabled =
    !name || name.length < 2 || !servers || !servers.length

  return (
    <div className='py-2 bg-white dark:bg-transparent'>
      <div className='flex-1 min-w-full dir-col md:max-w-md'>
        <div className='col-span-6 sm:col-span-3 xl:col-span-2'>
          <div className='relative flex flex-1 items-center gap-1 relative'>
            <label
              htmlFor='itemName'
              className='block text-sm font-medium text-gray-700 dark:text-gray-200'
            >
              Search for {title || 'server'} by name
            </label>
            {toolTip && <ToolTip data={toolTip} />}
          </div>
        </div>
        <div className='focus-within:ring-2 focus-within:ring-blue-500 rounded-md'>
          <div className={`mt-1 flex relative`}>
            <input
              type={'text'}
              id={`serverName-${formName}`}
              value={name}
              placeholder='Search here...'
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
              className='flex-1 min-w-0 block w-full px-3 py-2 block w-full sm:text-sm border-gray-300 border-b-0 focus:ring-0 focus:border-gray-300 rounded-tl-md peer dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600'
            />
            <label
              htmlFor={`serverName-${formName}`}
              className={`inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 border-b-0 text-gray-500 dark:text-gray-300 dark:bg-gray-700 sm:text-sm rounded-tr-md`}
            >
              Server Name
            </label>
          </div>
          <select
            className='flex-1 min-w-0 block w-full px-3 py-2 disabled:text-gray-500 block w-full sm:text-sm border-gray-300 rounded-b-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600'
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
            }}
          >
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
    </div>
  )
}

export default WoWServerSelect
