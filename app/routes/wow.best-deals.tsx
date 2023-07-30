import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { DealItem, WoWDealResponse } from '~/requests/WoW/BestDeals'
import WoWBestDeals from '~/requests/WoW/BestDeals'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import { useActionData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Select from '~/components/form/select'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'

const parseNumber = z.string().transform((value) => parseInt(value, 10))

const validateInput = z.object({
  type: z.string(),
  discount: parseNumber,
  minPrice: parseNumber,
  salesPerDay: z.string().transform((value) => parseFloat(value))
})

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const region = session.getWoWSessionData().region

  const formData = Object.fromEntries(await request.formData())

  const validatedFormData = validateInput.safeParse(formData)
  if (!validatedFormData.success) {
    return json({ exception: 'Invalid Input' })
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
  const result = useActionData<ActionResponseType>()
  const transistion = useNavigation()

  const isSubmitting = transistion.state === 'submitting'

  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href="/wow/best-deals" />
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
        title="Best Deals"
        description="Find the best deals on your server and region wide with our Best Deals search!"
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}>
        <div className="pt-3 flex flex-col">
          <Select
            title="Item Type"
            name="type"
            defaultValue={'df'}
            options={[
              { label: 'Dragonflight Only', value: 'df' },
              { label: 'Pets Only', value: 'pets' },
              { label: 'Legacy Only', value: 'legacy' },
              { label: 'All', value: 'all' }
            ]}
          />
          <InputWithLabel
            labelTitle="Discount Percentage"
            name="discount"
            type="number"
            defaultValue={90}
            min={0}
          />
          <InputWithLabel
            labelTitle="Minimum TSM Average Price"
            name="minPrice"
            type="number"
            defaultValue={3000}
            min={0}
          />
          <InputWithLabel
            labelTitle="Sales Per Day"
            name="salesPerDay"
            type="number"
            defaultValue={1.1}
            step={0.1}
            min={0}
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
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<DealItem>> = [
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'salesPerDay', header: 'Sales Per Day' },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'historicPrice', header: 'Historic Price' },
  {
    columnId: 'link',
    header: 'Item Link',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'realmName',
    header: 'Realm Name',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  }
]

const mobileColumnList: Array<ColumnList<DealItem>> = [
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'itemName', header: 'Item Name' }
]
