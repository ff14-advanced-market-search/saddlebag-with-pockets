import type {
  ActionFunction,
  ErrorBoundaryComponent
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useTransition } from '@remix-run/react'
import type { ReactNode } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import { ToolTip } from '~/components/Common/InfoToolTip'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { SubmitButton } from '~/components/form/SubmitButton'
import type { ColumnList } from '~/components/types'
import { ErrorBoundary as ErrorBounds } from '~/components/utilities/ErrorBoundary'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import type { AllaganResults, InBagsReport } from '~/requests/FFXIV/allagan'
import AllaganRequest from '~/requests/FFXIV/allagan'
import { getUserSessionData } from '~/sessions'

const formName = 'allaganData'

const objectHasProperties = (object: Object) => {
  return Object.keys(object).length > 0
}

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

  const error =
    results && 'exception' in results ? results.exception : undefined

  if (results) {
    if (!objectHasProperties(results)) {
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

const CheckValue = ({ row }: { row: InBagsReport }) => {
  const value = row.value
  if (value === 999999999) {
    return <p>Out of Stock</p>
  }

  if (value === 0) {
    return <p>Quantity Unknown</p>
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return <p>{value.toLocaleString()}</p>
  }

  return null
}

const CheckMinPrice = ({ row }: { row: InBagsReport }) => {
  const value = row.min_price
  if (value === 999999999) {
    return <p>Out of Stock</p>
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return <p>{value.toLocaleString()}</p>
  }

  return null
}

const columnList: Array<ColumnList<InBagsReport>> = [
  { columnId: 'name', header: 'Item Name' },
  { columnId: 'value', header: 'Value', accessor: CheckValue },
  { columnId: 'min_price', header: 'Minimum Price', accessor: CheckMinPrice },
  {
    columnId: 'hq',
    header: 'High Quality',
    accessor: ({ getValue }) => (getValue() === true ? <p>Yes</p> : null)
  },
  {
    columnId: 'itemID',
    header: 'Universalis Link',
    accessor: ({ row }) => (
      <UniversalisBadgedLink
        link={`https://universalis.app/market/${row.itemID}`}
      />
    )
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
      <ContentContainer>
        <>
          <Title title="Undercut Alert Input" />
          {objectHasProperties(results.undercut_alert_json) ? (
            <>
              <CommandInstructions cmd="/ff undercut-register" />
              <div className="my-2">
                <SubmitButton
                  title="Copy to clipboard"
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault()
                    if (
                      typeof window !== 'undefined' &&
                      typeof document !== 'undefined'
                    ) {
                      if (!window.isSecureContext) {
                        alert('Unable to copy.')
                        return
                      }
                      await navigator.clipboard.writeText(
                        JSON.stringify(results.undercut_alert_json)
                      )
                      alert('Copied to clipboard!')
                    }
                  }}
                />
              </div>
              {results.undercut_items_not_up_to_date.length > 0 ? (
                <>
                  <h4 className="font-semibold text-blue-900 py-2 dark:text-gray-100">
                    Items below have out of date data
                  </h4>
                  <DescriptionText description="Please search for these items in game to ensure you have the most up to date data" />
                  <SimpleTable
                    tableKey="undercut"
                    data={results.undercut_items_not_up_to_date.map((curr) => ({
                      name: curr.real_name,
                      link: curr.link
                    }))}
                  />
                </>
              ) : (
                <DescriptionText description="All items up to date!" />
              )}
            </>
          ) : (
            <DescriptionText description="No undercut alert data found" />
          )}
        </>
      </ContentContainer>

      <ContentContainer>
        <>
          <Title title="Sale Alert Input" />
          {objectHasProperties(results.sale_alert_json) ? (
            <>
              <CommandInstructions cmd="/ff sale-register" />
              <div className="my-2">
                <SubmitButton
                  title="Copy to clipboard"
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault()
                    if (
                      typeof window !== 'undefined' &&
                      typeof document !== 'undefined'
                    ) {
                      if (!window.isSecureContext) {
                        alert('Unable to copy.')
                        return
                      }
                      await navigator.clipboard.writeText(
                        JSON.stringify(results.sale_alert_json)
                      )
                      alert('Copied to clipboard!')
                    }
                  }}
                />
              </div>
              {results.sale_items_not_up_to_date.length > 0 ? (
                <>
                  <h4 className="font-semibold text-blue-900 py-2 dark:text-gray-100">
                    Items below have out of date data
                  </h4>
                  <DescriptionText description="Please search for these items in game to ensure you have the most up to date data" />
                  <SimpleTable
                    data={results.sale_items_not_up_to_date}
                    tableKey="sales"
                  />
                </>
              ) : (
                <DescriptionText description="All items up to date!" />
              )}
            </>
          ) : (
            <DescriptionText description="No sale alert data found" />
          )}
        </>
      </ContentContainer>

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

const DescriptionText = ({ description }: { description: string }) => (
  <p className="italic text-sm text-grey-500 mb-1 dark:text-gray-300">
    {description}
  </p>
)

const SimpleTable = ({
  tableKey,
  data
}: {
  tableKey: string
  data: Array<{ name: string; link: string }>
}) => {
  return (
    <div className="overflow-y-scroll max-h-48">
      <table className="w-full relative divide-y divide-gray-300 dark:divide-gray-600">
        <thead className="w-screen">
          <tr className="text-gray-900 font-semibold dark:text-gray-100">
            <THead>Name</THead>
            <THead>Universalis Link</THead>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 dark:divide-gray-700 bg-white dark:bg-slate-800 dark:divide-gray-500 max-w-full">
          {data.map(({ name, link }) => {
            return (
              <tr
                key={`${tableKey}-${name}`}
                className="text-gray-700 dark:text-gray-300">
                <TCell>{name}</TCell>
                <TCell>
                  <UniversalisBadgedLink link={link} />
                </TCell>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const THead = ({ children }: { children: ReactNode }) => (
  <th className="py-2 px-3 sticky bg-gray-50 top-0 text-center cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-gray-600">
    {children}
  </th>
)

const TCell = ({ children }: { children: ReactNode }) => (
  <td className="text-center p-2">{children}</td>
)

const CommandInstructions = ({ cmd }: { cmd: string }) => (
  <p className="italic text-sm text-grey-500 mb-1 dark:text-gray-300">
    Copy this to your clipboard and use it in our{' '}
    <a
      className="underline"
      href="https://discord.gg/836C8wDVNq"
      target="_blank"
      rel="noreferrer">
      discord server
    </a>{' '}
    for the bot slash command '{cmd}' to activate or update{' '}
    <a
      className="underline"
      href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version"
      target="_blank"
      rel="noreferrer">
      patreon undercut alerts.
    </a>
  </p>
)
