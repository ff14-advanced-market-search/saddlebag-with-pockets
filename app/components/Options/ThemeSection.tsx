import React from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '~/utils'

interface ThemeSectionProps {
  darkMode: boolean
  usingSystemTheme: boolean
  onUseSystemTheme: () => void
  onDarkModeToggle: (next: boolean) => void
}

const ThemeSection: React.FC<ThemeSectionProps> = ({
  darkMode,
  usingSystemTheme,
  onUseSystemTheme,
  onDarkModeToggle
}) => {
  return (
    <div>
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          <Switch.Label
            as="span"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
            passive>
            Enable Dark Mode
          </Switch.Label>
          <Switch.Description
            as="span"
            className="text-sm text-gray-500 dark:text-gray-300">
            {usingSystemTheme
              ? 'Following your system setting.'
              : 'Using your chosen setting.'}
          </Switch.Description>
        </span>
        {typeof document !== 'undefined' && (
          <Switch
            checked={darkMode}
            onChange={onDarkModeToggle}
            className={classNames(
              darkMode ? 'bg-black' : 'bg-gray-400',
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            )}>
            <span
              aria-hidden={true}
              className={classNames(
                darkMode ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
              )}
            />
          </Switch>
        )}
      </Switch.Group>
      {!usingSystemTheme && (
        <button
          type="button"
          onClick={onUseSystemTheme}
          className="mt-2 text-sm text-blue-600 underline dark:text-blue-400">
          Use system setting
        </button>
      )}
    </div>
  )
}

export default ThemeSection
