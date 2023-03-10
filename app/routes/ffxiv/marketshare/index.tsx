import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useTransition } from '@remix-run/react'
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
  MarketshareSortBy
} from '~/requests/FFXIV/marketshare'
import NoResults from '~/components/Common/NoResults'
import { Results, sortByOptions } from '~/components/FFXIVResults/Marketshare'
import Label from '~/components/form/Label'
import { useTypedSelector } from '~/redux/useTypedSelector'

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
      z.literal('quantitySold')
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

export default function Index() {
  const transition = useTransition()
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

  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        loading={transition.state === 'submitting'}
        error={error}>
        <div className="pt-4">
          <InputWithLabel
            name="timePeriod"
            labelTitle="Time Period"
            type="number"
            defaultValue={168}
            inputTag="Hours"
          />
          <InputWithLabel
            name="salesAmount"
            labelTitle="Sales Amount"
            type="number"
            defaultValue={2}
            inputTag="No# of sales"
          />
          <InputWithLabel
            name="averagePrice"
            labelTitle="Average Price"
            type="number"
            defaultValue={100000}
            inputTag="Gil"
          />
          <ItemsFilter />
          <div className="mt-2">
            <Label htmlFor="sortBy">Sort Results By</Label>
            <select
              name="sortBy"
              defaultValue={'avg'}
              className="flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400">
              {sortByOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}
