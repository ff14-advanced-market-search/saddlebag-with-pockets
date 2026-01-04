import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { useActionData } from '@remix-run/react'
import { useState } from 'react'
import GW2WeeklyPriceGroupDelta from '~/requests/GW2/WeeklyPriceGroupDelta'
import type { GW2WeeklyPriceGroupDeltaResponse } from '~/requests/GW2/WeeklyPriceGroupDelta'
import { Results } from '~/components/GW2Results/WeeklyPriceDelta/Results'
import { Form } from '~/components/GW2Results/WeeklyPriceDelta/Form'

// Define action data type
export type ErrorActionData = { state: 'error'; exception: string }
export type SuccessActionData = {
  state: 'success'
  data: GW2WeeklyPriceGroupDeltaResponse
  request: {
    start_year: number
    start_month: number
    start_day: number
    end_year: number
    end_month: number
    end_day: number
    minimum_value: number
    minimum_sales: number
    minimum_average_price: number
    price_groups: Array<{
      name: string
      item_ids: number[]
      types: number[]
    }>
  }
}

export type ActionData = ErrorActionData | SuccessActionData

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: GW2 Weekly Price Group Delta Analysis',
    description:
      'GW2 Price Group Analysis! View weekly price changes for investment opportunities!',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/gw2/weekly-price-group-delta'
      }
    ]
  }
}

export const loader: LoaderFunction = () => {
  return json({})
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const endYear = Number.parseInt(formData.get('endYear') as string)
  const endMonth = Number.parseInt(formData.get('endMonth') as string)
  const endDay = Number.parseInt(formData.get('endDay') as string)
  const minimumValue =
    Number.parseInt(formData.get('minimum_value') as string) || 100000000
  const minimumSales =
    Number.parseInt(formData.get('minimum_sales') as string) || 0
  const minimumAveragePrice =
    Number.parseInt(formData.get('minimum_average_price') as string) || 0
  const priceGroups = JSON.parse(formData.get('priceGroups') as string)

  if (priceGroups.length < 1) {
    return json<ActionData>({
      state: 'error',
      exception: 'You must add at least one price group'
    })
  }

  try {
    const response = await GW2WeeklyPriceGroupDelta({
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      end_year: endYear,
      end_month: endMonth,
      end_day: endDay,
      minimum_value: minimumValue,
      minimum_sales: minimumSales,
      minimum_average_price: minimumAveragePrice,
      price_groups: priceGroups
    })

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: `Server responded with ${response}` }))
      throw new Error(
        errorData.message ||
          errorData.exception ||
          `Server responded with ${response}`
      )
    }

    const data = await response.json()
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server')
    }

    if ('exception' in data) {
      return json<ActionData>({ state: 'error', exception: data.exception })
    }

    return json({
      state: 'success',
      data,
      request: {
        start_year: startYear,
        start_month: startMonth,
        start_day: startDay,
        end_year: endYear,
        end_month: endMonth,
        end_day: endDay,
        minimum_value: minimumValue,
        minimum_sales: minimumSales,
        minimum_average_price: minimumAveragePrice,
        price_groups: priceGroups
      }
    })
  } catch (error) {
    return json<ActionData>({
      state: 'error',
      exception:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}

const Index = () => {
  const actionData = useActionData<ActionData>()
  const [retriggerSearch, setRetriggerSearch] = useState(false)

  const pageTitle = 'Weekly Price Group Delta Analysis'

  // Show error from action data
  const actionError =
    actionData && 'exception' in actionData ? actionData.exception : undefined

  // Show results if we have data and no errors
  if (
    actionData &&
    actionData.state === 'success' &&
    retriggerSearch === false
  ) {
    return (
      <Results
        actionData={actionData as SuccessActionData}
        pageTitle={pageTitle}
        backWithQuery={() => setRetriggerSearch(true)}
      />
    )
  }

  return (
    <Form
      pageTitle={pageTitle}
      actionError={actionError}
      actionData={actionData as ActionData}
      edit={retriggerSearch}
      onSubmit={() => setRetriggerSearch(false)}
    />
  )
}

export default Index
