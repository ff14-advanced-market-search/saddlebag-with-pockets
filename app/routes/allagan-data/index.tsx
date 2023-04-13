import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper } from '~/components/Common'
import { ToolTip } from '~/components/Common/InfoToolTip'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { ColumnList } from '~/components/types'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import type { AllaganResults, InBagsReport } from '~/requests/FFXIV/allagan'
import AllaganRequest from '~/requests/FFXIV/allagan'
import { getUserSessionData } from '~/sessions'

const formName = 'allaganData'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)

  if (!formData.has(formName)) {
    return json({ exception: 'Missing input' })
  }

  const input = formData.get(formName)

  if (!input || typeof input !== 'string') {
    return json({ exception: 'Missing input' })
  }
  try {
    const parsedInput = JSON.parse(input)
    if (!Array.isArray(parsedInput)) {
      throw new Error('Invalid input')
    }
    const trimmedInput = parsedInput.map(
      (current: {
        Id?: number
        Location?: string
        Source?: string
        Quantity?: number
        Type?: string
      }) => {
        if (!current.Id || !current.Location) {
          throw new Error('Invalid input, missing required fields.')
        }

        return {
          Id: current.Id,
          Location: current.Location,
          Source: current.Source,
          Quantity: current.Quantity,
          Type: current.Type
        }
      }
    )

    return await AllaganRequest({
      server: session.getWorld(),
      allaganJson: trimmedInput
    })
  } catch (error) {
    if (error instanceof Error) {
      return json({ exception: error.message })
    } else {
      return json({ exception: 'Unknown Error' })
    }
  }
}
type ActionResponse = AllaganResults | { exception: string } | {}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<ActionResponse>()
  const isLoading = transition.state === 'submitting'

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isLoading) {
      event.preventDefault()
    }
  }

  console.log(results)

  const error =
    results && 'exception' in results ? results.exception : undefined

  if (results) {
    if (Object.keys(results).length === 0) {
      return <NoResults href="/allagan-data" />
    }

    if ('in_bags_report' in results) {
      return <Results results={results} />
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Allagan Data"
        description="Input your Allagan generated data here, and we will turn it into useful stuff!"
        onClick={handleSubmit}
        loading={isLoading}
        error={error}>
        <div className="pt-2 flex-col">
          <div className="relative flex flex-1 items-center gap-1">
            <label
              htmlFor={formName}
              className="block text-sm font-medium text-gray-700 dark:text-gray-100">
              Allagan Data
            </label>
            <ToolTip
              data={'Paste the data copied from the Allagan tool here.'}
            />
          </div>
          <div className="mt-1 flex rounded-md shadow-sm border border-gray-300 dark:border-gray-400">
            <textarea
              id={formName}
              name={formName}
              className="p-2 w-full border-0 rounded-md focus:ring-blue-500 focus:border-2 focus:border-blue-500 dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600"
              placeholder="Paste your data here..."
              rows={5}
            />
          </div>
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => (
  <ErrorBounds error={error} />
)

const CheckValue = ({ getValue }: { getValue: () => unknown }) => {
  const value = getValue()
  if (value === '999,999,999') {
    return <p>Out of Stock</p>
  }

  if (value === '0') {
    return <p>Quantity Unknown</p>
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return <p>{value}</p>
  }

  return null
}

const CheckMinPrice = ({ getValue }: { getValue: () => unknown }) => {
  const value = getValue()
  if (value === '999,999,999') {
    return <p>Out of Stock</p>
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return <p>{value}</p>
  }

  return null
}

const columnList: Array<ColumnList<InBagsReport>> = [
  { columnId: 'name', header: 'Item Name' },
  { columnId: 'itemID', header: 'Item ID' },
  { columnId: 'value', header: 'Value', accessor: CheckValue },
  { columnId: 'min_price', header: 'Minimum Price', accessor: CheckMinPrice },
  {
    columnId: 'hq',
    header: 'High Quality',
    accessor: ({ getValue }) => (getValue() === true ? <p>Yes</p> : null)
  }
]

const mobileList: Array<ColumnList<InBagsReport>> = [
  { columnId: 'name', header: 'Item Name' },
  { columnId: 'value', header: 'Value', accessor: CheckValue }
]

const selectOptions = ['value', 'min_price']

const Results = ({ results }: { results: AllaganResults }) => {
  return (
    <PageWrapper>
      <SmallTable
        title="In Bags Report"
        description="A report showing the value and minimum price of items in your bags"
        data={results.in_bags_report}
        sortingOrder={[{ id: 'value', desc: true }]}
        columnList={columnList}
        mobileColumnList={mobileList}
        columnSelectOptions={selectOptions}
      />
    </PageWrapper>
  )
}
