import React from 'react'
import { useDispatch } from 'react-redux'
import { setDefaultSearchGame } from '~/redux/reducers/userSlice'
import type { SearchGame } from '~/utils/WoWForever/itemNames'

interface DefaultSearchGameSectionProps {
  defaultSearchGame: SearchGame
}

const games: Array<{ value: SearchGame; label: string }> = [
  { value: 'ffxiv', label: 'FFXIV' },
  { value: 'wow', label: 'WoW' },
  { value: 'forever', label: 'Forever' },
  { value: 'gw2', label: 'GW2' }
]

const DefaultSearchGameSection: React.FC<DefaultSearchGameSectionProps> = ({
  defaultSearchGame
}) => {
  const dispatch = useDispatch()

  const handleGameChange = (game: SearchGame) => {
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
      <div className="flex flex-wrap gap-4">
        {games.map((game) => (
          <label key={game.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="defaultSearchGame"
              value={game.value}
              checked={defaultSearchGame === game.value}
              onChange={() => handleGameChange(game.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {game.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default DefaultSearchGameSection
