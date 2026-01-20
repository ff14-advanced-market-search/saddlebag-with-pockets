import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import type { ItemListingResponse } from '~/requests/GW2/ItemListingsDetailedData'
import ItemListingsDetailedData from '~/requests/GW2/ItemListingsDetailedData'
import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { useTypedSelector } from '~/redux/useTypedSelector'
import Banner from '~/components/Common/Banner'
import { useState, useEffect } from 'react'
import ItemDataDisplay from '~/components/GW2Results/ItemData/ItemDataDisplay'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { RadioButtons } from '~/components/Common/RadioButtons'
import { getItemIDByName, getItemNameById } from '~/utils/items'

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

    const data = (await response.json()) as
      | ItemListingResponse
      | { exception: string }
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

type SearchMode = 'name' | 'id'

export default function Index() {
  const [gw2ItemsList, setGw2ItemsList] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [gw2Items, setGw2Items] = useState<Array<[string, string]>>([])

  useEffect(() => {
    import('~/utils/items/id_to_item').then(
      ({ gw2Items: items, gw2ItemsList: itemsList }) => {
        setGw2Items(items)
        setGw2ItemsList(itemsList)
      }
    )
  }, [])

  const { darkmode } = useTypedSelector((state) => state.user)
  const transition = useNavigation()
  const result = useActionData<ResponseType>()
  const [searchMode, setSearchMode] = useState<SearchMode>('name')
  const [itemName, setItemName] = useState<string>('')
  const [itemId, setItemId] = useState<string>('')
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (result && 'exception' in result) {
      setError(`Server Error: ${result.exception}`)
    } else if (result && 'data' in result) {
      setError(undefined)
    }
  }, [result])

  const handleSelect = (value: string) => {
    if (searchMode === 'name') {
      setItemName(value)
      const id = getItemIDByName(value.trim(), gw2Items)
      if (id) {
        setItemId(id)
      } else {
        setItemId('')
      }
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setItemId(value)
    if (value) {
      const name = getItemNameById(value, gw2Items)
      if (name) {
        setItemName(name)
      } else {
        setItemName('')
      }
    } else {
      setItemName('')
    }
    if (error) {
      setError(undefined)
    }
  }

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !itemId) {
      e.preventDefault()
      return
    }
  }

  const listing = result && 'data' in result ? result.data : undefined
  const loading = transition.state === 'submitting'
  const canSubmit = !!itemId && !loading

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
            disabled={!canSubmit}
            error={error}>
            <div className="pt-3 flex flex-col gap-4">
              <RadioButtons
                title="Search by"
                name="search-mode"
                radioOptions={[
                  { label: 'Item Name', value: 'name' },
                  { label: 'Item ID', value: 'id' }
                ]}
                defaultChecked={searchMode}
                onChange={(value) => {
                  setSearchMode(value as SearchMode)
                  setItemName('')
                  setItemId('')
                  setError(undefined)
                }}
              />

              {searchMode === 'name' ? (
                <>
                  <DebouncedSelectInput
                    title="Item to search for"
                    label="Item"
                    id="gw2-item-select"
                    selectOptions={gw2ItemsList}
                    onSelect={handleSelect}
                    displayValue={itemName}
                    tooltip="Search for a Guild Wars 2 item to view detailed trading post data"
                  />
                  <input type="hidden" name="itemId" value={itemId} />
                </>
              ) : (
                <div className="flex flex-col">
                  <label
                    htmlFor="item-id-input"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Item ID
                  </label>
                  <input
                    id="item-id-input"
                    name="itemId"
                    type="number"
                    value={itemId}
                    onChange={handleIdChange}
                    placeholder="Enter item ID"
                    className="p-2 w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100 dark:bg-gray-600"
                  />
                  {itemName && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Item: {itemName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </SmallFormContainer>
        </div>
      </ContentContainer>

      {/* Item Data Display */}
      {listing && !loading && (
        <ItemDataDisplay
          listing={listing}
          darkmode={darkmode}
          isDetailed={true}
        />
      )}
    </PageWrapper>
  )
}
