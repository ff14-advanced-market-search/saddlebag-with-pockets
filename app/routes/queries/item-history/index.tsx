import { useActionData, useTransition } from '@remix-run/react'
import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import GetHistoryRequest from '~/requests/GetHistory'
import type { GetHistoryProps, GetHistoryResponse } from '~/requests/GetHistory'
import NoResults from '~/routes/queries/listings/NoResults'
import { getUserSessionData } from '~/sessions'
import ItemSelect from '~/components/form/select/ItemSelect'
import type { ItemSelected } from '~/components/form/select/ItemSelect'
import { useState } from 'react'
import { Differences } from '../listings/Differences'
import SaleHistoryTable from './SaleHistoryTable'
import SalesByHourChart from './SalesByHourChart'
import PriceHistoryChart from './PriceHistoryChart'
import SuspiciousSaleTable from './SuspiciousSalesTable'
import SmallFormContainer from '~/components/form/SmallFormContainer'

const validateInput = ({
  itemId,
  world,
  itemType
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
  itemType?: FormDataEntryValue | null
}): GetHistoryProps | undefined => {
  if (itemId === undefined || itemId === null) {
    return
  }

  if (world === undefined || world === null) {
    return
  }

  if (typeof itemId !== 'string') {
    return
  }

  if (typeof world !== 'string') {
    return
  }

  if (itemType !== 'all' && itemType !== 'hq_only' && itemType !== 'nq_only') {
    return
  }

  const parsedItemId = parseInt(itemId, 10)
  if (isNaN(parsedItemId)) {
    return
  }

  return { itemId: parsedItemId, world, itemType }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

  const validInput = validateInput({
    itemId: formData.get('itemId'),
    world: formData.get('world'),
    itemType: formData.get('itemType')
  })

  if (!validInput) {
    return new Error('not valid input')
  }

  try {
    return await GetHistoryRequest(validInput)
  } catch (err) {
    console.log('catch', err)
    return err
  }
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error('errorBoundary', error)
  return (
    <pre>
      If you're seeing this, it'd be appreciated if you could report in our
      Discord's <span className={`font-bold`}>#bug-reporting</span> channel.
      Much thank
    </pre>
  )
}

const parseServerError = (error: string) => {
  if (error.includes('Error sending result:')) {
    return 'Failed to receive result from external API'
  }

  return error
}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<GetHistoryResponse>()
  const [formState, setFormState] = useState<ItemSelected | undefined>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting' || !formState) {
      e.preventDefault()
      return
    }
  }

  const error =
    results && 'exception' in results
      ? `Server Error: ${parseServerError(results.exception)}`
      : ''

  return (
    <main className="flex-1">
      <div className="py-3">
        <SmallFormContainer
          title="Find Item History"
          onClick={onSubmit}
          error={error}
          loading={transition.state === 'submitting'}
          disabled={!formState}>
          <>
            <ItemSelect onSelectChange={setFormState} />
            <div className="my-1 flex flex-1 px-4">
              <select
                id="itemType"
                className="flex-1 min-w-0 block px-3 py-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block shadow-sm sm:text-sm border-gray-300 rounded-l-md"
                name="itemType"
                defaultValue={'all'}>
                <option value="all">All</option>
                <option value="hq_only">High Quality</option>
                <option value="nq_only">Low Quality</option>
              </select>
              <label
                htmlFor="itemType"
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm shadow-sm">
                Item Quality
              </label>
            </div>
          </>
        </SmallFormContainer>
      </div>
      {results && !Object.keys(results).length && (
        <NoResults href={`/queries/item-history`} />
      )}
      {results && 'average_ppu' in results && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
            <h2 className="text-xl font-semibold text-blue-900 py-2 ml-8">
              Home Server Sales per Hour
            </h2>
            <SalesByHourChart data={results.home_server_sales_by_hour_chart} />
          </div>
          <h2 className="text-xl font-semibold text-blue-900 py-2 ml-8">
            Region Wide Pricing and Sales
          </h2>
          <div className="flex flex-col justify-around mx-3 my-6 md:flex-row">
            <div className="flex flex-col max-w-full">
              <Differences
                diffTitle="Average Price Per Unit Sold"
                diffAmount={results.average_ppu}
                className="bg-blue-100 text-blue-900 font-semibold "
              />
              <Differences
                diffTitle="Median Price Per Unit Sold"
                diffAmount={results.median_ppu}
                className="bg-blue-100 text-blue-900 font-semibold "
              />
            </div>
            <div className="flex flex-col max-w-full">
              <Differences
                diffTitle="Average quantity sold per day"
                diffAmount={results.average_quantity_sold_per_day}
                className="bg-blue-100 text-blue-900 font-semibold "
              />
              <Differences
                diffTitle="Average amount Sold per day"
                diffAmount={results.average_sales_per_day}
                className="bg-blue-100 text-blue-900 font-semibold "
              />
              <Differences
                diffTitle="Total Sold"
                diffAmount={results.total_quantity_sold}
                className="bg-blue-100 text-blue-900 font-semibold "
              />
            </div>
          </div>

          <SaleHistoryTable data={results.stack_chance} />

          <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
            <h2 className="text-2xl font-semibold text-blue-900 py-2 ml-8">
              Region Price History
            </h2>
            <PriceHistoryChart data={results.price_history} />
          </div>

          <div className="my-6 px-3 pb-2 pt-4 sm:rounded-md bg-white shadow">
            <h2 className="text-2xl font-semibold text-blue-900 py-2 ml-8">
              Region Wide Suspicious Sales
            </h2>
            {results.dirty_sales.length ? (
              <SuspiciousSaleTable data={results.dirty_sales} />
            ) : (
              <p className="italic text-sm text-grey-500 px-3">
                No suspicious sales found
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default Index
