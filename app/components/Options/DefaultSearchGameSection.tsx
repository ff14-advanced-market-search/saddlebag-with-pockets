import React from 'react'
import { useDispatch } from 'react-redux'
import { setDefaultSearchGame } from '~/redux/reducers/userSlice'

interface DefaultSearchGameSectionProps {
  defaultSearchGame: 'ffxiv' | 'wow' | 'gw2'
}

const DefaultSearchGameSection: React.FC<DefaultSearchGameSectionProps> = ({
  defaultSearchGame
}) => {
  const dispatch = useDispatch()

  const handleGameChange = (game: 'ffxiv' | 'wow' | 'gw2') => {
    dispatch(setDefaultSearchGame(game))
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Default Search Game
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Choose which game the item search should default to when opened.
        </p>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="defaultSearchGame"
            value="ffxiv"
            checked={defaultSearchGame === 'ffxiv'}
            onChange={() => handleGameChange('ffxiv')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            FFXIV
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="defaultSearchGame"
            value="wow"
            checked={defaultSearchGame === 'wow'}
            onChange={() => handleGameChange('wow')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            WoW
          </span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="defaultSearchGame"
            value="gw2"
            checked={defaultSearchGame === 'gw2'}
            onChange={() => handleGameChange('gw2')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            GW2
          </span>
        </label>
      </div>
    </div>
  )
}

export default DefaultSearchGameSection
