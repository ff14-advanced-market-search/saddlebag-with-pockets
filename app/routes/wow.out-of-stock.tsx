import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import type { OutOfStockItem } from '~/requests/WoW/OutOfStock'
import WoWOutOfStock from '~/requests/WoW/OutOfStock'
import { getUserSessionData } from '~/sessions'
import z from 'zod'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import {
  parseZodErrorsToDisplayString,
  parseStringToNumber
} from '~/utils/zodHelpers'
import {
  getActionUrl,
  handleCopyButton,
  handleSearchParamChange
} from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import { ExpansionSelect } from '~/components/form/WoW/WoWScanForm'
import type { MetaFunction, LinksFunction } from '@remix-run/node'
import ExternalLink from '~/components/utilities/ExternalLink'

const PAGE_URL = '/wow/out-of-stock'

const defaultFormValues = {
  salesPerDay: '0.2',
  avgPrice: '1000',
  minMarketValue: '100000',
  populationWP: '3000',
  populationBlizz: '1',
  rankingWP: '90',
  expansionNumber: '-1'
}

const inputMap: Record<string, string> = {
  salesPerDay: 'Sales Per Day',
  avgPrice: 'Average Price',
  minMarketValue: 'Minimum Market Value',
  populationWP: 'WoWProgress Population',
  populationBlizz: 'Blizzard Population',
  rankingWP: 'WoWProgress Ranking',
  expansionNumber: 'WoW Expansion'
}

const validateInput = z.object({
  salesPerDay: z.string().transform((value) => parseFloat(value)),
  avgPrice: parseStringToNumber,
  minMarketValue: parseStringToNumber,
  populationWP: parseStringToNumber,
  populationBlizz: parseStringToNumber,
  rankingWP: parseStringToNumber,
  expansionNumber: parseStringToNumber
})

type ActionResponseType =
  | {}
  | { exception: string }
  | ({ data: OutOfStockItem[] } & { sortby: string })

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const values = Object.fromEntries(
    Object.entries(defaultFormValues).map(([key, defaultValue]) => [
      key,
      params.get(key) || defaultValue
    ])
  )

  const validParams = validateInput.safeParse(values)
  if (!validParams.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validParams.error, inputMap)
    })
  }
  return json(validParams.data)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const region = session.getWoWSessionData().region

  const formData = Object.fromEntries(await request.formData())
  const validatedFormData = validateInput.safeParse(formData)

  if (!validatedFormData.success) {
    return json({
      exception: parseZodErrorsToDisplayString(
        validatedFormData.error,
        inputMap
      )
    })
  }

  try {
    const result = await WoWOutOfStock({
      ...validatedFormData.data,
      region,
      includeCategories: [],
      excludeCategories: []
    })

    if (!result.ok) {
      throw new Error(`API error: ${result.status}`)
    }

    const data = await result.json()
    if (!Array.isArray(data?.data)) {
      throw new Error('Invalid API response format')
    }

    return json({
      ...data,
      sortby: 'popWoWProgress'
    })
  } catch (error) {
    return json({
      exception: error instanceof Error ? error.message : 'An unexpected error occurred'
    })
  }
}

export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: WoW Out of Stock Items',
    description:
      'Find items that are out of stock on your realm with our WoW Out of Stock search!'
  }
}

export const links: LinksFunction = () => [
  { rel: 'canonical', href: 'https://saddlebagexchange.com/wow/out-of-stock' }
]

const OutOfStock = () => {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const result = useActionData<ActionResponseType>()
  const transition = useNavigation()

  const isSubmitting = transition.state === 'submitting'
  const [searchParams, setSearchParams] = useState(loaderData)
  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href={PAGE_URL} />
  }

  if (result && 'data' in result && !error) {
    return <Results {...result} />
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Out of Stock Items"
        description="Find items that are not listed on the auctionhouse of super high pop realms!"
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}
        action={getActionUrl(PAGE_URL, searchParams)}>
        <div className="pt-2">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
        </div>
        <div className="pt-3 flex flex-col">
          <ExpansionSelect
            defaultValue={loaderData.expansionNumber}
            onChange={(value) => handleFormChange('expansionNumber', value)}
          />
          {Object.entries(defaultFormValues)
            .filter(([key]) => key !== 'expansionNumber')
            .map(([key, defaultValue]) => (
              <InputWithLabel
                key={key}
                labelTitle={inputMap[key]}
                name={key}
                type="number"
                defaultValue={loaderData[key as keyof typeof defaultFormValues]}
                step={key === 'salesPerDay' ? '0.1' : '1'}
                min={0}
                onChange={(e) =>
                  handleFormChange(
                    key as keyof typeof defaultFormValues,
                    e.target.value
                  )
                }
              />
            ))}
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

const Results = ({
  data,
  sortby
}: {
  data: OutOfStockItem[]
  sortby: string
}) => {
  const { region } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <PageWrapper>
      <SmallTable
        title="Out of Stock Items"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList(region)}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'marketValue',
          'salesPerDay',
          'popWoWProgress',
          'rankWoWProgress'
        ]}
        data={data}
        csvOptions={{
          filename: 'saddlebag-out-of-stock.csv',
          columns: [
            { title: 'Item ID', value: 'itemID' },
            { title: 'Item Name', value: 'itemName' },
            { title: 'Market Value', value: 'marketValue' },
            { title: 'Sales Per Day', value: 'salesPerDay' },
            { title: 'Population', value: 'popWoWProgress' },
            { title: 'Rank', value: 'rankWoWProgress' },
            { title: 'Realm', value: 'realmNames' }
          ]
        }}
      />
    </PageWrapper>
  )
}

const columnList = (region: string): Array<ColumnList<OutOfStockItem>> => [
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'realmNames',
    header: 'Realm',
    accessor: ({ row }) => (
      <p className="px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.realmNames}
      </p>
    )
  },
  {
    columnId: 'saddlebagLink',
    header: 'Where to Buy',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  {
    columnId: 'undermineLink',
    header: 'Undermine Link',
    accessor: ({ getValue }) => <ExternalLink link={getValue() as string} />
  },
  { columnId: 'marketValue', header: 'Market Value' },
  { columnId: 'salesPerDay', header: 'Sales/Day' },
  { columnId: 'popWoWProgress', header: 'Population' },
  { columnId: 'rankWoWProgress', header: 'Rank' }
]

const mobileColumnList: Array<ColumnList<OutOfStockItem>> = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'realmNames', header: 'Realm' }
]

export default OutOfStock
