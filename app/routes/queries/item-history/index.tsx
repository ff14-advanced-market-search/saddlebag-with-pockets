import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import GetHistoryRequest from '~/requests/GetHistory'
import type { GetHistoryProps, GetHistoryResponse } from '~/requests/GetHistory'
import NoResults from '~/routes/queries/listings/NoResults'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'
import type { ItemSelected } from '~/components/form/select/ItemSelect'
import { useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import Results from './Results'
import { PageWrapper } from '~/components/Common'

const validateInput = ({
  itemId,
  world,
  itemType
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
  itemType?: FormDataEntryValue | null
}): GetHistoryProps | { exception: string } => {
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

  if (itemType !== 'all' && itemType !== 'hq_only' && itemType !== 'nq_only') {
    return { exception: 'Invalid item type selected' }
  }

  return { itemId: parsedItemId, world, itemType }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

  const validInput = validateInput({
    itemId: formData.get('itemId'),
    world: formData.get('world'),
    itemType: formData.get('itemType')
  })

  if ('exception' in validInput) {
    return validInput
  }

  try {
    return await GetHistoryRequest(validInput)
  } catch (err) {
    console.error('catch', err)
    return { exception: err }
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

const parseServerError = (error: string) => {
  if (error.includes('Error sending result:')) {
    return 'Failed to receive result from external API'
  }

  return error
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<GetHistoryResponse>()
  const [formState, setFormState] = useState<ItemSelected | undefined>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  const error =
    results && 'exception' in results
      ? `Server Error: ${parseServerError(results.exception)}`
      : ''

  return (
    <PageWrapper>
      <>
        <div className="py-3">
          <SmallFormContainer
            title="Find Item History"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}>
            <>
              <ItemSelect onSelectChange={setFormState} />
              <div className="my-1 flex flex-1 px-4">
                <select
                  id="itemType"
                  className="flex-1 min-w-0 block px-3 py-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block shadow-sm sm:text-sm border-gray-300 rounded-l-md"
                  name="itemType"
                  defaultValue={'all'}>
                  <option value="all">All</option>
                  <option value="hq_only">High Quality</option>
                  <option value="nq_only">Low Quality</option>
                </select>
                <label
                  htmlFor="itemType"
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm shadow-sm">
                  Item Quality
                </label>
              </div>
            </>
          </SmallFormContainer>
        </div>
        {results && !Object.keys(results).length && (
          <NoResults href={`/queries/item-history`} />
        )}
        {results && 'average_ppu' in results && <Results data={results} />}
      </>
    </PageWrapper>
  )
}

export default Index
