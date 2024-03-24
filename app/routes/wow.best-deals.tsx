import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
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
import { ItemClassSelect } from '~/components/form/WoW/WoWScanForm'
import {
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'

const PAGE_URL = '/wow/best-deals'

const defaultFormValues = {
  type: 'df',
  discount: '90',
  minPrice: '2000',
  salesPerDay: '1.1',
  itemClass: '-1',
  itemSubClass: '-1'
}

const inputMap: Record<string, string> = {
  discount: 'Discount Percentage',
  minPrice: 'Minimum TSM Average Price',
  salesPerDay: 'Sales Per Day',
  itemClass: 'Item Class',
  itemSubClass: 'Item Subclass'
}

const validateInput = z.object({
  type: z.string(),
  discount: parseStringToNumber,
  minPrice: parseStringToNumber,
  salesPerDay: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  itemClass: parseStringToNumber,
  itemSubClass: parseStringToNumber
})

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const values = {
    type: params.get('type') || defaultFormValues.type,
    discount: params.get('discount') || defaultFormValues.discount,
    minPrice: params.get('minPrice') || defaultFormValues.minPrice,
    salesPerDay: params.get('salesPerDay') || defaultFormValues.salesPerDay,
    itemClass: params.get('itemClass') || defaultFormValues.itemClass,
    itemSubClass: params.get('itemSubClass') || defaultFormValues.itemSubClass
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
    ...loaderData,
    itemClass: loaderData.itemClass, // Ensure itemClass is 'all' if not provided
    itemSubClass: loaderData.itemSubClass // Ensure itemSubClass is 'all' if not provided
  })
  const error = result && 'exception' in result ? result.exception : undefined

  useEffect(() => {
    const updatedSearchParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      updatedSearchParams.set(key, value)
    })
    window.history.pushState(
      {},
      '',
      `${PAGE_URL}?${updatedSearchParams.toString()}`
    )
  }, [searchParams])

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
    console.log(`Updating ${name} to ${value}`)
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
    handleSearchParamChange(name, value)
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
        <div className="pt-3 flex flex-col">
          <Select
            title="Item Type"
            name="type"
            defaultValue={searchParams.type}
            options={[
              { label: 'Dragonflight Only', value: 'df' },
              { label: 'Pets Only', value: 'pets' },
              { label: 'Legacy Only', value: 'legacy' },
              { label: 'All', value: 'all' }
            ]}
            onChange={(e) => handleFormChange('type', e.target.value)}
          />
          <ItemClassSelect
            itemClass={+searchParams.itemClass}
            itemSubClass={+searchParams.itemSubClass}
            onChange={(itemClassValue, itemSubClassValue) => {
              handleFormChange('itemClass', String(itemClassValue))
              handleFormChange('itemSubClass', String(itemSubClassValue))
            }}
          />
          <InputWithLabel
            labelTitle="Discount Percentage"
            name="discount"
            type="number"
            defaultValue={searchParams.discount}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFormChange('discount', e.currentTarget.value)
            }
          />
          <InputWithLabel
            labelTitle="Minimum TSM Average Price"
            name="minPrice"
            type="number"
            defaultValue={searchParams.minPrice}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFormChange('minPrice', e.currentTarget.value)
            }
          />
          <InputWithLabel
            labelTitle="Sales Per Day"
            name="salesPerDay"
            type="number"
            defaultValue={searchParams.salesPerDay}
            step={0.1}
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
    columnId: 'link',
    header: 'Item Link',
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
