import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { getUserSessionData } from '~/sessions'
import FullScanRequest, { formatFullScanInput } from '~/requests/FullScan'
import { useEffect } from 'react'
import NoResults from '~/components/Common/NoResults'
import Results from '~/components/FFXIVResults/FullScan/Results'
import { useDispatch } from 'react-redux'
import { setFullScan } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import { PreviousResultsLink } from '../components/FFXIVResults/FullScan/PreviousResultsLink'
import FullScanForm from '../components/form/ffxiv/FullScanForm'
import z from 'zod'
import {
  parseStringToNumber,
  parseCheckboxBoolean,
  parseZodErrorsToDisplayString,
  parseStringToNumberArray
} from '~/utils/zodHelpers'

const validateFormInput = z.object({
  scan_hours: parseStringToNumber,
  sale_amount: parseStringToNumber,
  roi: parseStringToNumber,
  price_per_unit: parseStringToNumber,
  minimum_profit_amount: parseStringToNumber,
  minimum_stack_size: parseStringToNumber,
  world: z.string(),
  universalis_list_uid: z.string().optional(),
  hq_only: parseCheckboxBoolean,
  region_wide: parseCheckboxBoolean,
  include_vendor: parseCheckboxBoolean,
  out_of_stock: parseCheckboxBoolean,
  filters: parseStringToNumberArray
})

const inputMap = {
  scan_hours: 'Scan Hours',
  sale_amount: 'Sale Amount',
  roi: 'Return on Investment',
  price_per_unit: 'Price per unit',
  minimum_profit_amount: 'Minimum profit amount',
  minimum_stack_size: 'Minimum stack size',
  world: 'Data Center',
  universalis_list_uid: 'Universalis List',
  hq_only: 'HQ Only',
  region_wide: 'Region Wide',
  include_vendor: 'Include vendor',
  out_of_stock: 'Out of stock',
  filters: 'Filters'
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())
  const formPayload = Object.fromEntries(formData)

  const validatedForm = validateFormInput.safeParse(formPayload)

  if (!validatedForm.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validatedForm.error, inputMap)
    })
  }

  const formattedData = formatFullScanInput(validatedForm.data)

  return await FullScanRequest(formattedData).catch((err) => {
    console.log('catch', err)
    return err
  })
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url)
  // CAN WE USE ZOD HERE??
  const input = {
    hours: url.searchParams.has('hours')
      ? parseFloat(url.searchParams.get('hours') as string)
      : undefined,
    salesAmount: url.searchParams.has('salesAmount')
      ? parseFloat(url.searchParams.get('salesAmount') as string)
      : undefined,
    ROI: url.searchParams.has('ROI')
      ? parseFloat(url.searchParams.get('ROI') as string)
      : undefined,
    minimumStackSize: url.searchParams.has('minimumStackSize')
      ? parseFloat(url.searchParams.get('minimumStackSize') as string)
      : undefined,
    minimumProfitAmount: url.searchParams.has('minimumProfitAmount')
      ? parseFloat(url.searchParams.get('minimumProfitAmount') as string)
      : undefined,
    pricePerUnit: url.searchParams.has('pricePerUnit')
      ? parseFloat(url.searchParams.get('pricePerUnit') as string)
      : undefined,
    filters: url.searchParams.has('filters')
      ? url.searchParams
          .get('filters')
          ?.split(',')
          .map((str) => parseInt(str))
      : undefined,
    hQChecked: url.searchParams.has('hQChecked')
      ? url.searchParams.get('hQChecked') === 'true'
      : undefined,
    regionWideChecked: url.searchParams.has('regionWideChecked')
      ? url.searchParams.get('regionWideChecked') === 'true'
      : undefined,
    includeVendorChecked: url.searchParams.has('includeVendorChecked')
      ? url.searchParams.get('includeVendorChecked') === 'true'
      : undefined,
    outOfStockChecked: url.searchParams.has('outOfStockChecked')
      ? url.searchParams.get('outOfStockChecked') === 'true'
      : undefined
  }

  return json(input)
}

const Index = () => {
  const transition = useNavigation()
  const searchParams = useLoaderData()
  const results = useActionData()
  const fullScan = useTypedSelector((state) => state.queries.fullScan)

  const dispatch = useDispatch()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (results && results.data) {
      dispatch(setFullScan(results.data))
    }
  }, [results, dispatch])

  if (results) {
    if (Object.keys(results).length === 0) {
      const url = window && document ? new URL(window.location.href) : ''
      if (url) {
        return (
          <NoResults href={'/queries/full-scan?' + url.searchParams.toString()}>
            A quick suggestion would be expanding the{' '}
            <span className={`font-bold`}>Scan Hours</span> to a higher number,
            or lowering the <span className={`font-bold`}>Sale Amount</span>.
          </NoResults>
        )
      }
    }
    if ('data' in results) {
      const data = results.data

      return <Results rows={data} />
    }
  }
  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-green-900 py-6 dark:text-gray-100">
            FFXIV Import Search
          </h1>
          {fullScan && !results && (
            <PreviousResultsLink to="/queries/previous-search?query=fullScan" />
          )}
          <FullScanForm
            loading={transition.state === 'submitting'}
            onClick={onSubmit}
            error={
              results && 'exception' in results ? results.exception : undefined
            }
            defaultHours={searchParams.hours}
            defaultSalesAmount={searchParams.salesAmount}
            defaultROI={searchParams.ROI}
            defaultMinimumStackSize={searchParams.minimumStackSize}
            defaultMinimumProfitAmount={searchParams.minimumProfitAmount}
            defaultPricePerUnit={searchParams.pricePerUnit}
            defaultFilters={searchParams.filters}
            defaultHQChecked={searchParams.hQChecked}
            defaultRegionWideChecked={searchParams.regionWideChecked}
            defaultIncludeVendorChecked={searchParams.includeVendorChecked}
            defaultOutOfStockChecked={searchParams.outOfStockChecked}
          />
        </div>
      </div>
    </main>
  )
}

export default Index
