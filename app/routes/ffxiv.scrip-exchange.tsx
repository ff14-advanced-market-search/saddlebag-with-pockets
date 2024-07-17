import { useState, useEffect } from 'react'
import type { ActionFunction, LoaderFunction, MetaFunction, LinksFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import Select from '~/components/form/select'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { getUserSessionData } from '~/sessions'
import { ScripExchangeRequest } from '~/requests/FFXIV/scrip-exchange'

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

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  return json({
    world: session.getWorld(),
    data_center: session.getDataCenter()
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  const validInput = validateInput({
    home_server: session.getWorld(),
    color: formData.get('color')
  })

  if ('exception' in validInput) {
    return json(validInput)
  }

  try {
    const data = await ScripExchangeRequest(validInput)
    if (!data) {
      return json({ exception: 'No data found.' })
    }
    console.log(data)
    return json({ entries: data, payload: validInput })
  } catch (err) {
    console.error('Error fetching data:', err)
    return { exception: 'Error fetching data.' }
  }
}

const validateInput = ({ home_server, color }) => {
  if (!home_server || typeof home_server !== 'string' || !color || typeof color !== 'string') {
    return { exception: 'Invalid input' }
  }
  return { home_server, color }
}

const parseServerError = (error) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API'
  }
  return error
}

const FFXIVScripExchange = () => {
  const transition = useNavigation()
  const loaderData = useLoaderData()
  const results = useActionData()
  const [formState, setFormState] = useState({ color: 'Orange' })
  const [error, setError] = useState()
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (results && results.entries) {
      setTableData(results.entries)
    } else if (results && results.exception) {
      const message = parseServerError(results.exception)
      setError(`Server Error: ${message}`)
    } else if (results && results.payload) {
      setError('No results found')
    }
  }, [results])

  const handleFormChange = (name, value) => {
    setFormState({ ...formState, [name]: value })
    if (error) {
      setError(undefined)
    }
  }

  const onSubmit = (e) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
    }
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

  const sortingOrder = [{ id: 'itemID', desc: true }]

  return (
    <PageWrapper>
      <div className="py-3">
        <SmallFormContainer
          title="Find Scrip Exchange"
          onClick={onSubmit}
          error={error}
          loading={transition.state === 'submitting'}
          disabled={!formState}
        >
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
        </SmallFormContainer>
      </div>
      {error === 'No results found' && !tableData.length && (
        <NoResults href={`/ffxiv-scrip-exchange`} />
      )}
      {tableData.length > 0 && (
        <SmallTable
          data={tableData}
          sortingOrder={sortingOrder}
          columnList={columnList}
          title="Scrip Exchange"
          description="Details of scrip exchange items"
        />
      )}
    </PageWrapper>
  )
}

export default FFXIVScripExchange
