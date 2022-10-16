import { Form, useActionData, useTransition } from '@remix-run/react'
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
import { SubmitButton } from '~/components/form/SubmitButton'
import { useState } from 'react'
import { Differences } from '../listings/Differences'
import SaleHistoryTable from './SaleHistoryTable'

const validateInput = ({
  itemId,
  world
}: {
  itemId?: FormDataEntryValue | null
  world?: FormDataEntryValue | null
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

  const parsedItemId = parseInt(itemId, 10)
  if (isNaN(parsedItemId)) {
    return
  }

  return { itemId: parsedItemId, world }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  formData.append('world', session.getWorld())

  const validInput = validateInput({
    itemId: formData.get('itemId'),
    world: formData.get('world')
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
      ? `Server Error: ${results.exception}`
      : ''

  console.log(results)
  return (
    <main className="flex-1">
      <div className="py-3">
        <Form method="post">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-semibold text-blue-900 py-2">
              Find Item History
            </h1>
            <div className="mt-3 md:mt-0 md:col-span-3 py-3">
              <div className="shadow overflow-hidden sm:rounded-md">
                <ItemSelect onSelectChange={setFormState} />
                <div className="px-4 py-2 bg-white sm:p-2">
                  <div className="flex justify-between">
                    <p className="text-red-500 mx-2">{error}</p>
                    <SubmitButton
                      title="Search"
                      onClick={onSubmit}
                      loading={transition.state === 'submitting'}
                      disabled={!formState}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
      {results && !Object.keys(results).length && (
        <NoResults href={`/queries/item-history`} />
      )}
      {results && 'average_ppu' in results && (
        <>
          <div className="flex flex-col justify-around mx-3 my-1 md:flex-row">
            <div className="flex flex-col max-w-full">
              <Differences
                diffTitle="Average Price Per Unit Sold"
                diffAmount={results.average_ppu}
                className="bg-blue-100 text-blue-700 font-semibold "
              />
              <Differences
                diffTitle="Median Price Per Unit Sold"
                diffAmount={results.median_ppu}
                className="bg-blue-100 text-blue-700 font-semibold "
              />
            </div>
            <div className="flex flex-col max-w-full">
              <Differences
                diffTitle="Average quantity sold per day"
                diffAmount={results.average_quantity_sold_per_day}
                className="bg-blue-100 text-blue-700 font-semibold "
              />
              <Differences
                diffTitle="Average amount Sold per day"
                diffAmount={results.average_sales_per_day}
                className="bg-blue-100 text-blue-700 font-semibold "
              />
              <Differences
                diffTitle="Total Sold"
                diffAmount={results.total_quantity_sold}
                className="bg-blue-100 text-blue-700 font-semibold "
              />
            </div>
          </div>
          <SaleHistoryTable data={results.stack_chance} />
        </>
      )}
    </main>
  )
}

export default Index
