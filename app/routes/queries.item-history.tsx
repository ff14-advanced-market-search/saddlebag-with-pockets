import {
  useActionData,
  useNavigation,
  useLoaderData,
  useNavigate
} from '@remix-run/react'
import type {
  ActionFunction,
  MetaFunction,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import GetHistoryRequest from '~/requests/FFXIV/GetHistory'
import type {
  GetHistoryProps,
  GetHistoryResponse
} from '~/requests/FFXIV/GetHistory'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData, getSession } from '~/sessions'
import ItemSelect from '~/components/Common/ItemSelect'
import type { ItemSelected } from '~/components/Common/ItemSelect'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import Results from '~/components/FFXIVResults/item-history/Results'
import { PageWrapper, TitleH2 } from '~/components/Common'
import { useDispatch } from 'react-redux'
import { setItemHistory } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getItemNameById } from '~/utils/items'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { getHasPremium } from '~/utils/premium'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: ffxiv history analysis',
    description: 'Saddlebag Exchange: ffxiv history analysis',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/queries/item-history'
      }
    ]
  }
}

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

  return { itemId: parsedItemId, world, itemType, initialDays: 7, endDays: 0 }
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
    const response = await GetHistoryRequest(validInput)

    const jsonedRespone = await response.json()

    if ('exception' in jsonedRespone) {
      return json({ ...jsonedRespone })
    }

    return json({ ...jsonedRespone, payload: validInput })
  } catch (err) {
    console.error('catch', err)
    return { exception: err }
  }
}

const parseServerError = (error: string) => {
  if (error.includes('Error sending result:')) {
    return 'Failed to receive result from external API'
  }

  return error
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))
  const discordId = session.get('discord_id')
  const discordRoles = session.get('discord_roles') || []
  const isLoggedIn = !!discordId
  const hasPremium = getHasPremium(discordRoles)
  return json({ isLoggedIn, hasPremium })
}

const Index = () => {
  const transition = useNavigation()
  const results = useActionData<GetHistoryResponse>()
  const [formState, setFormState] = useState<ItemSelected | undefined>()
  const [error, setError] = useState<string | undefined>()
  const { darkmode } = useTypedSelector((state) => state.user)

  const { itemHistory } = useTypedSelector((state) => state.queries)

  const dispatch = useDispatch()

  const loaderData = useLoaderData<{
    isLoggedIn: boolean
    hasPremium: boolean
  }>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  useEffect(() => {
    if (results && 'average_ppu' in results) {
      dispatch(setItemHistory(results))
    } else if (results && 'exception' in results) {
      const message = parseServerError(results.exception)
      setError(`Server Error: ${message}`)
    } else if (results && 'payload' in results) {
      setError('No results found')
    }
  }, [results, dispatch])

  const resultTitle = itemHistory
    ? getItemNameById(itemHistory.payload.itemId)
    : null

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
      <div className="py-3">
        <PremiumPaywall loaderData={loaderData}>
          <SmallFormContainer
            title="Find Item History"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}>
            <ItemSelect
              onSelectChange={handleFormChange}
              onTextChange={handleTextChange}
            />
            <div className="my-1 flex flex-1 px-4">
              <select
                id="itemType"
                className="flex-1 min-w-0 block px-3 py-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block shadow-sm sm:text-sm border-gray-300 rounded-l-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400"
                name="itemType"
                defaultValue={'all'}>
                <option value="all">All</option>
                <option value="hq_only">High Quality</option>
                <option value="nq_only">Low Quality</option>
              </select>
              <label
                htmlFor="itemType"
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm shadow-sm dark:border-gray-400 dark:text-gray-300 dark:bg-gray-700">
                Item Quality
              </label>
            </div>
          </SmallFormContainer>
        </PremiumPaywall>
      </div>
      {error === 'No results found' && !itemHistory && (
        <NoResults href={`/queries/item-history`} />
      )}
      {resultTitle && (
        <div className="max-w-4xl mx-auto px-4">
          <TitleH2 title={resultTitle} />
        </div>
      )}
      {itemHistory && 'average_ppu' in itemHistory && (
        <Results data={itemHistory} darkMode={darkmode} />
      )}
    </PageWrapper>
  )
}

export default Index
