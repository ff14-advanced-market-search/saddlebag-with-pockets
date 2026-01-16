import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { DealItem, WoWDealResponse } from '~/requests/WoW/BestDeals'
import WoWBestDeals from '~/requests/WoW/BestDeals'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Select from '~/components/form/select'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import {
  ItemClassSelect,
  ExpansionSelect
} from '~/components/form/WoW/WoWScanForm'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'

const PAGE_URL = '/wow/best-deals'

const defaultFormValues = {
  type: 'df',
  itemClass: '-1',
  itemSubClass: '-1',
  discount: '90',
  minPrice: '2000',
  salesPerDay: '1.1',
  expansionNumber: '-1'
}

const inputMap: Record<string, string> = {
  type: 'Item Type',
  itemClass: 'Item Class',
  itemSubClass: 'Item Subclass',
  discount: 'Discount Percentage',
  minPrice: 'Minimum TSM Average Price',
  salesPerDay: 'Sales Per Day',
  expansionNumber: 'WoW Expansion'
}

const validateInput = z.object({
  type: z.string(),
  itemClass: parseStringToNumber,
  itemSubClass: parseStringToNumber,
  discount: parseStringToNumber,
  minPrice: parseStringToNumber,
  salesPerDay: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  expansionNumber: parseStringToNumber
})

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { viewport: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: WoW Auctionhouse Best Deals' },
    {
      name: 'description',
      content:
        'Find the best deals on every auctionhouse region wide with our WoW Best Deals search!'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/wow/best-deals'
    }
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const values = {
    type: params.get('type') || defaultFormValues.type.toString(),
    itemClass:
      params.get('itemClass') || defaultFormValues.itemClass.toString(),
    itemSubClass:
      params.get('itemSubClass') || defaultFormValues.itemSubClass.toString(),
    discount: params.get('discount') || defaultFormValues.discount.toString(),
    minPrice: params.get('minPrice') || defaultFormValues.minPrice.toString(),
    salesPerDay:
      params.get('salesPerDay') || defaultFormValues.salesPerDay.toString(),
    expansionNumber:
      params.get('expansionNumber') ||
      defaultFormValues.expansionNumber.toString()
  }
  const validParams = validateInput.safeParse(values)
  if (!validParams.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validParams.error, inputMap)
    })
  }
  return json(validParams.data)
}

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

  const result = await WoWBestDeals({
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
  | (WoWDealResponse & { sortby: string })

const BestDeals = () => {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const result = useActionData<ActionResponseType>()
  const transistion = useNavigation()

  const isSubmitting = transistion.state === 'submitting'

  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })
  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href={PAGE_URL} />
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

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Best Deals"
        description="Find the best deals on your server and region wide with our Best Deals search!"
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
        action={getActionUrl(PAGE_URL, searchParams)}>
        <div className="pt-2">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
        </div>
        <div className="pt-3 flex flex-col">
          <Select
            title="Item Type"
            name="type"
            defaultValue={loaderData.type}
            options={[
              { label: 'Current Content', value: 'df' },
              { label: 'Pets Only', value: 'pets' },
              { label: 'Legacy Only', value: 'legacy' },
              { label: 'All', value: 'all' }
            ]}
            onChange={(e) => handleFormChange('type', e.target.value)}
          />
          <ExpansionSelect
            defaultValue={loaderData.expansionNumber}
            onChange={(value) => handleFormChange('expansionNumber', value)}
          />
          <ItemClassSelect
            itemClass={parseInt(loaderData.itemClass)}
            itemSubClass={parseInt(loaderData.itemSubClass)}
            onChange={(itemClassValue, itemSubClassValue) => {
              handleFormChange('itemClass', itemClassValue.toString())
              handleFormChange('itemSubClass', itemSubClassValue.toString())
            }}
          />
          <InputWithLabel
            labelTitle="Discount Percentage"
            name="discount"
            type="number"
            defaultValue={loaderData.discount}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFormChange('discount', e.currentTarget.value)
            }
          />
          <InputWithLabel
            labelTitle="Minimum TSM Average Price"
            name="minPrice"
            type="number"
            defaultValue={loaderData.minPrice}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFormChange('minPrice', e.currentTarget.value)
            }
          />
          <InputWithLabel
            labelTitle="Sales Per Day"
            name="salesPerDay"
            type="number"
            defaultValue={loaderData.salesPerDay}
            step={0.01}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFormChange('salesPerDay', e.currentTarget.value)
            }
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default BestDeals

const Results = ({ data, sortby }: WoWDealResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <PageWrapper>
      <SmallTable
        title="Best Deals"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'discount',
          'salesPerDay',
          'minPrice',
          'historicPrice'
        ]}
        data={data}
        csvOptions={{
          filename: 'saddlebag-best-deals.csv',
          columns: [
            { title: 'Item ID', value: 'itemID' },
            { title: 'Item Name', value: 'itemName' },
            { title: 'Min Price', value: 'minPrice' },
            { title: 'Historic Price', value: 'historicPrice' },
            { title: 'Min Price', value: 'Sales Per Day' },
            { title: 'Discount', value: 'discount' },
            { title: 'Realm', value: 'realmName' },
            { title: 'Connected Realm ID', value: 'connectedRealmId' }
          ]
        }}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<DealItem>> = [
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'realmName',
    header: 'Realm Name',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.realmName}
      </p>
    )
  },
  {
    columnId: 'exportLink',
    header: 'Where to Sell',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  {
    columnId: 'link',
    header: 'Undermine Link',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'salesPerDay', header: 'Sales Per Day' },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'historicPrice', header: 'Historic Price' }
]

const mobileColumnList: Array<ColumnList<DealItem>> = [
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'itemName', header: 'Item Name' }
]
