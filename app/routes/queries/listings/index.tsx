import { Form, useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import GetListingRequest from '~/requests/GetListing'
import type { GetListingProps } from '~/requests/GetListing'
import NoResults from '~/routes/queries/listings/NoResults'
import Results from '~/routes/queries/listings/Results'
import { SubmitButton } from '~/components/form/SubmitButton'
import { useState } from 'react'
import { searchForItemName } from '~/utils/items'
import { getUserSessionData } from '~/sessions'
import { Differences } from './Differences'

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
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

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
  const [id, setId] = useState<number | undefined>()
  const [name, setName] = useState('')
  const transition = useTransition()
  const results = useActionData()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const items = searchForItemName(name)?.sort()

  const selectIsDisabled = !name || name.length < 2

  return (
    <main className="flex-1">
      <div className="py-3">
        <Form method="post">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-semibold text-blue-900 py-2">
              Get Item Listing Details
            </h1>
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
                      onChange={(e) => setId(parseInt(e.target.value))}>
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
                    {
                      <p className="text-red-500 mx-2">
                        {results && 'exception' in results
                          ? `Server Error: ${results.exception}`
                          : ''}
                      </p>
                    }
                    <SubmitButton
                      title="Search"
                      onClick={onSubmit}
                      loading={transition.state === 'submitting'}
                      disabled={!id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input name="itemId" value={id} hidden />
        </Form>
      </div>
      {results && !Object.keys(results).length && (
        <NoResults href={`/queries/listings`} />
      )}
      {results && results.listings && results.listings.length > 0 && (
        <>
          <div className="flex flex-col justify-around mx-3 my-1 sm:flex-row">
            {'min_price' in results && (
              <Differences
                diffTitle="Minimum Price"
                diffAmount={results.min_price}
                className={'bg-grey-100 font-semibold text-grey-800'}
              />
            )}
            {'listing_price_diff' in results && (
              <Differences
                diffTitle="Avg Price Difference"
                diffAmount={results.listing_price_diff.avg_price_diff}
                className={
                  results.listing_price_diff.avg_price_diff >= 10000
                    ? 'bg-green-100 font-semibold text-green-800'
                    : 'bg-red-100 font-semibold text-red-800'
                }
              />
            )}
            {'listing_time_diff' in results && (
              <Differences
                diffTitle="Avg Time Difference"
                diffAmount={`${results.listing_time_diff.avg_time_diff} hrs`}
                className={
                  results.listing_time_diff.avg_time_diff >= 30
                    ? 'bg-green-100 font-semibold text-green-800'
                    : 'bg-red-100 font-semibold text-red-800'
                }
              />
            )}
          </div>
          <Results data={results} />
        </>
      )}
    </main>
  )
}

export default Index
