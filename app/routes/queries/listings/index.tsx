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
import type { ItemSelected } from '../../../components/form/select/ItemSelect'
import ItemSelect from '../../../components/form/select/ItemSelect'
import { useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { PageWrapper } from '~/components/Common'

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
    <PageWrapper>
      <>
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
          <Results data={results} />
        )}
      </>
    </PageWrapper>
  )
}

export default Index
