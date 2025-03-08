import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/cloudflare'
import GetListingRequest from '~/requests/FFXIV/GetListing'
import type {
  GetListingProps,
  ListingResponseType
} from '~/requests/FFXIV/GetListing'
import Results from '~/components/FFXIVResults/listings/Results'
import { getUserSessionData } from '~/sessions'
import type { ItemSelected } from '~/components/form/select/ItemSelect'
import ItemSelect from '~/components/form/select/ItemSelect'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { PageWrapper, TitleH2 } from '~/components/Common'
import { useDispatch } from 'react-redux'
import { setListings } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { json } from '@remix-run/cloudflare'
import { getItemNameById } from '~/utils/items'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: ffxiv listings analysis',
    description: 'Saddlebag Exchange: ffxiv listings analysis'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/queries/listings' }
]

const validateInput = ({
  itemId,
  world
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
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

  return { itemId: parsedItemId, world, initialDays: 30, endDays: 0 }
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
    const request = await GetListingRequest(validInput)

    const jsonedRespone = await request.json()
    if ('exception' in jsonedRespone) {
      return json({ ...jsonedRespone })
    }

    return json({ ...jsonedRespone, payload: validInput })
  } catch (err) {
    console.log('catch', err)
    return err
  }
}

const Index = () => {
  const transition = useNavigation()
  const results = useActionData<
    ListingResponseType | { exception: string } | {}
  >()
  const [formState, setFormState] = useState<ItemSelected | undefined>()
  const [error, setError] = useState<string | undefined>()
  const dispatch = useDispatch()
  const { listings } = useTypedSelector((state) => state.queries)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  useEffect(() => {
    if (results && 'listings' in results) {
      dispatch(setListings(results))
    } else if (results && 'exception' in results) {
      setError(`Server Error: ${results.exception}`)
    } else if (results && 'payload' in results) {
      setError('No results found')
    }
  }, [results, dispatch])

  const resultTitle = listings ? getItemNameById(listings.payload.itemId) : null

  const handleFormChange = (selectValue?: ItemSelected | undefined) => {
    if (error) {
      setError(undefined)
    }
    setFormState(selectValue)
  }

  const handleTextChange = () => {
    setError(undefined)
  }

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
            <ItemSelect
              onSelectChange={handleFormChange}
              onTextChange={handleTextChange}
            />
          </SmallFormContainer>
        </div>
        {listings && listings.listings && listings.listings.length > 0 && (
          <>
            {resultTitle && <TitleH2 title={resultTitle} />}
            <Results data={listings} />
          </>
        )}
      </>
    </PageWrapper>
  )
}

export default Index
