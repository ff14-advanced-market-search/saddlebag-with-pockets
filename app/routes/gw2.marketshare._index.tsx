import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { z } from 'zod'
import GW2Marketshare, {
  type GW2MarketshareSortBy,
  type GW2MarketshareProps
} from '~/requests/GW2/marketshare'
import NoResults from '~/components/Common/NoResults'
import { Results, SortBySelect } from '~/components/GW2Results/Marketshare'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { SubmitButton } from '~/components/form/SubmitButton'
import ItemTypeSelect from '~/components/form/GW2/ItemTypeSelect'
import ItemDetailsTypeSelect from '~/components/form/GW2/ItemDetailsTypeSelect'
import ItemRaritySelect from '~/components/form/GW2/ItemRaritySelect'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { useState, useEffect } from 'react'
import { ToolTip } from '~/components/Common/InfoToolTip'

import type { GW2MarketshareItem } from '~/requests/GW2/marketshare'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: GW2 Marketshare Gold Making Overview' },
    { name: 'description', content: 'Find what items make the most gold in GW2, sell the most in GW2, sell the fastest in GW2 and have the best market gaps!' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/gw2/marketshare' }
  ]
}

type GW2MarketshareActionResult =
  | {}
  | { exception: string }
  | { data: Array<GW2MarketshareItem>; sortBy: GW2MarketshareSortBy }

type GW2MarketshareParams = {
  desired_avg_price: string
  desired_sales_per_day: string
  desired_value: string
  sort_by: GW2MarketshareSortBy
  type: string
  details_type: string
  rarity: string
  level: string
}

type GW2MarketshareLoaderData = GW2MarketshareProps

const inputMap: Record<string, string> = {
  desired_avg_price: 'Desired Average Price',
  desired_sales_per_day: 'Desired Sales Per Day',
  desired_value: 'Desired Value',
  sort_by: 'Sort Data By',
  type: 'Type',
  details_type: 'Details Type',
  rarity: 'Rarity',
  level: 'Level'
}

const validSortBys: Array<GW2MarketshareSortBy> = [
  'value',
  'historic_value',
  'sold',
  'historic_sold',
  'price_average',
  'historic_price_average',
  'pricePercentChange',
  'soldPercentChange',
  'valuePercentChange',
  'sellQuantityPercentChange',
  'buyQuantityPercentChange'
]

const assertSortBy = (value: any): value is GW2MarketshareSortBy => {
  return validSortBys.includes(value)
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const formPayload = Object.fromEntries(formData)

  // If type is -1 (all types), ensure details_type is also -1
  const typeValue = formPayload.type as string
  if (typeValue === '-1' || typeValue === undefined) {
    formPayload.details_type = '-1'
  }

  const validateFormData = z.object({
    desired_avg_price: z
      .union([z.string(), z.undefined()])
      .transform((value) => {
        if (!value || value === '' || isNaN(Number(value))) return 1 // Default to 1 copper
        return Math.round(parseFloat(value) * 10000) // Convert to coppers (e.g., 2.5025 -> 25025)
      }),
    desired_sales_per_day: z
      .union([z.string(), z.undefined()])
      .transform((value) => {
        if (!value || value === '' || isNaN(Number(value))) return 1
        return parseFloat(value)
      }),
    desired_value: z.union([z.string(), z.undefined()]).transform((value) => {
      if (!value || value === '' || isNaN(Number(value))) return 10000 // Default to 1 gold = 10000 coppers
      // Convert from gold (user input) to coppers (e.g., 1.0 -> 10000)
      return Math.round(Number(value) * 10000)
    }),
    sort_by: z.union([
      z.literal('value'),
      z.literal('historic_value'),
      z.literal('sold'),
      z.literal('historic_sold'),
      z.literal('price_average'),
      z.literal('historic_price_average'),
      z.literal('pricePercentChange'),
      z.literal('soldPercentChange'),
      z.literal('valuePercentChange'),
      z.literal('sellQuantityPercentChange'),
      z.literal('buyQuantityPercentChange')
    ]),
    type: z
      .string()
      .min(1)
      .transform((value) => parseInt(value)),
    details_type: z
      .string()
      .min(1)
      .transform((value) => parseInt(value)),
    rarity: z
      .string()
      .min(1)
      .transform((value) => parseInt(value)),
    level: z
      .string()
      .min(1)
      .transform((value) => {
        const num = parseInt(value)
        return num < 0 ? 0 : num // Ensure level can't be below 0
      })
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

  const data = await (await GW2Marketshare(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({
    ...data,
    sortBy: validInput.data.sort_by
  })
}

const defaultParams: GW2MarketshareLoaderData = {
  desired_avg_price: 1, // 1 copper
  desired_sales_per_day: 1.0,
  desired_value: 10000, // 1 gold in coppers
  sort_by: 'value',
  type: -1,
  details_type: -1,
  rarity: -1,
  level: 0
}

const searchParamsType = z.object({
  desired_avg_price: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value)))
      return defaultParams.desired_avg_price // Already in coppers
    // Convert from gold (user input) to coppers for storage (e.g., 2.5025 -> 25025)
    return Math.round(Number(value) * 10000)
  }),
  desired_sales_per_day: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value)))
      return defaultParams.desired_sales_per_day
    return Number(value)
  }),
  desired_value: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value)))
      return defaultParams.desired_value // Already in coppers
    // Convert from gold (user input) to coppers for storage (e.g., 1.0 -> 10000)
    return Math.round(Number(value) * 10000)
  }),
  sort_by: z
    .union([
      z.literal('value'),
      z.literal('historic_value'),
      z.literal('sold'),
      z.literal('historic_sold'),
      z.literal('price_average'),
      z.literal('historic_price_average'),
      z.literal('pricePercentChange'),
      z.literal('soldPercentChange'),
      z.literal('valuePercentChange'),
      z.literal('sellQuantityPercentChange'),
      z.literal('buyQuantityPercentChange'),
      z.null()
    ])
    .transform((value) => {
      if (value === null) return defaultParams.sort_by
      return value
    }),
  type: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value))) return defaultParams.type
    return Number(value)
  }),
  details_type: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value)))
      return defaultParams.details_type
    return Number(value)
  }),
  rarity: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value))) return defaultParams.rarity
    return Number(value)
  }),
  level: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value))) return defaultParams.level
    return Number(value)
  })
})

export const loader: LoaderFunction = ({ request }) => {
  const params = new URL(request.url).searchParams

  const input = {
    desired_avg_price: params.get('desired_avg_price'),
    desired_sales_per_day: params.get('desired_sales_per_day'),
    desired_value: params.get('desired_value'),
    sort_by: params.get('sort_by'),
    type: params.get('type'),
    details_type: params.get('details_type'),
    rarity: params.get('rarity'),
    level: params.get('level')
  }

  const result = searchParamsType.safeParse(input)

  if (result.success) {
    return result.data
  } else return defaultParams
}

export default function Index() {
  const transition = useNavigation()
  const loaderData = useLoaderData<GW2MarketshareLoaderData>()
  const [searchParams, setSearchParams] = useState<GW2MarketshareParams>({
    desired_avg_price: (loaderData.desired_avg_price / 10000).toString(), // Convert from coppers to gold for display
    desired_sales_per_day: loaderData.desired_sales_per_day.toString(),
    desired_value: (loaderData.desired_value / 10000).toString(), // Convert from coppers to gold for display
    sort_by: assertSortBy(loaderData.sort_by)
      ? loaderData.sort_by
      : defaultParams.sort_by,
    type: loaderData.type.toString(),
    details_type: loaderData.details_type.toString(),
    rarity: loaderData.rarity.toString(),
    level: loaderData.level.toString()
  })
  const [selectedType, setSelectedType] = useState(loaderData.type)

  // Update searchParams when loaderData changes (e.g., from URL changes)
  useEffect(() => {
    setSearchParams({
      desired_avg_price: (loaderData.desired_avg_price / 10000).toString(), // Convert from coppers to gold for display
      desired_sales_per_day: loaderData.desired_sales_per_day.toString(),
      desired_value: (loaderData.desired_value / 10000).toString(), // Convert from coppers to gold for display
      sort_by: assertSortBy(loaderData.sort_by)
        ? loaderData.sort_by
        : defaultParams.sort_by,
      type: loaderData.type.toString(),
      details_type: loaderData.details_type.toString(),
      rarity: loaderData.rarity.toString(),
      level: loaderData.level.toString()
    })
    setSelectedType(loaderData.type)
  }, [loaderData])

  const results = useActionData<GW2MarketshareActionResult>()
  const { darkmode } = useTypedSelector((state) => state.user)

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const pageTitle = 'Marketshare Overview'

  const error =
    results && 'exception' in results ? results?.exception : undefined

  const noResults = results && !Object.keys(results).length
  const showResults = results && !noResults && 'data' in results

  const handleFormChange = (
    name: keyof GW2MarketshareParams,
    value: string
  ) => {
    handleSearchParamChange(name, value)

    setSearchParams({ ...searchParams, [name]: value })
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}
        action={getActionUrl('/gw2/marketshare', searchParams)}>
        <div className="pt-4">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
          <InputWithLabel
            name="desired_avg_price"
            labelTitle="Desired Average Price"
            toolTip="Filters out items that have never had the average price go over this limit."
            type="number"
            step="0.0001"
            defaultValue={loaderData.desired_avg_price / 10000}
            inputTag="Gold (e.g., 2.5025 = 2g 5s 25c)"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('desired_avg_price', value)
              }
            }}
          />
          <InputWithLabel
            name="desired_sales_per_day"
            labelTitle="Desired Sales Per Day"
            toolTip="Filters out items that never sold this much on any day in the date range."
            type="number"
            defaultValue={loaderData.desired_sales_per_day}
            inputTag="Sales"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('desired_sales_per_day', value)
              }
            }}
          />
          <InputWithLabel
            name="desired_value"
            labelTitle="Desired Value"
            toolTip="Filters out items that where all sales revenue has never exceeded this gold amount."
            type="number"
            step="0.0001"
            defaultValue={loaderData.desired_value / 10000}
            inputTag="Gold (e.g., 1.0 = 1g)"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('desired_value', value)
              }
            }}
          />
          <div>
            <div className="relative flex items-center gap-1 mb-1">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Type
              </label>
              <ToolTip data="Filter items by their main category type (e.g., Armor, Weapon, Consumable)." />
            </div>
            <div className="[&_label]:hidden">
              <ItemTypeSelect
                defaultValue={loaderData.type}
                onChange={(value) => {
                  setSelectedType(value)
                  handleFormChange('type', value.toString())
                  // Reset details_type when type changes
                  if (value === -1) {
                    handleFormChange('details_type', '-1')
                  }
                }}
              />
            </div>
          </div>
          {selectedType !== -1 && (
            <div>
              <div className="relative flex items-center gap-1 mb-1">
                <label
                  htmlFor="details_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Details Type
                </label>
                <ToolTip data="Filter items by their specific details type or subclass (e.g., Boots, Coat for Armor type). Only available when a specific Type is selected." />
              </div>
              <div className="[&_label]:hidden">
                <ItemDetailsTypeSelect
                  itemType={selectedType}
                  defaultValue={loaderData.details_type}
                  onChange={(value) => {
                    handleFormChange('details_type', value.toString())
                  }}
                />
              </div>
            </div>
          )}
          <div>
            <div className="relative flex items-center gap-1 mb-1">
              <label
                htmlFor="rarity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Rarity
              </label>
              <ToolTip data="Filter items to a rarity at or above this level (e.g., Common, Rare, Exotic, Legendary)." />
            </div>
            <div className="[&_label]:hidden">
              <ItemRaritySelect
                defaultValue={loaderData.rarity}
                onChange={(value) => {
                  handleFormChange('rarity', value.toString())
                }}
              />
            </div>
          </div>
          <InputWithLabel
            name="level"
            labelTitle="Level"
            toolTip="Filter items by their required level, filters out items that are below this level. Set to 0 to include all levels."
            type="number"
            min={0}
            defaultValue={loaderData.level}
            inputTag="Level"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                const numValue = parseInt(value, 10)
                const safeValue = numValue < 0 ? '0' : value
                handleFormChange('level', safeValue)
              }
            }}
          />
          <div>
            <div className="relative flex items-center gap-1 mb-1">
              <label
                htmlFor="sort_by"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Sort Results By
              </label>
              <ToolTip data="Choose how to sort the results. Options include value, sales, price changes, various percentage changes, and various quantity changes." />
            </div>
            <div className="[&_label]:hidden">
              <SortBySelect
                value={searchParams.sort_by}
                defaultValue={loaderData.sort_by}
                onChange={(value) => {
                  if (value !== undefined) {
                    handleFormChange('sort_by', value)
                  }
                }}
              />
            </div>
          </div>
        </div>
      </SmallFormContainer>
      {noResults && <NoResults />}
      {showResults && (
        <Results
          data={results.data}
          darkmode={darkmode}
          sortByValue={results.sortBy}
        />
      )}
    </PageWrapper>
  )
}
