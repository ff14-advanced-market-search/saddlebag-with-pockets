import { InformationCircleIcon } from '@heroicons/react/solid'

/**
 * Renders a banner component with a message and a link to Discord.
 * @example
 * Banner()
 * <div class="rounded-md bg-blue-50 p-4 m-4 border-2 border-blue-100 dark:bg-blue-900 dark:border-blue-900">...</div>
 * @returns {JSX.Element} A styled JSX element representing a banner with information and a link to Discord.
 * @description
 *   - Utilizes Tailwind CSS classes for responsive styling.
 *   - Adjusts styles based on light and dark themes.
 *   - Includes an icon for visual emphasis using the InformationCircleIcon component.
 */
export default function Banner() {
  return (
    <div className="rounded-md bg-blue-50 p-4 m-4 border-2 border-blue-100 dark:bg-blue-900 dark:border-blue-900">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400 dark:text-gray-200"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700 dark:text-gray-200">
            Join our Discord for access to our best tools!{' '}
          </p>
          <p className="mt-3 text-sm md:mt-0 md:ml-6">
            <a
              href="https://discord.gg/saddlebag-exchange-973380473281724476"
              className="whitespace-nowrap font-medium text-blue-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-100">
              Discord
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
