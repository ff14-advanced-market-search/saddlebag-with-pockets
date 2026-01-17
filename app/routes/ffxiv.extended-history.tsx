import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction, MetaFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/Common/ItemSelect'
import type { ItemSelected } from '~/components/Common/ItemSelect'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { PageWrapper, TitleH2 } from '~/components/Common'
import { useDispatch } from 'react-redux'
import { setItemHistory } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { getItemNameById } from '~/utils/items'
import { format } from 'date-fns'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: FFXIV Full Sale History' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content: 'Saddlebag Exchange: FFXIV sale history on past 1800 sales'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/ffxiv/extended-history'
    }
  ]
}

const validateInput = ({
  itemId,
  world
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
}): { itemId: number; world: string } | { exception: string } => {
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

  if (Number.isNaN(parsedItemId)) return { exception: 'Invalid item' }

  return { itemId: parsedItemId, world }
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
    const response = await fetch(
      `https://universalis.app/api/v2/history/${validInput.world}/${validInput.itemId}`
    )
    const data = await response.json()

    if (!data.entries || data.entries.length === 0) {
      return json({ exception: 'No entries found.', payload: validInput })
    }

    return json({ entries: data.entries, payload: validInput })
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

const FFXIVSaleHistory = () => {
  const transition = useNavigation()
  const results = useActionData()
  const [formState, setFormState] = useState<ItemSelected | undefined>()
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

  useEffect(() => {
    if (results) {
      if (results.entries) {
        dispatch(setItemHistory(results))
      } else if (results.exception) {
        const message = parseServerError(results.exception)
        setError(`Server Error: ${message}`)
      } else if (
        results.payload &&
        (!results.entries || results.entries.length === 0)
      ) {
        setError('No results found')
      }
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return format(date, 'PPpp') // 'PPpp' can be replaced with any format string you need
  }

  let tableData = []
  if (itemHistory && itemHistory.entries) {
    tableData = itemHistory.entries.map((entry) => ({
      hq: entry.hq,
      pricePerUnit: entry.pricePerUnit,
      quantity: entry.quantity,
      buyerName: entry.buyerName,
      onMannequin: entry.onMannequin,
      timestamp: entry.timestamp,
      date: formatDate(entry.timestamp)
    }))
  }

  const columnList = [
    { columnId: 'date', header: 'Date' },
    { columnId: 'pricePerUnit', header: 'Price Per Unit' },
    { columnId: 'quantity', header: 'Quantity' },
    { columnId: 'hq', header: 'HQ' },
    { columnId: 'buyerName', header: 'Buyer Name' },
    { columnId: 'onMannequin', header: 'On Mannequin' }
  ]

  const mobileColumnList = [
    { columnId: 'date', header: 'Date' },
    { columnId: 'pricePerUnit', header: 'Price Per Unit' },
    { columnId: 'quantity', header: 'Quantity' },
    { columnId: 'hq', header: 'HQ' },
    { columnId: 'buyerName', header: 'Buyer Name' },
    { columnId: 'onMannequin', header: 'On Mannequin' }
  ]

  const columnSelectOptions = ['hq']

  const sortingOrder = [{ id: 'date', desc: true }]

  return (
    <PageWrapper>
      <>
        <div className="py-3">
          <SmallFormContainer
            title="Find Extended Sale History of Last 1800 Sales"
            onClick={onSubmit}
            error={error}
            loading={transition.state === 'submitting'}
            disabled={!formState}>
            <>
              <ItemSelect
                onSelectChange={handleFormChange}
                onTextChange={handleTextChange}
              />
            </>
          </SmallFormContainer>
        </div>
        {error === 'No results found' && !itemHistory && (
          <NoResults href={`/ffxiv-sale-history`} />
        )}
        {resultTitle && (
          <div className="max-w-4xl mx-auto px-4">
            <TitleH2 title={resultTitle} />
          </div>
        )}
        {itemHistory &&
          itemHistory.entries &&
          itemHistory.entries.length > 0 && (
            <SmallTable
              data={tableData}
              sortingOrder={sortingOrder}
              columnList={columnList}
              title="Sale History"
              description="A detailed history of last 1800 item sales"
              mobileColumnList={mobileColumnList}
              columnSelectOptions={columnSelectOptions}
            />
          )}
        {itemHistory &&
          (!itemHistory.entries || itemHistory.entries.length === 0) && (
            <NoResults href={`/ffxiv-sale-history`} />
          )}
      </>
    </PageWrapper>
  )
}

export default FFXIVSaleHistory
