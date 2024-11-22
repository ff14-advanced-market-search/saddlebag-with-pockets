import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ListItem, WoWListResponse } from '~/requests/WoW/ShoppingList'
import WoWShoppingList from '~/requests/WoW/ShoppingList'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import {
  useActionData,
  useNavigation,
  useSearchParams,
  useLoaderData
} from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName, getItemNameById } from '~/utils/items'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'

const PAGE_URL = '/wow/shopping-list'

const inputMap: Record<string, string> = {
  itemID: 'Item ID',
  maxPurchasePrice: 'Maximum Purchase Price'
}

const validateInput = z.object({
  itemID: parseStringToNumber,
  maxPurchasePrice: parseStringToNumber
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: wow shopping list',
    description:
      'See the wow listings across all realms on one page ordered by price'
  }
}

// Overwrite default links in the root.tsx
export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/wow/shopping-list'
  }
]

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const formData = Object.fromEntries(await request.formData())

  const validatedFormData = validateInput.safeParse(formData)
  if (!validatedFormData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(
        validatedFormData.error,
        inputMap
      )
    })
  }

  const region = session.getWoWSessionData().region

  const result = await WoWShoppingList({
    region,
    ...validatedFormData.data
  })

  return json({
    ...(await result.json()),
    sortby: 'discount'
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const params = url.searchParams

  const itemID = params.get('itemId')
  const maxPurchasePrice = params.get('maxPurchasePrice') || '10000000'

  if (itemID) {
    const validateInput = z.object({
      itemID: parseStringToNumber,
      maxPurchasePrice: parseStringToNumber
    })

    const formData = { itemID, maxPurchasePrice }
    const validatedFormData = validateInput.safeParse(formData)
    if (!validatedFormData.success) {
      return json({
        exception: parseZodErrorsToDisplayString(
          validatedFormData.error,
          inputMap
        )
      })
    }

    const session = await getUserSessionData(request)
    const region = session.getWoWSessionData().region

    const result = await WoWShoppingList({
      region,
      ...validatedFormData.data
    })

    return json({
      ...(await result.json()),
      sortby: 'discount',
      formValues: validatedFormData.data
    })
  }

  return json({})
}

type LoaderResponseType =
  | {}
  | { exception: string }
  | (WoWListResponse & {
      sortby: string
      formValues: { itemID: number; maxPurchasePrice: number }
    })

type ActionResponseType =
  | {}
  | { exception: string }
  | (WoWListResponse & { sortby: string })

const ShoppingList = () => {
  const actionData = useActionData<ActionResponseType>()
  const loaderData = useLoaderData<LoaderResponseType>()
  const [searchParams] = useSearchParams()
  const result = actionData ?? loaderData
  const transition = useNavigation()
  const [itemName, setItemName] = useState<string>('')
  const [maxPurchasePrice, setMaxPurchasePrice] = useState<string>('10000000')
  const [itemID, setItemID] = useState<string>('')

  const isSubmitting = transition.state === 'submitting'

  const error = result && 'exception' in result ? result.exception : undefined

  useEffect(() => {
    const itemIdFromUrl = searchParams.get('itemId')
    const maxPurchasePriceFromUrl =
      searchParams.get('maxPurchasePrice') || '10000000'

    if (itemIdFromUrl) {
      const itemNameFromId = getItemNameById(itemIdFromUrl, wowItems)
      if (itemNameFromId) {
        setItemName(itemNameFromId)
        setItemID(itemIdFromUrl)
      }
    } else {
      setItemName('')
      setItemID('')
    }
    setMaxPurchasePrice(maxPurchasePriceFromUrl)
  }, [searchParams])

  const handleSelect = (value: string) => {
    setItemName(value)
    const itemId = getItemIDByName(value.trim(), wowItems)
    if (itemId) {
      setItemID(itemId.toString())
    } else {
      setItemID('')
    }
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const hasSearched =
    actionData !== undefined || (loaderData && 'data' in loaderData)

  if (hasSearched) {
    if (error) {
      // Display the form with error message
      return (
        <PageWrapper>
          <SmallFormContainer
            title="Shopping List"
            description="Search for the realms with the lowest price for an item."
            onClick={handleSubmit}
            error={error}
            loading={isSubmitting}
            hideSubmitButton={!itemID}
            action={getActionUrl(PAGE_URL, {
              itemId: itemID,
              maxPurchasePrice
            })}>
            <div className="pt-3 flex flex-col">
              <DebouncedSelectInput
                title={'Item to search for'}
                label="Item"
                id="export-item-select"
                selectOptions={wowItemsList}
                onSelect={handleSelect}
                defaultValue={itemName}
              />
              <input hidden name="itemID" value={itemID} />
              <InputWithLabel
                labelTitle="Maximum Purchase Price"
                name="maxPurchasePrice"
                type="number"
                value={maxPurchasePrice}
                min={0}
                onChange={(e) => setMaxPurchasePrice(e.currentTarget.value)}
              />
            </div>
          </SmallFormContainer>
        </PageWrapper>
      )
    } else if (result && 'data' in result) {
      if (result.data && result.data.length > 0) {
        return <Results {...result} />
      } else {
        return <NoResults href={PAGE_URL} />
      }
    } else {
      return <NoResults href={PAGE_URL} />
    }
  }

  // If no search has been performed, display the form
  return (
    <PageWrapper>
      <SmallFormContainer
        title="Shopping List"
        description="Search for the realms with the lowest price for an item."
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
        hideSubmitButton={!itemID}
        action={getActionUrl(PAGE_URL, { itemId: itemID, maxPurchasePrice })}>
        <div className="pt-3 flex flex-col">
          <DebouncedSelectInput
            title={'Item to search for'}
            label="Item"
            id="export-item-select"
            selectOptions={wowItemsList}
            onSelect={handleSelect}
            defaultValue={itemName}
          />
          <input hidden name="itemID" value={itemID} />
          <InputWithLabel
            labelTitle="Maximum Purchase Price"
            name="maxPurchasePrice"
            type="number"
            value={maxPurchasePrice}
            min={0}
            onChange={(e) => setMaxPurchasePrice(e.currentTarget.value)}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default ShoppingList

const Results = ({
  data,
  sortby,
  name
}: WoWListResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <PageWrapper>
      <SmallTable
        title={'Best Deals for ' + name}
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={['price', 'quantity', 'realmNames', 'link']}
        data={data}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' },
  {
    columnId: 'realmNames',
    header: 'Realm Names',
    accessor: ({ getValue }) => (
      <p className="py-2 px-3 max-w-[200px] mx-auto overflow-x-scroll">
        {getValue() as string}
      </p>
    )
  },
  {
    columnId: 'link',
    header: 'Item Link',
    accessor: ({ getValue }) => (
      <ExternalLink link={getValue() as string} text="" />
    )
  }
]

const mobileColumnList: Array<ColumnList<ListItem>> = [
  { columnId: 'price', header: 'Price' },
  {
    columnId: 'realmNames',
    header: 'Realm Names',
    accessor: ({ getValue }) => (
      <p className="py-2 px-3 w-[200px] overflow-x-scroll">
        {getValue() as string}
      </p>
    )
  }
]
