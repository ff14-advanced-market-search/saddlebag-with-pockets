import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData } from '~/sessions'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { PageWrapper, TitleH2 } from '~/components/Common'
import { useDispatch } from 'react-redux'
import { setItemHistory } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Select from '~/components/form/select'
import {
  ScripExchangeRequest,
  ScripExchangeResults
} from '~/requests/FFXIV/scrip-exchange' // Imported ScripExchangeRequest
import { ScripExchangeProps } from '~/requests/FFXIV/scripexchange'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Scrip Exchange',
    description: 'Saddlebag Exchange: FFXIV scrip exchange details'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/scrip-exchange'
  }
]

const validateInput = ({
  home_server,
  color
}: {
  home_server?: FormDataEntryValue | null
  color?: FormDataEntryValue | null
}): { home_server: string; color: string } | { exception: string } => {
  if (home_server === undefined || home_server === null) {
    return { exception: 'Server not found' }
  }

  if (color === undefined || color === null) {
    return { exception: 'Color not set' }
  }

  if (typeof home_server !== 'string') {
    return { exception: 'Invalid server' }
  }

  if (typeof color !== 'string') {
    return { exception: 'Invalid color' }
  }

  return { home_server, color }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const validInput = validateInput({
    home_server: session.getWorld(),
    color: formData.get('color')
  })

  if ('exception' in validInput) {
    return validInput
  }

  try {
    const data = await ScripExchangeRequest(validInput) // Used ScripExchangeRequest function
    // console.log(data)

    if (!data) {
      return json({ exception: 'No data found.' })
    }

    return json({ ...data, payload: validInput })
  } catch (err) {
    console.error('Error fetching data:', err)
    return { exception: 'Error fetching data.' }
  }
}

const parseServerError = (error: string) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API'
  }

  return error
}

type ActionResponse =
  | { data: ScripExchangeResults; payload: ScripExchangeProps }
  | { exception: string }
  | {}

const FFXIVScripExchange = () => {
  const transition = useNavigation()
  const actionData = useActionData<ActionResponse>()
  const [formState, setFormState] = useState<{ color: string }>({
    color: 'Orange'
  })
  const [error, setError] = useState<string | undefined>()
  const { darkmode } = useTypedSelector((state) => state.user)
  const { itemHistory } = useTypedSelector((state) => state.queries)
  const dispatch = useDispatch()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  const data = actionData && 'data' in actionData ? actionData.data : undefined

  useEffect(() => {
    const exception =
      actionData && 'exception' in actionData ? actionData.exception : undefined

    const payload =
      actionData && 'payload' in actionData ? actionData.payload : undefined

    if (data) {
      // dispatch(setItemHistory(results))
    } else if (exception) {
      const message = parseServerError(exception)
      setError(`Server Error: ${message}`)
    } else if (payload) {
      setError('No results found')
    }
  }, [actionData, dispatch])

  const handleFormChange = (name: string, value: string) => {
    if (error) {
      setError(undefined)
    }

    setFormState({ color: value })
  }

  return (
    <PageWrapper>
      <>
        <div className="py-3">
          <SmallFormContainer
            title="Find Scrip Exchange"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}>
            <>
              <Select
                title="Scrip Color"
                name="color"
                defaultValue="Orange"
                options={[
                  { label: 'Orange', value: 'Orange' },
                  { label: 'Purple', value: 'Purple' }
                ]}
                onChange={(e) => handleFormChange('color', e.target.value)}
              />
            </>
          </SmallFormContainer>
        </div>
        {error === 'No results found' && (
          <NoResults href={`/ffxiv-scrip-exchange`} />
        )}
        {data && (
          <SmallTable
            data={data}
            columnList={columnList}
            mobileColumnList={mobileColumnList}
            columnSelectOptions={['itemName']}
            sortingOrder={[{ id: 'itemName', desc: true }]}
          />
        )}
      </>
    </PageWrapper>
  )
}

const columnList = [
  { columnId: 'itemID', header: 'Item ID' },
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'cost', header: 'Cost' },
  { columnId: 'minPrice', header: 'Min Price' },
  { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
  { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
  { columnId: 'saddleLink', header: 'Saddle Link' },
  { columnId: 'uniLink', header: 'Uni Link' },
  { columnId: 'webpage', header: 'Webpage' }
]

const mobileColumnList = [
  { columnId: 'itemID', header: 'Item ID' },
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'cost', header: 'Cost' },
  { columnId: 'minPrice', header: 'Min Price' },
  { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
  { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
  { columnId: 'saddleLink', header: 'Saddle Link' },
  { columnId: 'uniLink', header: 'Uni Link' },
  { columnId: 'webpage', header: 'Webpage' }
]

export default FFXIVScripExchange