import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { getUserSessionData } from '~/sessions'
import { z } from 'zod'
import MarketShare, { marketShareSortBys } from '~/requests/FFXIV/marketshare'
import type {
  MarketshareResult,
  MarketshareSortBy,
  MarketshareProps
} from '~/requests/FFXIV/marketshare'
import NoResults from '~/components/Common/NoResults'
import { Results, SortBySelect } from '~/components/FFXIVResults/Marketshare'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { SubmitButton } from '~/components/form/SubmitButton'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { useState } from 'react'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV marketshare gil making overview',
    description:
      'Find what items make the most gil in FFXIV, sell the most in FFXIV, sell the fastest in in FFXIV and have the best market gaps!'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/ffxiv/marketshare' }
]

type MarketshareActionResult =
  | {}
  | { exception: string }
  | { data: MarketshareResult; server: string; sortBy: MarketshareSortBy }

type MarketshareParams = {
  timePeriod: string
  salesAmount: string
  averagePrice: string
  sortBy: MarketshareSortBy
  filters: string
}

type MarketshareLoaderData = Omit<MarketshareProps, 'server'>

const inputMap: Record<string, string> = {
  server: 'Home Realm',
  timePeriod: 'Time Period',
  salesAmount: 'Sales Amount',
  averagePrice: 'Average Price',
  sortBy: 'Sort Data By',
  filters: 'Filters'
}

const assertSortBy = (value: any): value is MarketshareSortBy => {
  return marketShareSortBys.includes(value)
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)
  formData.append('server', session.getWorld())

  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    server: z.string().min(1),
    timePeriod: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    salesAmount: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    averagePrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    sortBy: z.union([
      z.literal('avg'),
      z.literal('marketValue'),
      z.literal('median'),
      z.literal('purchaseAmount'),
      z.literal('quantitySold'),
      z.literal('percentChange')
    ]),
    filters: z
      .string()
      .min(1)
      .transform((value) => decodeURIComponent(value).split(',').map(Number))
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

  const data = await (await MarketShare(validInput.data)).json()

  if (data.exception !== undefined) {
    return json({ exception: data.exception })
  }

  if (!data?.data) {
    return json({ exception: 'Unknown server error' })
  }

  return json({
    ...data,
    server: validInput.data.server,
    sortBy: validInput.data.sortBy
  })
}

const defaultParams: MarketshareLoaderData = {
  timePeriod: 168,
  salesAmount: 2,
  averagePrice: 10000,
  sortBy: 'avg',
  filters: [0]
}

const searchParamsType = z.object({
  timePeriod: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value))) return defaultParams.timePeriod
    return Number(value)
  }),
  salesAmount: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value))) return defaultParams.salesAmount
    return Number(value)
  }),
  averagePrice: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null || isNaN(Number(value)))
      return defaultParams.averagePrice
    return Number(value)
  }),
  sortBy: z
    .union([
      z.literal('avg'),
      z.literal('marketValue'),
      z.literal('median'),
      z.literal('purchaseAmount'),
      z.literal('quantitySold'),
      z.literal('percentChange'),
      z.null()
    ])
    .transform((value) => {
      if (value === null) return defaultParams.sortBy
      return value
    }),
  filters: z.union([z.string(), z.null()]).transform((value) => {
    if (value === null) return defaultParams.filters
    return value
      .split(',')
      .map((val) => Number(val))
      .filter((num) => !isNaN(num))
  })
})

export const loader: LoaderFunction = ({ request }) => {
  const params = new URL(request.url).searchParams

  const input = {
    timePeriod: params.get('timePeriod'),
    salesAmount: params.get('salesAmount'),
    averagePrice: params.get('averagePrice'),
    sortBy: params.get('sortBy'),
    filters: params.get('filters')
  }

  const result = searchParamsType.safeParse(input)

  if (result.success) {
    return result.data
  } else return defaultParams
}

export default function Index() {
  const transition = useNavigation()
  const loaderData = useLoaderData<MarketshareLoaderData>()
  const [searchParams, setSearchParams] = useState<MarketshareParams>({
    timePeriod: loaderData.timePeriod.toString(),
    salesAmount: loaderData.salesAmount.toString(),
    averagePrice: loaderData.averagePrice.toString(),
    sortBy: assertSortBy(loaderData.sortBy)
      ? loaderData.sortBy
      : defaultParams.sortBy,
    filters: loaderData.filters.join(',')
  })

  const results = useActionData<MarketshareActionResult>()
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

  const handleFormChange = (name: keyof MarketshareParams, value: string) => {
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
        action={getActionUrl('/ffxiv/marketshare', searchParams)}>
        <div className="pt-4">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
          <InputWithLabel
            name="timePeriod"
            labelTitle="Time Period"
            type="number"
            defaultValue={loaderData.timePeriod}
            inputTag="Hours"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('timePeriod', value)
              }
            }}
          />
          <InputWithLabel
            name="salesAmount"
            labelTitle="Sales Amount"
            type="number"
            defaultValue={loaderData.salesAmount}
            inputTag="No# of sales"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('salesAmount', value)
              }
            }}
          />
          <InputWithLabel
            name="averagePrice"
            labelTitle="Average Price"
            type="number"
            defaultValue={loaderData.averagePrice}
            inputTag="Gil"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleFormChange('averagePrice', value)
              }
            }}
          />
          <ItemsFilter
            defaultFilters={loaderData.filters}
            onChange={(value) => {
              if (value !== undefined) {
                handleFormChange('filters', value.join(','))
              }
            }}
          />
          <SortBySelect
            defaultValue={loaderData.sortBy}
            onChange={(value) => {
              if (value !== undefined) {
                handleFormChange('sortBy', value)
              }
            }}
          />
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
