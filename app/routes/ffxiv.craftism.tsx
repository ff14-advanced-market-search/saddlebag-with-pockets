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
import {
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'

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
  salesPerWeek: 40,
  medianSalePrice: 70000,
  maxMaterialCost: 100000000,
  jobs: [0],
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
  const params = new URL(request.url).searchParams

  const hideExpertRecipesParam = params.has('hideExpertRecipes')
    ? params.get('hideExpertRecipes')
    : defaultFormValues.hideExpertRecipes.toString()
  const hideExpertRecipes = hideExpertRecipesParam === 'true' ? 'on' : 'false'

  const values = {
    costMetric: params.get('costMetric') || defaultFormValues.costMetric,
    revenueMetric:
      params.get('revenueMetric') || defaultFormValues.revenueMetric,
    salesPerWeek:
      params.get('salesPerWeek') || defaultFormValues.salesPerWeek.toString(),
    medianSalePrice:
      params.get('medianSalePrice') ||
      defaultFormValues.medianSalePrice.toString(),
    maxMaterialCost:
      params.get('maxMaterialCost') ||
      defaultFormValues.maxMaterialCost.toString(),
    jobs: params.get('jobs') || defaultFormValues.jobs.join(','),
    filters: params.get('filters') || defaultFormValues.filters.join(','),
    stars: params.get('stars') || defaultFormValues.stars.toString(),
    lvlLowerLimit:
      params.get('lvlLowerLimit') || defaultFormValues.lvlLowerLimit.toString(),
    lvlUpperLimit:
      params.get('lvlUpperLimit') || defaultFormValues.lvlUpperLimit.toString(),
    yields: params.get('yields') || defaultFormValues.yields.toString(),
    hideExpertRecipes
  }
  const validParams = validateFormInput.safeParse(values)

  if (validParams.success) {
    return json(validParams.data)
  }

  return json(defaultFormValues)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)
  const validInput = validateFormInput.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validInput.error, inputMap)
    })
  }

  const input: CraftingListInput = {
    homeServer: session.getWorld(),
    ...validInput.data
  }

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

  console.log(loaderData)

  return (
    <PageWrapper>
      {showNoResults ||
        (flatData && (
          <div className="mx-3 my-2">
            <Title title="Crafting List" />
          </div>
        ))}
      {showNoResults && <NoResults href="/ffxiv/crafting-list" />}
      {flatData && <Results data={flatData} />}
      {!flatData && (
        <SmallFormContainer
          onClick={() => {}}
          error={error}
          loading={loading}
          title="Crafting List">
          <div className="pt-2">
            <div className="flex justify-end mb-2">
              <SubmitButton
                title="Share this search!"
                onClick={handleCopyButton}
                type="button"
              />
            </div>
            <DoHFilter
              defaultValue={loaderData.jobs}
              options={dOHOptions}
              title={inputMap.jobs}
              onChange={(jobs) =>
                handleSearchParamChange('jobs', jobs.join(','))
              }
            />
            <ItemsFilter
              defaultFilters={loaderData.filters}
              onChange={(newIds) =>
                handleSearchParamChange('filters', newIds.join(','))
              }
            />
            <Select
              title={inputMap.costMetric}
              defaultValue={loaderData.costMetric}
              options={costMetrics.map((value) => ({
                value,
                label: costMetricLabels[value]
              }))}
              name="costMetric"
              onChange={(e) => {
                const value = e.target.value
                if (value !== undefined) {
                  handleSearchParamChange('costMetric', value)
                }
              }}
            />
            <Select
              title={inputMap.revenueMetric}
              defaultValue={loaderData.revenueMetric}
              options={revenueMetrics.map((value) => ({
                value,
                label: revenueMetricLabels[value]
              }))}
              name="revenueMetric"
              onChange={(e) => {
                const value = e.target.value
                if (value !== undefined) {
                  handleSearchParamChange('costMetric', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.salesPerWeek}
              defaultValue={loaderData.salesPerWeek}
              name="salesPerWeek"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('salesPerWeek', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.medianSalePrice}
              defaultValue={loaderData.medianSalePrice}
              name="medianSalePrice"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('medianSalePrice', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.maxMaterialCost}
              defaultValue={loaderData.maxMaterialCost}
              name="maxMaterialCost"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('maxMaterialCost', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.stars}
              defaultValue={loaderData.stars}
              name="stars"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('stars', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.lvlLowerLimit}
              defaultValue={loaderData.lvlLowerLimit}
              name="lvlLowerLimit"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('lvlLowerLimit', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.lvlUpperLimit}
              defaultValue={loaderData.lvlUpperLimit}
              name="lvlUpperLimit"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('lvlUpperLimit', value)
                }
              }}
            />
            <InputWithLabel
              labelTitle={inputMap.yields}
              defaultValue={loaderData.yields}
              name="yields"
              type="number"
              onChange={(e) => {
                const value = e.currentTarget.value
                if (value !== null || value !== undefined) {
                  handleSearchParamChange('yields', value)
                }
              }}
            />
            <div className="mt-2">
              <CheckBox
                labelTitle={inputMap.hideExpertRecipes}
                defaultChecked={loaderData.hideExpertRecipes}
                name="hideExpertRecipes"
                onChange={(event) => {
                  const value = event.target.checked
                  handleSearchParamChange('hideExpertRecipes', value.toString())
                }}
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
  {
    columnId: 'profitEst',
    header: 'Profit Est.',
    accessor: ({ row }) =>
      row.profitEst === 999999999 ? (
        <p>∞</p>
      ) : (
        <p>{row.profitEst.toLocaleString()}</p>
      )
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
  },
  { columnId: 'yieldsPerCraft', header: 'Yield' },
  { columnId: 'soldPerWeek', header: 'Sales Per Week' },
  {
    columnId: 'revenue_avg',
    header: 'Revenue Average'
  },
  {
    columnId: 'revenue_median',
    header: 'Revenue Median'
  },
  {
    columnId: 'revenue_home_min_listing',
    header: 'Revenue Home Minimum Listing'
  },
  {
    columnId: 'revenue_region_min_listing',
    header: 'Revenue Region Minimum Listing'
  },
  {
    columnId: 'material_min_listing_cost',
    header: 'Cost Minimum Listing Price'
  },
  {
    columnId: 'material_median_cost',
    header: 'Cost Estimate Median'
  },
  {
    columnId: 'material_avg_cost',
    header: 'Cost Estimate Average'
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
