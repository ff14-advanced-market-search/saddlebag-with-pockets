import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/GW2/ItemListingsDetailedData'
import ItemListingsDetailedData from '~/requests/GW2/ItemListingsDetailedData'
import ItemSelect, { type ItemSelected } from '~/components/Common/ItemSelect'
import { gw2Items } from '~/utils/items/id_to_item'
import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import ItemDataDisplay from '~/components/GW2Results/ItemData/ItemDataDisplay'

export const ErrorBoundary = () => <ErrorBounds />

const validateInput = ({
  itemId
}: {
  itemId?: FormDataEntryValue | null
}): { itemID: number } | { exception: string } => {
  if (itemId === undefined || itemId === null) {
    return { exception: 'Item not found' }
  }

  if (typeof itemId !== 'string') {
    return { exception: 'Invalid item' }
  }

  const parsedItemId = Number.parseInt(itemId)

  if (isNaN(parsedItemId)) return { exception: 'Invalid item' }

  return { itemID: parsedItemId }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const validInput = validateInput({
    itemId: formData.get('itemId')
  })

  if ('exception' in validInput) {
    return json(validInput)
  }

  try {
    const response = await ItemListingsDetailedData(validInput)

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    if ('exception' in data) {
      return json({ exception: data.exception })
    }
    return json(data)
  } catch (error) {
    return json({
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

type ResponseType = ItemListingResponse | { exception: string } | undefined

export default function Index() {
  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const result = useActionData<ResponseType>()
  const [formState, setFormState] = useState<ItemSelected | undefined>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (result && 'exception' in result) {
      setError(`Server Error: ${result.exception}`)
    } else if (result && 'data' in result) {
      setError(undefined)
    }
  }, [result])

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  const handleFormChange = (selectValue?: ItemSelected | undefined) => {
    if (error) {
      setError(undefined)
    }
    setFormState(selectValue)
  }

  const handleTextChange = () => {
    setError(undefined)
  }

  const listing = result && 'data' in result ? result.data : undefined
  const loading = transition.state === 'submitting'

  return (
    <PageWrapper>
      <Title title="GW2 Detailed Item Data" />
      <Banner />

      {/* Search Form */}
      <ContentContainer>
        <div className="mb-6">
          <SmallFormContainer
            title="Get Item Listing Details"
            onClick={onSubmit}
            loading={loading}
            disabled={!formState || !formState.id}
            error={error}>
            <ItemSelect
              onSelectChange={handleFormChange}
              onTextChange={handleTextChange}
              itemList={gw2Items}
              tooltip="Search for a Guild Wars 2 item to view detailed trading post data"
            />
          </SmallFormContainer>
        </div>
      </ContentContainer>

      {/* Item Data Display */}
      {listing && !loading && (
        <ItemDataDisplay listing={listing} darkmode={darkmode} />
      )}
    </PageWrapper>
  )
}
