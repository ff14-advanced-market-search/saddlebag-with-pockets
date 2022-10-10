import { Form, useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import GetListingRequest from '~/requests/GetListing'
import type { GetListingProps } from '~/requests/GetListing'
import { classNames } from '~/utils'
import NoResults from '~/routes/queries/listings/NoResults'
import Results from '~/routes/queries/listings/Results'

const validateInput = ({
  itemId,
  world,
  daysRange
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
  daysRange?: Array<number>
}): GetListingProps | undefined => {
  if (itemId === undefined || itemId === null) {
    return
  }

  if (world === undefined || world === null) {
    return
  }

  if (typeof itemId !== 'string') {
    return
  }

  if (typeof world !== 'string') {
    return
  }

  const parsedItemId = parseInt(itemId, 10)
  if (isNaN(parsedItemId)) {
    return
  }

  return { itemId: parsedItemId, world, daysRange }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const validInput = validateInput({
    itemId: formData.get('itemId'),
    world: formData.get('world')
  })

  if (!validInput) {
    return new Error('not valid input')
  }

  try {
    return await GetListingRequest(validInput)
  } catch (err) {
    console.log('catch', err)
    return err
  }
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error('errorBoundary', error)
  return (
    <pre>
      If you're seeing this, it'd be appreciated if you could report in our
      Discord's <span className={`font-bold`}>#bug-reporting</span> channel.
      Much thank
    </pre>
  )
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData()

  const onSubmit = (e: MouseEvent) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  console.log('results', results)
  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href={`/queries/listings`} />
    }

    return <Results rows={results} />
  }
  return (
    <main className="flex-1">
      <div className="py-6">
        <Form method="post">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-blue-900 py-6">
              Get Item Listing Details
            </h1>
            <div className="mt-5 md:mt-0 md:col-span-3 py-6">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="item-id"
                        className="block text-sm font-medium text-gray-700">
                        Item Id
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <input
                          type="number"
                          id="item-id"
                          defaultValue={36109}
                          name="itemId"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <span
                          className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                          ID Code
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 xl:col-span-2">
                      <label
                        htmlFor="world"
                        className="block text-sm font-medium text-gray-700">
                        World
                      </label>
                      <div className={`mt-1 flex rounded-md shadow-sm`}>
                        <input
                          type={'text'}
                          id="world"
                          defaultValue={'Midgardsormr'}
                          name="world"
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        <span
                          className={`inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm`}>
                          World
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                // @ts-ignore
                onClick={onSubmit}
                className={classNames(
                  transition.state === 'submitting'
                    ? 'bg-gray-500'
                    : 'bg-blue-600',
                  'cursor-pointer ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                )}>
                {transition.state === 'submitting' && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Search
              </button>
            </div>
          </div>
        </Form>
      </div>
    </main>
  )
}

export default Index
