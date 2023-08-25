import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import z from 'zod'
import { useMemo } from 'react'
import { PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CheckBox from '~/components/form/CheckBox'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'
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
import {
  createUnionSchema,
  parseCheckboxBoolean,
  parseStringToNumber,
  parseStringToNumberArray,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import DoHFilter from '~/components/form/ffxiv/DoHFilter'

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

const validateFormInput = z.object({
  costMetric: createUnionSchema(costMetrics),
  revenueMetric: createUnionSchema(revenueMetrics),
  salesPerWeek: parseStringToNumber,
  medianSalePrice: parseStringToNumber,
  maxMaterialCost: parseStringToNumber,
  jobs: parseStringToNumberArray,
  filters: parseStringToNumberArray,
  stars: parseStringToNumber,
  lvlLowerLimit: parseStringToNumber,
  lvlUpperLimit: parseStringToNumber,
  yields: parseStringToNumber,
  hideExpertRecipes: parseCheckboxBoolean
})

const defaultFormValues = {
  costMetric: 'material_median_cost' as const,
  revenueMetric: 'revenue_home_min_listing' as const,
  salesPerWeek: 30,
  medianSalePrice: 70000,
  maxMaterialCost: 100000000,
  jobs: [0, 8, 9],
  filters: [0],
  stars: -1,
  lvlLowerLimit: -1,
  lvlUpperLimit: 91,
  yields: -1,
  hideExpertRecipes: true
}

const inputMap = {
  costMetric: 'Cost Metric',
  revenueMetric: 'Revenue Metric',
  salesPerWeek: 'Sales Per Week',
  medianSalePrice: 'Median Sale Price',
  maxMaterialCost: 'Max Material Cost',
  jobs: 'Disciples of the Hand',
  filters: 'Filters',
  stars: 'Minimum Recipe Stars',
  lvlLowerLimit: 'Lower Level Limit',
  lvlUpperLimit: 'Upper Level Limit',
  yields: 'Yield per recipie',
  hideExpertRecipes: 'Hide Expert Recipes'
}

export const loader: LoaderFunction = async ({ request }) => {
  const defaults = defaultFormValues
  return json(defaults)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)
  const validInput = validateFormInput.safeParse(formPayload)

  if (!validInput.success) {
    console.log('bad input', formPayload)
    return json({
      exception: parseZodErrorsToDisplayString(validInput.error, inputMap)
    })
  }

  const input: CraftingListInput = {
    homeServer: session.getWorld(),
    ...validInput.data
  }

  console.log(JSON.stringify(input, null, 2))
  return CraftingList(input)
}

type ActionResponse = CraftingListRepsonse | { exception: string } | {}
export default function Index() {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const actionData = useActionData<ActionResponse>()
  const transition = useNavigation()
  const loading = transition.state === 'submitting'

  const showNoResults = actionData && !Object.keys(actionData).length

  const flatData = useMemo(() => {
    return !showNoResults && actionData && 'data' in actionData
      ? actionData.data.map(flattenResult)
      : undefined
  }, [actionData, showNoResults])

  const error =
    actionData && 'exception' in actionData ? actionData.exception : undefined

  return (
    <PageWrapper>
      <div className="mx-3 my-2">
        <Title title="Crafting List" />
      </div>
      {showNoResults && <NoResults href="/ffxiv/crafting-list" />}
      {flatData && <Results data={flatData} />}
      {!flatData && (
        <SmallFormContainer onClick={() => {}} error={error} loading={loading}>
          <div className="pt-2">
            <DoHFilter
              defaultValue={loaderData.jobs}
              options={dOHOptions}
              title={inputMap.jobs}
            />
            <ItemsFilter defaultFilters={loaderData.filters} />
            <Select
              title={inputMap.costMetric}
              defaultValue={loaderData.costMetric}
              options={costMetrics.map((value) => ({
                value,
                label: costMetricLabels[value]
              }))}
              name="costMetric"
            />
            <Select
              title={inputMap.revenueMetric}
              defaultValue={loaderData.revenueMetric}
              options={revenueMetrics.map((value) => ({
                value,
                label: revenueMetricLabels[value]
              }))}
              name="revenueMetric"
            />
            <InputWithLabel
              labelTitle={inputMap.salesPerWeek}
              defaultValue={loaderData.salesPerWeek}
              name="salesPerWeek"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.medianSalePrice}
              defaultValue={loaderData.medianSalePrice}
              name="medianSalePrice"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.maxMaterialCost}
              defaultValue={loaderData.maxMaterialCost}
              name="maxMaterialCost"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.stars}
              defaultValue={loaderData.stars}
              name="stars"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.lvlLowerLimit}
              defaultValue={loaderData.lvlLowerLimit}
              name="lvlLowerLimit"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.lvlUpperLimit}
              defaultValue={loaderData.lvlUpperLimit}
              name="lvlUpperLimit"
              type="number"
            />
            <InputWithLabel
              labelTitle={inputMap.yields}
              defaultValue={loaderData.yields}
              name="yields"
              type="number"
            />
            <div className="mt-2">
              <CheckBox
                labelTitle={inputMap.hideExpertRecipes}
                defaultChecked={loaderData.hideExpertRecipes}
                name="hideExpertRecipes"
              />
            </div>
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
  { value: 8, label: 'Carpenter' },
  { value: 9, label: 'Blacksmith' },
  { value: 10, label: 'Armorer' },
  { value: 11, label: 'Goldsmith' },
  { value: 12, label: 'Leatherworker' },
  { value: 13, label: 'Weaver' },
  { value: 14, label: 'Alchemist' },
  { value: 15, label: 'Culinarian' },
  { value: 0, label: 'Omnicrafter with max in all jobs' }
]
