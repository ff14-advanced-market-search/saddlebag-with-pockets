import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { useActionData, useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CheckBox from '~/components/form/CheckBox'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import Select from '~/components/form/select'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import type {
  CraftingListData,
  CraftingListInput,
  CraftingListRepsonse,
  FlatCraftingList
} from '~/requests/FFXIV/crafting-list'
import {
  costMetrics,
  costMetricLabels,
  revenueMetricLabels,
  revenueMetrics
} from '~/requests/FFXIV/crafting-list'
import CraftingList from '~/requests/FFXIV/crafting-list'
import { getUserSessionData } from '~/sessions'

const flattenResult = ({
  hq,
  itemData,
  itemID,
  itemName,
  profitEst,
  soldPerWeek,
  universalisLink,
  yieldsPerCraft,
  costEst,
  revenueEst
}: CraftingListData): FlatCraftingList => ({
  itemID,
  itemName,
  hq,
  itemData,
  profitEst,
  soldPerWeek,
  universalisLink,
  yieldsPerCraft,
  ...costEst,
  ...revenueEst
})

// export const loader: LoaderFunction = async ({ request }) => {}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const input: CraftingListInput = {
    homeServer: session.getWorld(),
    costMetric: 'material_median_cost',
    revenueMetric: 'revenue_home_min_listing',
    salesPerWeek: 10,
    medianSalePrice: 100000,
    maxMaterialCost: 50000,
    jobs: [0, 8, 9],
    filters: [0],
    stars: -1,
    lvlLowerLimit: -1,
    lvlUpperLimit: 91,
    yields: -1,
    hideExpertRecipes: true
  }

  return CraftingList(input)
}

type ActionResponse = CraftingListRepsonse | { exception: string } | {}
export default function Index() {
  // const loaderData = useLoaderData<ActionResponse>()
  const actionData = useActionData<ActionResponse>()

  const showNoResults = actionData && !Object.keys(actionData).length

  const flatData = useMemo(() => {
    return !showNoResults && actionData && 'data' in actionData
      ? actionData.data.map(flattenResult)
      : undefined
  }, [actionData, showNoResults])

  return (
    <PageWrapper>
      <Title title="Crafting List" />
      {showNoResults && <NoResults href="/ffxiv/crafting-list" />}
      {flatData && <Results data={flatData} />}
      {!flatData && (
        <SmallFormContainer onClick={() => {}} title="input some stuff">
          <div className="pt-2">
            <Select
              title="Cost Metric"
              defaultValue={'material_median_cost'}
              options={costMetrics.map((value) => ({
                value,
                label: costMetricLabels[value]
              }))}
              name="costMetric"
            />
            <Select
              title="Revenue Metric"
              defaultValue={'material_median_cost'}
              options={revenueMetrics.map((value) => ({
                value,
                label: revenueMetricLabels[value]
              }))}
              name="revenueMetric"
            />
            <InputWithLabel
              labelTitle="Sales Per Week"
              name="salesPerWeek"
              type="number"
            />
            <InputWithLabel
              labelTitle="Median Sale Price"
              name="medianSalePrice"
              type="number"
            />
            <InputWithLabel
              labelTitle="Max Material Cost"
              name="maxMaterialCost"
              type="number"
            />
            <InputWithLabel
              labelTitle="Minimum Recipe Stars"
              name="stars"
              type="number"
            />
            <InputWithLabel
              labelTitle="Lower Level Limit"
              name="lvlLowerLimit"
              type="number"
            />
            <InputWithLabel
              labelTitle="Upper Level Limit"
              name="lvlUpperLimit"
              type="number"
            />
            <InputWithLabel
              labelTitle="Yield per recipie"
              name="yields"
              type="number"
            />
            <div className="mt-2">
              <CheckBox
                labelTitle="Hide Expert Recipes"
                name="hideExpertRecipes"
              />
            </div>
            <Select
              title="Disciples of the Hand"
              name="jobs"
              options={dOHOptions}
            />
          </div>
        </SmallFormContainer>
      )}
    </PageWrapper>
  )
}

const Results = ({ data }: { data: Array<FlatCraftingList> }) => {
  return (
    <PageWrapper>
      <SmallTable
        data={data}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'profitEst',
          'soldPerWeek',
          'revenue_avg',
          'revenue_region_min_listing',
          'material_min_listing_cost',
          'material_avg_cost'
        ]}
        sortingOrder={[{ id: 'profitEst', desc: true }]}
      />
    </PageWrapper>
  )
}

const mobileColumnList = [
  { columnId: 'itemName', header: 'Item name' },
  { columnId: 'profitEst', header: 'Profit Est.' }
]

const columnList: Array<ColumnList<FlatCraftingList>> = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'profitEst', header: 'Profit Est.' },
  { columnId: 'yieldsPerCraft', header: 'Yield' },
  { columnId: 'soldPerWeek', header: 'Sales Per Week' },
  {
    columnId: 'revenue_avg',
    header: 'Revenue Average'
  },
  {
    columnId: 'revenue_region_min_listing',
    header: 'Revenue Min Listing'
  },
  {
    columnId: 'material_min_listing_cost',
    header: 'Cost Minimum Listing'
  },
  {
    columnId: 'material_avg_cost',
    header: 'Cost Estimage Average'
  },
  {
    columnId: 'hq',
    header: 'High Quality',
    accessor: ({ row: { hq } }) => <p>{hq ? 'Yes' : 'No'}</p>
  },
  {
    columnId: 'itemDataLink',
    header: 'Item Data',
    accessor: ({ row: { itemData } }) => <ItemDataLink link={itemData} />
  },
  {
    columnId: 'universalisLink',
    header: 'Universalis',
    accessor: ({ row: { universalisLink } }) => (
      <UniversalisBadgedLink link={universalisLink} />
    )
  }
]

const dOHOptions = [
  { value: '8', label: 'Carpenter' },
  { value: '9', label: 'Blacksmith' },
  { value: '10', label: 'Armorer' },
  { value: '11', label: 'Goldsmith' },
  { value: '12', label: 'Leatherworker' },
  { value: '13', label: 'Weaver' },
  { value: '14', label: 'Alchemist' },
  { value: '15', label: 'Culinarian' },
  { value: '0', label: 'Omnicrafter with max in all jobs' }
]
