import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import GetListingRequest from '~/requests/GetListing'
import type { GetListingProps } from '~/requests/GetListing'
import NoResults from '~/routes/queries/listings/NoResults'
import Results from '~/routes/queries/listings/Results'
import { getUserSessionData } from '~/sessions'
import { Differences } from './Differences'
import type { ItemSelected } from '../../../components/form/select/ItemSelect'
import ItemSelect from '../../../components/form/select/ItemSelect'
import { useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'

const validateInput = ({
  itemId,
  world,
  daysRange
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
  daysRange?: Array<number>
}): GetListingProps | { exception: string } => {
  if (itemId === undefined || itemId === null) {
    return { exception: 'Item not found' }
  }

  if (world === undefined || world === null) {
    return { exception: 'World not set' }
  }

  if (typeof itemId !== 'string') {
    return { exception: 'Invalid item' }
  }

  if (typeof world !== 'string') {
    return { exception: 'Invalid world' }
  }

  const parsedItemId = parseInt(itemId)

  if (isNaN(parsedItemId)) return { exception: 'Invalid item' }

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

  if ('exception' in validInput) {
    return validInput
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
  const [formState, setFormState] = useState<ItemSelected | undefined>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }

    console.log('submitting')
  }

  const error =
    results && 'exception' in results
      ? `Server Error: ${results.exception}`
      : ''

  return (
    <main className="flex-1">
      <div className="py-3">
        <SmallFormContainer
          title="Get Item Listing Details"
          onClick={onSubmit}
          loading={transition.state === 'submitting'}
          disabled={!formState || !formState.id}
          error={error}>
          <ItemSelect onSelectChange={setFormState} />
        </SmallFormContainer>
      </div>
      {results && !Object.keys(results).length && (
        <NoResults href={`/queries/listings`} />
      )}
      {results && results.listings && results.listings.length > 0 && (
        <>
          <div className="flex flex-col justify-around mx-3 my-1 sm:flex-row">
            {'listing_price_diff' in results && (
              <Differences
                diffTitle="Avg Price Difference"
                diffAmount={`${results.listing_price_diff.avg_price_diff} gil`}
                className={
                  results.listing_price_diff.avg_price_diff >= 10000
                    ? 'bg-red-100 font-semibold text-red-800'
                    : 'bg-green-100 font-semibold text-green-800'
                }
              />
            )}
            {'listing_price_diff' in results && (
              <Differences
                diffTitle="Median Price Difference"
                diffAmount={`${results.listing_price_diff.median_price_diff} gil`}
                className={
                  results.listing_price_diff.median_price_diff >= 10000
                    ? 'bg-red-100 font-semibold text-red-800'
                    : 'bg-green-100 font-semibold text-green-800'
                }
              />
            )}
            {'listing_time_diff' in results && (
              <Differences
                diffTitle="Avg Time Difference"
                diffAmount={`${results.listing_time_diff.avg_time_diff} minutes`}
                className={
                  results.listing_time_diff.avg_time_diff >= 30
                    ? 'bg-green-100 font-semibold text-green-800'
                    : 'bg-red-100 font-semibold text-red-800'
                }
              />
            )}
            {'listing_time_diff' in results && (
              <Differences
                diffTitle="Median Time Difference"
                diffAmount={`${results.listing_time_diff.median_time_diff} minutes`}
                className={
                  results.listing_time_diff.median_time_diff >= 30
                    ? 'bg-green-100 font-semibold text-green-800'
                    : 'bg-red-100 font-semibold text-red-800'
                }
              />
            )}
            {'min_price' in results && (
              <Differences
                diffTitle="Minimum Price"
                diffAmount={`${results.min_price} gil`}
                className={'bg-blue-100 font-semibold text-blue-800'}
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
