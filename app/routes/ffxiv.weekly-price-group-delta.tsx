import { json } from '@remix-run/cloudflare'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { useState, useEffect, useMemo } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { FFXIVLoaderData, ImportData } from '~/requests/FFXIV/types'
import { useTypedSelector } from '~/redux/useTypedSelector'
import WeeklyPriceGroupDelta from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import type {
  WeeklyPriceGroupDeltaResponse,
  ItemData
} from '~/requests/FFXIV/WeeklyPriceGroupDelta'
import ErrorPopup from '~/components/Common/ErrorPopup'
import DateRangeInputs from '~/components/FFXIV/DateRangeInputs'
import ImportSection from '~/components/FFXIV/ImportSection'
import PriceGroupsSection from '~/components/FFXIV/PriceGroupsSection'
import RequestPreview from '~/components/FFXIV/RequestPreview'
import type { ColumnList } from '~/components/types'
import ItemDetailsTable from '~/components/FFXIV/ItemDetailsTable'
import DeltaChartContainer from '~/components/WoW/DeltaChartContainer'
import DateRangeControls from '~/components/WoW/DateRangeControls'
import GroupSelector from '~/components/WoW/GroupSelector'
import PriceQuantityChartPopup from '~/components/Charts/PriceQuantityChartPopup'
import RequestDataSection from '~/components/FFXIV/RequestDataSection'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import ItemDataLink from '~/components/utilities/ItemDataLink'
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
    hq_only: boolean
    price_setting: string
    quantity_setting: string
    price_groups: any
  }
}

export type ActionData = ErrorActionData | SuccessActionData

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Weekly Price Group Delta Analysis',
    description:
      'FFXIV Price Group Analysis! View weekly price changes for investment opportunities!',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/weekly-price-group-delta'
      }
    ]
  }
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
  const hqOnly = formData.get('hq_only') === 'true'
  const priceSetting = formData.get('price_setting') as string
  const quantitySetting = formData.get('quantity_setting') as string
  const priceGroups = JSON.parse(formData.get('priceGroups') as string)

  try {
    const response = await WeeklyPriceGroupDelta({
      region,
      start_year: startYear,
      start_month: startMonth,
      start_day: startDay,
      end_year: endYear,
      end_month: endMonth,
      end_day: endDay,
      hq_only: hqOnly,
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
        hq_only: hqOnly,
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

  const pageTitle = `Weekly Price Group Delta Analysis - ${region}`

  // Show error from action data
  const actionError =
    actionData && 'exception' in actionData ? actionData.exception : undefined

  // Show results if we have data and no errors
  if (actionData && actionData.state === 'success') {
    return (
      <Results
        actionData={actionData as SuccessActionData}
        pageTitle={pageTitle}
        region={region}
      />
    )
  }
  return (
    <Form
      pageTitle={pageTitle}
      actionError={actionError}
      region={region}
      setRegion={setRegion}
    />
  )
}

export default Index
