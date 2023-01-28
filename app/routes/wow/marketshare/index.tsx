import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type { ItemStats } from '~/requests/WoW/ItemStatLookup'
import WoWStatLookup from '~/requests/WoW/ItemStatLookup'
import { z } from 'zod'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type {
  WoWLoaderData,
  WoWServerData,
  WoWServerRegion
} from '~/requests/WoW/types'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import CheckBox from '~/components/form/CheckBox'
import { ToolTip } from '~/components/Common/InfoToolTip'
import type { ColumnList } from '../full-scan/SmallTable'
import FullTable from '~/components/Tables/FullTable'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import type { TreemapNode } from '~/components/Charts/Treemap'
import TreemapChart from '~/components/Charts/Treemap'
import { getUserSessionData } from '~/sessions'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { useState } from 'react'
import { RadioButtons } from '~/components/Common/RadioButtons'

const inputMap: Record<string, string> = {
  homeRealmId: 'Home Realm',
  region: 'Region',
  commodity: 'Commodity Items',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemQuality: 'Quality',
  requiredLevel: 'Required Level',
  itemClass: 'Item Class',
  itemSubclass: 'Item Sub Class',
  iLvl: 'iLevel'
}

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  formPayload.commodity = formPayload.commodity || 'off'

  const validateFormData = z.object({
    homeRealmId: z
      .string()
      .min(1)
      .transform((value) => parseInt(value.split('---')[0], 10)),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    commodity: z.string().transform((value) => value === 'on'),
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    itemQuality: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    requiredLevel: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemSubClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    iLvl: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

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

  const data = await (await WoWStatLookup(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({
    ...data,
    serverName: (formPayload.homeRealmId as string).split('---')[1],
    region: validInput.data.region,
    commodity: validInput.data.commodity
  })
}

const ItemStatLookupForm = ({
  desiredPriceDefault = 0,
  desiredSalesDefault = 10,
  regionDefault = 'NA',
  iLvlDefault = -1,
  requiredLevelDefault = -1,
  commodityDefault = true,
  homeRealm
}: {
  desiredPriceDefault?: number
  desiredSalesDefault?: number
  regionDefault?: WoWServerRegion
  iLvlDefault?: number
  requiredLevelDefault?: number
  commodityDefault?: boolean
  homeRealm: WoWServerData
}) => {
  return (
    <div className="pt-2 md:pt-4">
      <InputWithLabel
        defaultValue={desiredPriceDefault}
        type="number"
        labelTitle="Minimum Desired average price"
        inputTag="Gold"
        name="desiredAvgPrice"
        min={0.0}
        step={0.01}
      />
      <InputWithLabel
        defaultValue={desiredSalesDefault}
        type="number"
        labelTitle="Minimum Desired sales per day"
        inputTag="Sales"
        name="desiredSalesPerDay"
        min={0}
        step={1}
      />
      <RegionAndServerSelect
        region={regionDefault}
        defaultRealm={homeRealm}
        serverSelectFormName="homeRealmId"
      />
      <ItemClassSelect />
      <ItemQualitySelect />
      <InputWithLabel
        defaultValue={iLvlDefault}
        type="number"
        labelTitle="Minimum Item Level (ilvl)"
        inputTag="Level"
        name="iLvl"
        min={-1}
      />
      <InputWithLabel
        defaultValue={requiredLevelDefault}
        type="number"
        labelTitle="Minimum Required Level"
        inputTag="Level"
        name="requiredLevel"
        min={-1}
        max={70}
      />
      <div className="my-2 relative flex">
        <CheckBox
          id="commodity"
          labelTitle="Commodity items"
          name="commodity"
          defaultChecked={commodityDefault}
          labelClassName="block text-sm font-medium text-gray-700 dark:text-grey-100"
        />
        <div className="ml-2">
          <ToolTip data="If checked the results will contain commodity items" />
        </div>
      </div>
    </div>
  )
}

const tableSortOrder = [
  'itemName',
  'currentMarketValue',
  'historicMarketValue',
  'percentChange',
  'state',
  'salesPerDay',
  'minPrice',
  'historicPrice',
  'avgQuantity',
  'currentQuantity',
  'currentVsAvgQuantityPercent',
  'itemID',
  'item_subclass',
  'item_class'
]

const Index = () => {
  const transition = useTransition()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()

  const [colorValue, setColorValue] = useState<'state' | 'quantityState'>(
    'state'
  )

  const [currentMarketValue, setCurrentMarketValue] = useState(true)

  const results = useActionData<
    | {
        data: Array<ItemStats>
        serverName: string
        chartData: Array<TreemapNode>
        region: WoWServerRegion
        commodity: boolean
      }
    | { exception: string }
    | {}
  >()
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = 'Dragonflight Auction House Marketshare Overview'

  if (results && 'data' in results) {
    if (!results.data.length) {
      return (
        <PageWrapper>
          <h1>No results</h1>
        </PageWrapper>
      )
    }

    const OribosLink = getOribosLink(
      results.serverName,
      'Oribos',
      results.region
    )

    const hideHistory = currentMarketValue || !results.commodity

    const chartData = hideHistory
      ? getChartData(results.data, colorValue)
      : getHistoryChartData(results.data, colorValue)

    const currentMarketOptions = results.commodity
      ? [
          {
            label: 'Current Market Value',
            value: 'currentMarketValue'
          },
          {
            label: 'Historic Market Value',
            value: 'historicMarketValue'
          }
        ]
      : [
          {
            label: 'Current Market Value',
            value: 'currentMarketValue'
          }
        ]

    const itemsColumnList: Array<ColumnList<ItemStats>> = [
      { columnId: 'itemName', header: 'Item Name' },
      { columnId: 'minPrice', header: 'Minimum Price' },
      { columnId: 'currentMarketValue', header: 'Current Market Value' },
      { columnId: 'historicMarketValue', header: 'Historic Market Value' },
      {
        columnId: 'percentChange',
        header: 'Percent Changed',
        accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
      },
      {
        columnId: 'state',
        header: 'Market State'
      },
      { columnId: 'historicPrice', header: 'Historic Price' },
      { columnId: 'item_class', header: 'Item Class' },
      { columnId: 'item_subclass', header: 'Item Sub Class' },
      { columnId: 'itemID', header: 'Oribos Link', accessor: OribosLink },
      { columnId: 'salesPerDay', header: 'Sales Per Day' },
      {
        columnId: 'avgQuantity',
        header: 'Average Quantity'
      },
      {
        columnId: 'currentQuantity',
        header: 'Current Quantity'
      },
      {
        columnId: 'currentVsAvgQuantityPercent',
        header: 'Curr v Avg Quantity',
        accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
      }
    ]

    return (
      <div>
        <Title title={pageTitle} />
        <div className="px-2 sm:px-4 my-2 sm:my-4">
          <ContentContainer>
            <>
              <TreemapChart
                chartData={chartData}
                title="Marketshare Visualisation"
              />
              <RadioButtons
                title={'Market values to show'}
                name="valuesToShow"
                radioOptions={currentMarketOptions}
                defaultChecked={
                  hideHistory ? 'currentMarketValue' : 'historicMarketValue'
                }
                onChange={() => {
                  setCurrentMarketValue((state) => !state)
                }}
              />
              <RadioButtons
                title="Color Visualisation"
                name="chartColor"
                radioOptions={[
                  { label: 'Market Value', value: 'state' },
                  { label: 'Market Quantity', value: 'quantityState' }
                ]}
                defaultChecked={colorValue}
                onChange={(value) => {
                  if (value === 'state' || value === 'quantityState') {
                    setColorValue(value)
                  }
                }}
              />
            </>
          </ContentContainer>
        </div>
        <FullTable<ItemStats>
          data={results.data}
          columnList={itemsColumnList}
          sortingOrder={[{ id: 'currentMarketValue', desc: true }]}
          description="This shows items market statistics!"
          order={tableSortOrder}
        />
      </div>
    )
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
        <ItemStatLookupForm regionDefault={wowRegion} homeRealm={wowRealm} />
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

const hexMap = {
  crashing: '#b40606',
  decreasing: '#d88888',
  stable: '#ccbb00',
  increasing: '#81AC6D',
  spiking: '#24b406'
}

const getHistoryChartData = (
  marketplaceOverviewData: Array<ItemStats>,
  colorValue: 'state' | 'quantityState' = 'state'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = [
    {
      id: 'historicMarketValue',
      name: 'Historic Market Value',
      toolTip: `Historic Market: ${marketplaceOverviewData
        .reduce((total, curr) => total + curr.historicMarketValue, 0)
        .toLocaleString()}`
    }
  ]

  marketplaceOverviewData.forEach((current) => {
    const base = {
      id: current.itemID.toString(),
      name: current.itemName,
      color: hexMap[current[colorValue]]
    }

    const historicMarketValue = {
      ...base,
      parent: 'historicMarketValue',
      value: current.historicMarketValue,
      toolTip: `${base.name}: ${current.historicMarketValue.toLocaleString()}`
    }
    result.push(historicMarketValue)
  })

  return result
}

const getChartData = (
  marketplaceOverviewData: Array<ItemStats>,
  colorValue: 'state' | 'quantityState' = 'state'
): Array<TreemapNode> => {
  const result: Array<TreemapNode> = [
    {
      id: 'historicMarketValue',
      name: 'Historic Market Value',
      toolTip: `Historic Market: ${marketplaceOverviewData
        .reduce((total, curr) => total + curr.historicMarketValue, 0)
        .toLocaleString()}`,
      value: 1
    }
  ]

  marketplaceOverviewData.forEach((current) => {
    const base = {
      id: current.itemID.toString(),
      name: current.itemName,
      color: hexMap[current[colorValue]]
    }

    const currentMarketValue = {
      ...base,
      parent: 'currentMarketValue',
      value: current.currentMarketValue,
      toolTip: `${base.name}: ${current.currentMarketValue.toLocaleString()}`
    }
    result.push(currentMarketValue)
  })

  return result
}
