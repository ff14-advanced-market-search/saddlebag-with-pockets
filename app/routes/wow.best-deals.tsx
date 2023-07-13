import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
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

const parseNumber = z.string().transform((value) => parseInt(value, 10))

const validateInput = z.object({
  type: z.string(),
  discount: parseNumber,
  minPrice: parseNumber,
  salesPerDay: parseNumber
})

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  console.log(session)

  const region = session.getWoWSessionData().region
  console.log(region)

  const formData = Object.fromEntries(await request.formData())
  console.log(formData)

  const validatedFormData = validateInput.safeParse(formData)
  if (!validatedFormData.success) {
    return json({ exception: 'Invalid Input' })
  }

  const result = await WoWBestDeals({
    region,
    ...validatedFormData.data
  })
  console.log(result)

  return json({ ...(await result.json()) })
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
            defaultValue={1}
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
        description="LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA."
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'minPrice',
          'itemQuantity',
          'realmPopulationReal',
          'realmRanking'
        ]}
        data={data}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<DealItem>> = [
  { columnId: 'connectedRealmID', header: 'Realm ID' },
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'historicPrice', header: 'Historic Price' },
  { columnId: 'itemID', header: 'Item ID' },
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'link', header: 'Item Link' },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'realmName', header: 'Realm Name' },
  { columnId: 'salesPerDay', header: 'Sales Per Day' }
]
const mobileColumnList: Array<ColumnList<DealItem>> = [
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'itemName', header: 'Item Name' }
]
