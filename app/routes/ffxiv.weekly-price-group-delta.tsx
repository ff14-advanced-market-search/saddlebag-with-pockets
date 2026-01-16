import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import type { FFXIVLoaderData } from '~/requests/FFXIV/types'
import WeeklyPriceGroupDelta from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type { WeeklyPriceGroupDeltaResponse } from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import { Results } from '~/components/FFXIVResults/WeeklyPriceDelta/Results'
import { Form } from '~/components/FFXIVResults/WeeklyPriceDelta/Form'

// Define action data type
export type ErrorActionData = { state: 'error'; exception: string }
export type SuccessActionData = {
  state: 'success'
  data: WeeklyPriceGroupDeltaResponse
  request: {
    region: string
    start_year: number
    start_month: number
    start_day: number
    end_year: number
    end_month: number
    end_day: number
    minimum_marketshare: number
    price_setting: string
    quantity_setting: string
    price_groups: any
  }
}

export type ActionData = ErrorActionData | SuccessActionData

export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { title: 'Saddlebag Exchange: FFXIV Weekly Price Group Delta Analysis' },
    { name: 'description', content: 'FFXIV Price Group Analysis! View weekly price changes for investment opportunities!' },
    { tagName: 'link', rel: 'canonical', href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta' }
  ]
}

export const loader: LoaderFunction = () => {
  return json<FFXIVLoaderData>({
    region: 'NA'
  })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const region = formData.get('region') as string

  if (!region) {
    return json<ActionData>({
      state: 'error',
      exception: 'Region is required.'
    })
  }

  const startYear = Number.parseInt(formData.get('startYear') as string)
  const startMonth = Number.parseInt(formData.get('startMonth') as string)
  const startDay = Number.parseInt(formData.get('startDay') as string)
  const endYear = Number.parseInt(formData.get('endYear') as string)
  const endMonth = Number.parseInt(formData.get('endMonth') as string)
  const endDay = Number.parseInt(formData.get('endDay') as string)
  const minimumMarketshare =
    Number.parseInt(formData.get('minimum_marketshare') as string) || 10000
  const priceSetting = formData.get('price_setting') as string
  const quantitySetting = formData.get('quantity_setting') as string
  const priceGroups = JSON.parse(formData.get('priceGroups') as string)

  if (priceGroups.length < 1) {
    return json<ActionData>({
      state: 'error',
      exception: 'You must add at least one price group'
    })
  }

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      end_year: endYear,
      end_month: endMonth,
      end_day: endDay,
      minimum_marketshare: minimumMarketshare,
      price_setting: priceSetting,
      quantity_setting: quantitySetting,
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
        region,
        start_year: startYear,
        start_month: startMonth,
        start_day: startDay,
        end_year: endYear,
        end_month: endMonth,
        end_day: endDay,
        minimum_marketshare: minimumMarketshare,
        price_setting: priceSetting,
        quantity_setting: quantitySetting,
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
  const { region: defaultRegion } = useLoaderData<FFXIVLoaderData>()
  const [region, setRegion] = useState(defaultRegion)
  const [retriggerSearch, setRetriggerSearch] = useState(false)

  const pageTitle = `Weekly Price Group Delta Analysis - ${region}`

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
        region={region}
        backWithQuery={() => setRetriggerSearch(true)}
      />
    )
  }

  return (
    <Form
      pageTitle={pageTitle}
      actionError={actionError}
      region={region}
      setRegion={setRegion}
      actionData={actionData as ActionData}
      edit={retriggerSearch}
      onSubmit={() => setRetriggerSearch(false)}
    />
  )
}

export default Index
