import type {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import ItemsFilter from '~/components/form/ffxiv/ItemsFilter'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import { getUserSessionData } from '~/sessions'
import { z } from 'zod'
import MarketShare from '~/requests/FFXIV/marketshare'
import type {
  MarketshareResult,
  MarketshareSortBy,
  MarketshareProps
} from '~/requests/FFXIV/marketshare'
import NoResults from '~/components/Common/NoResults'
import { Results, SortBySelect } from '~/components/FFXIVResults/Marketshare'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { SubmitButton } from '~/components/form/SubmitButton'

type MarketshareActionResult =
  | {}
  | { exception: string }
  | { data: MarketshareResult; server: string; sortBy: MarketshareSortBy }

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

const inputMap: Record<string, string> = {
  server: 'Home Realm',
  timePeriod: 'Time Period',
  salesAmount: 'Sales Amount',
  averagePrice: 'Average Price',
  sortBy: 'Sort Data By',
  filters: 'Filters'
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
      .transform((value) => value.split(',').map(Number))
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

const defaultParams = {
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

const handleSearchParamChange = (
  paramName: string,
  newValue: string | undefined
) => {
  if (!document || !window) return
  const url = new window.URL(document.URL)

  if (newValue) {
    url.searchParams.set(paramName, newValue)
  }

  window.history.replaceState({}, '', url.toString())
}

export default function Index() {
  const transition = useTransition()
  const searchParams = useLoaderData<Omit<MarketshareProps, 'server'>>()
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

  if (results && !error) {
    if (!Object.keys(results).length) {
      return <NoResults href="/ffvix/marketshare" />
    }

    if ('data' in results) {
      return (
        <Results
          data={results.data}
          pageTitle={pageTitle}
          darkmode={darkmode}
          sortByValue={results.sortBy}
        />
      )
    }
  }

  const handleCopyButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!window || !document) {
      return
    }

    if (!window.isSecureContext) {
      alert('Failed to copy address to clipboard.')
      return
    }

    await navigator.clipboard.writeText(document.URL)

    alert('Address copied to clipboard')
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
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
            defaultValue={searchParams.timePeriod}
            inputTag="Hours"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleSearchParamChange('timePeriod', value)
              }
            }}
          />
          <InputWithLabel
            name="salesAmount"
            labelTitle="Sales Amount"
            type="number"
            defaultValue={searchParams.salesAmount}
            inputTag="No# of sales"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleSearchParamChange('salesAmount', value)
              }
            }}
          />
          <InputWithLabel
            name="averagePrice"
            labelTitle="Average Price"
            type="number"
            defaultValue={searchParams.averagePrice}
            inputTag="Gil"
            onChange={(e) => {
              const value = e.target.value
              if (value !== undefined) {
                handleSearchParamChange('averagePrice', value)
              }
            }}
          />
          <ItemsFilter
            defaultFilters={searchParams.filters}
            onChange={(value) => {
              if (value !== undefined) {
                handleSearchParamChange('filters', value.join(','))
              }
            }}
          />
          <SortBySelect
            defaultValue={searchParams.sortBy}
            onChange={(value) => {
              if (value !== undefined) {
                handleSearchParamChange('sortBy', value)
              }
            }}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}
