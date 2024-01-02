import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ListItem, WoWListResponse } from '~/requests/WoW/ShoppingList'
import WoWShoppingList from '~/requests/WoW/ShoppingList'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import { useActionData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'

const inputMap: Record<string, string> = {
  maxPurchasePrice: 'Maximum Purchase Price'
}

const validateInput = z.object({
  itemID: parseStringToNumber,
  maxPurchasePrice: parseStringToNumber
})

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const region = session.getWoWSessionData().region

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

  const result = await WoWShoppingList({
    region,
    ...validatedFormData.data
  })

  // await the result and then return the json

  return json({
    ...(await result.json()),
    sortby: 'discount'
  })
}

type ActionResponseType =
  | {}
  | { exception: string }
  | (WoWListResponse & { sortby: string })

const ShoppingList = () => {
  const result = useActionData<ActionResponseType>()
  const transistion = useNavigation()
  const [itemName, setItemName] = useState<string>('')

  const isSubmitting = transistion.state === 'submitting'

  const handleSelect = (value: string) => {
    setItemName(value)
  }

  const itemId = getItemIDByName(itemName.trim(), wowItems)
  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href="/wow/shopping-list" />
  }

  if (result && 'data' in result && !error) {
    return <Results {...result} />
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Shopping List"
        description="Search for the realms with the lowest price for an item."
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
        hideSubmitButton={!itemId}>
        <div className="pt-3 flex flex-col">
          <DebouncedSelectInput
            title={'Item to search for'}
            label="Item"
            id="export-item-select"
            selectOptions={wowItemsList}
            onSelect={handleSelect}
          />
          <input hidden name="itemID" value={itemId} />
          <InputWithLabel
            labelTitle="Maximum Purchase Price"
            name="maxPurchasePrice"
            type="number"
            defaultValue={10000000}
            min={0}
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
