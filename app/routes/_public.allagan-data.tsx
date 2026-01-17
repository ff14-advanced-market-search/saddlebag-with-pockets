import type {
  ActionFunction,
  MetaFunction,
  LoaderFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { ReactNode } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { SubmitButton } from '~/components/form/SubmitButton'
import { TextArea } from '~/components/form/TextArea'
import type { ColumnList } from '~/components/types'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import type { AllaganResults, InBagsReport } from '~/requests/FFXIV/allagan'
import AllaganRequest from '~/requests/FFXIV/allagan'
import { getUserSessionData } from '~/sessions'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

const formName = 'allaganData'

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: FFXIV Allagan Tools Data Import' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Input your Allagan Tools generated data here, and we will turn it into useful stuff!'
    },
    {
      name: 'customHeading',
      content: 'Welcome to the FFXIV Allagan Tools Data Import Page'
    },
    {
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/allagan-data'
    }
  ]
}

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

  type TrimmedInput = {
    id?: number
    source?: string
    quantity?: number
    type?: string
    'total quantity available'?: number
  } & (
    | { location: string; 'inventory location': never }
    | { location: never; 'inventory location': string }
  )

  if (!input || typeof input !== 'string') {
    return json({ exception: 'Missing input' })
  }
  try {
    const parsedInput = JSON.parse(input)
    if (!Array.isArray(parsedInput)) {
      throw new Error('Invalid input')
    }
    const trimmedInput = parsedInput.map((current: TrimmedInput) => {
      if (
        current.id === undefined ||
        (!current.location && !current['inventory location'])
      ) {
        throw new Error(
          "Missing required fields 'id' or 'location' from allagan tools. Make sure those columns are enabled in your plugin!"
        )
      }

      return {
        id: current.id,
        location: current.location ?? current['inventory location'],
        source: current.source,
        quantity: current.quantity ?? current['total quantity available'],
        type: current.type
      }
    })

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

export const loader: LoaderFunction = async ({ request }) => {
  return combineWithDiscordSession(request, {})
}

type ActionResponse =
  | AllaganResults
  | { exception: string }
  | Record<string, never>

const Index = () => {
  const results = useActionData<ActionResponse>()
  const loaderData = useLoaderData<{
    isLoggedIn: boolean
    hasPremium: boolean
    needsRefresh: boolean
  }>()

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
      <ContentContainer>
        <Title title="Allagan Data" />
        <span className="dark:text-gray-200">
          Input your Allagan generated data here, and we will turn it into
          useful stuff!{' '}
          <a
            href="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Allagan-Tools-Inventory-Analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 visited:text-purple-600 dark:visited:text-purple-400">
            Learn more about the Allagan Tools Inventory Analysis.
          </a>
        </span>
      </ContentContainer>
      <PremiumPaywall loaderData={loaderData}>
        <SmallFormContainer
          title="Allagan Data"
          description={undefined}
          onClick={() => {}}
          error={error}>
          <TextArea
            formName={formName}
            label="Allagan Data"
            toolTip="Paste the data copied from the Allagan tool here."
          />
        </SmallFormContainer>
      </PremiumPaywall>
    </PageWrapper>
  )
}

export default Index

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
              <CommandInstructions
                cmd="/ff undercut"
                title="Patreon undercut alerts."
                link="https://github.com/ff14-advanced-market-search/saddlebag-with-pockets/wiki/Undercut-Alerts---Alpha-version"
              />
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
              <CommandInstructions
                cmd="/ff sale-register"
                title="Patreon sale alerts."
              />
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
        csvOptions={{
          filename: 'saddlebag-allagan-inbag.csv',
          columns: [
            { value: 'itemID', title: 'Item ID' },
            { value: 'name', title: 'Item Name' },
            { value: 'min_price', title: 'Minimum Price' },
            { value: 'value', title: 'Item Value' },
            { value: 'hq', title: 'High Quality' }
          ]
        }}
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

const CommandInstructions = ({
  cmd,
  link,
  title
}: {
  cmd: string
  link?: string
  title: string
}) => (
  <p className="italic text-sm text-grey-500 mb-1 dark:text-gray-300">
    Copy this to your clipboard and use it in our{' '}
    <a
      className="underline"
      href="https://discord.gg/saddlebag-exchange-973380473281724476"
      target="_blank"
      rel="noreferrer">
      discord server
    </a>{' '}
    for the bot slash command '{cmd}' to activate or update{' '}
    {link ? (
      <a className="underline" href={link} target="_blank" rel="noreferrer">
        {title}
      </a>
    ) : (
      title
    )}
  </p>
)
