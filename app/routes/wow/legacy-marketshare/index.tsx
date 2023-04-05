import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { z } from 'zod'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import Select from '~/components/form/Select'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import type {
  LegacyMarketshareResponse,
  LegacyMarketshareItem,
  LegacyMarketshareSortBy
} from '~/requests/WoW/LegacyMarketshare'
import LegacyMarketshare from '~/requests/WoW/LegacyMarketshare'
import type { WoWLoaderData } from '~/requests/WoW/types'
// import { useTypedSelector } from '~/redux/useTypedSelector'
import { getUserSessionData } from '~/sessions'

const inputMap: Record<string, string> = {
  homeRealmId: 'Home Realm',
  region: 'Region',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemClass: 'Item Class',
  itemSubclass: 'Item Sub Class',
  sortBy: 'Sort By'
}

const sortByOptions: Array<{ label: string; value: LegacyMarketshareSortBy }> =
  [
    { value: 'currentMarketValue', label: 'Current Market Value' },
    { value: 'historicMarketValue', label: 'Historic Market Value' },
    { value: 'historicPrice', label: 'Historic Price' },
    { value: 'minPrice', label: 'Minimum Price' },
    { value: 'percentChange', label: 'Percent Change' },
    { value: 'salesPerDay', label: 'Sales Per Day' }
  ]

const validateFormData = z.object({
  homeRealmId: z
    .string()
    .min(1)
    .transform((value) => parseInt(value.split('---')[0], 10)),
  desiredAvgPrice: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value) * 10000),
  desiredSalesPerDay: z
    .string()
    .min(1)
    .transform((value) => parseFloat(value)),
  itemClass: z
    .string()
    .min(1)
    .transform((value) => parseInt(value, 10)),
  itemSubClass: z
    .string()
    .min(1)
    .transform((value) => parseInt(value, 10)),
  sortBy: z.union([
    z.literal('currentMarketValue'),
    z.literal('historicMarketValue'),
    z.literal('historicPrice'),
    z.literal('minPrice'),
    z.literal('percentChange'),
    z.literal('percentCsalesPerDayhange')
  ])
})

const pageTitle = 'Legacy Item Marksetshare'

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  formPayload.commodity = formPayload.commodity || 'off'

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map((field) => inputMap[field] || 'Unknown input error')
        )
        .join(', ')}`
    })
  }

  const data = await (await LegacyMarketshare(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({ data })
}

const Index = () => {
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  //   const { darkmode } = useTypedSelector(({ user }) => user)
  const transition = useTransition()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const results = useActionData<
    LegacyMarketshareResponse | { exception: string } | {}
  >()

  if (results) {
    if (Object.keys(results).length === 0) {
      return (
        <PageWrapper>
          <NoResults href="/wow/legacy-marketshare" />
        </PageWrapper>
      )
    }

    if ('data' in results) {
      return <Results data={results.data} />
    }
  }

  const error =
    results && 'exception' in results ? results.exception : undefined

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <InputWithLabel
            defaultValue={1000}
            type="number"
            labelTitle="Minimum Desired average price"
            inputTag="Gold"
            name="desiredAvgPrice"
            min={0.0}
            step={0.01}
          />
          <InputWithLabel
            defaultValue={10}
            type="number"
            labelTitle="Minimum Desired sales per day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            step={1}
          />
          <ItemClassSelect />
          <ItemQualitySelect />
          <Select
            title="Sort Results By"
            options={sortByOptions}
            name="sortBy"
            id="sortBy"
          />
          <RegionAndServerSelect
            region={wowRegion}
            defaultRealm={wowRealm}
            serverSelectFormName="homeRealmId"
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

const Results = ({ data }: { data: Array<LegacyMarketshareItem> }) => {
  console.log(data)
  return (
    <PageWrapper>
      <Title title={pageTitle} />
    </PageWrapper>
  )
}
