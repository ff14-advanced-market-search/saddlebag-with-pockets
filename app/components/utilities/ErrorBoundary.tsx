import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { useRouteError } from '@remix-run/react'

const parseError = (error: unknown): string | undefined => {
  if (typeof error === 'string' || typeof error === 'number')
    return error.toString()
  if (error instanceof Error) return error.message
  return undefined
}

/**
 * Renders an error fallback UI that displays a user-friendly error message and directs users to report issues.
 *
 * The component retrieves an error from the routing context, logs it for debugging, and shows a formatted message.
 * An optional custom message can be provided via the `message` prop; otherwise, the error is parsed into a displayable string.
 *
 * @param message - Optional custom error message to override the parsed error.
 *
 * @returns A JSX element representing the error fallback UI.
 */
export default function ErrorBoundary({ message }: { message?: string }) {
  const error = useRouteError()
  console.error('errorBoundary', error)

  const errorToDisplay = message || parseError(error)

  return (
    <div className='rounded-md bg-red-50 p-4 m-4 border-2 border-red-100 dark:bg-red-900 dark:border-red-900'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ExclamationCircleIcon
            className='h-5 w-5 text-red-400 dark:text-gray-200'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3 flex-1 flex-col text-red-700 dark:text-gray-200 text-sm'>
          <div className='flex-1 md:flex md:justify-between'>
            <p>
              If you're seeing this, it'd be appreciated if you could report in
              our{' '}
              <a
                href='https://discord.com/channels/973380473281724476/973380528797548544'
                target='_blank'
                rel='noreferrer'
                className='whitespace-nowrap font-medium text-red-700 dark:text-gray-100 hover:text-red-600 hover:underline dark:hover:text-red-300'
              >
                Discord's <span className={`font-bold`}>#bug-reporting</span>
              </a>{' '}
              channel. Much thank
            </p>
          </div>
          {errorToDisplay && (
            <p className='mt-3'>{`Error: ${errorToDisplay}`}</p>
          )}
        </div>
      </div>
    </div>
  )
}
