import { useMemo, useState, useEffect } from 'react'
import type { ActionFunction, LoaderFunction, MetaFunction, LinksFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { PageWrapper, TitleH2 } from '~/components/Common'
import NoResults from '~/components/Common/NoResults'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SelectDCandWorld from '~/components/form/select/SelectWorld'
import CheckBox from '~/components/form/CheckBox'
import { ClipboardIcon } from '@heroicons/react/outline'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import SmallTable from '~/components/Tables/SmallTable'
import { useDispatch } from 'react-redux'
import { setScripExchange } from '~/redux/reducers/queriesSlice'
import { useTypedSelector } from '~/redux/useTypedSelector'
import ScripExchangeRequest from '~/requests/FFXIV/scrip-exchange'
import type { ScripExchangeProps, ScripExchangeResults, ScripExchange } from '~/requests/FFXIV/scrip-exchange'
import { getUserSessionData } from '~/sessions'
import {
  createUnionSchema,
  parseCheckboxBoolean,
  parseStringToNumber,
  parseStringToNumberArray,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'
import Filter from '~/components/form/Filter'
import { getActionUrl, handleCopyButton, handleSearchParamChange } from '~/utils/urlSeachParamsHelpers'
import { SubmitButton } from '~/components/form/SubmitButton'
import { dOHOptions } from '~/consts'

const CopyButton = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      alert('Failed to copy text')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-blue-500 hover:text-blue-700 focus:outline-none">
      <ClipboardIcon className="h-5 w-5 inline" />
    </button>
  )
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Scrip Exchange Analysis',
    description: 'Analyze FFXIV Scrip Exchange data'
  }
}

export const links: LinksFunction = () => [
  {
    rel: 'canonical',
    href: 'https://saddlebagexchange.com/ffxiv/scrip-exchange'
  }
]

const PAGE_URL = '/ffxiv/scrip-exchange'

const validateFormInput = z.object({
  server: z.string(),
  color: z.enum(['Purple', 'Orange']),
  hideUnavailable: parseCheckboxBoolean
})

const defaultFormValues = {
  server: '',
  color: 'Purple' as const,
  hideUnavailable: true
}

const inputMap = {
  server: 'Server',
  color: 'Color',
  hideUnavailable: 'Hide Unavailable'
}

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const hideUnavailableParam = params.has('hideUnavailable')
    ? params.get('hideUnavailable')
    : defaultFormValues.hideUnavailable.toString()
  const hideUnavailable = hideUnavailableParam === 'true' ? 'on' : 'false'

  const values = {
    server: params.get('server') || defaultFormValues.server,
    color: params.get('color') || defaultFormValues.color,
    hideUnavailable
  }
  const validParams = validateFormInput.safeParse(values)

  if (validParams.success) {
    return json(validParams.data)
  }

  return json(defaultFormValues)
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)
  const validInput = validateFormInput.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: parseZodErrorsToDisplayString(validInput.error, inputMap)
    })
  }

  const input: ScripExchangeProps = {
    ...validInput.data
  }

  const result = await ScripExchangeRequest(input)

  return json(await result.json())
}

type ActionResponse = 
  | (ScripExchangeResults & { payload: ScripExchangeProps })
  | { exception: string }
  | {}

export default function ScripExchangePage() {
  const loaderData = useLoaderData<typeof defaultFormValues>()
  const actionData = useActionData<ActionResponse>()
  const transition = useNavigation()
  const loading = transition.state === 'submitting'

  const [searchParams, setSearchParams] = useState<typeof defaultFormValues>({
    ...loaderData
  })

  const showNoResults = actionData && !Object.keys(actionData).length

  const flatData = useMemo(() => {
    return !showNoResults && actionData && 'data' in actionData
      ? actionData.data
      : undefined
  }, [actionData, showNoResults])

  const error =
    actionData && 'exception' in actionData ? actionData.exception : undefined

  const handleFormChange = (
    name: keyof typeof defaultFormValues,
    value: string
  ) => {
    handleSearchParamChange(name, value)
    setSearchParams({ ...searchParams, [name]: value })
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        onClick={() => {}}
        error={error}
        loading={loading}
        title="Scrip Exchange Results"
        action={getActionUrl(PAGE_URL, searchParams)}>
        <div className="pt-2">
          <div className="flex justify-end mb-2">
            <SubmitButton
              title="Share this search!"
              onClick={handleCopyButton}
              type="button"
            />
          </div>
          <SelectDCandWorld
            navigation={transition}
            sessionData={loaderData}
            onServerChange={(server) => handleFormChange('server', server)}
          />
          <div className="my-1 flex flex-1 px-4">
            <select
              id="color"
              className="flex-1 min-w-0 block px-3 py-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block shadow-sm sm:text-sm border-gray-300 rounded-l-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400"
              name="color"
              defaultValue={loaderData.color}
              onChange={(e) => handleFormChange('color', e.target.value)}
            >
              <option value="Purple">Purple</option>
              <option value="Orange">Orange</option>
            </select>
            <label
              htmlFor="color"
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm shadow-sm dark:border-gray-400 dark:text-gray-300 dark:bg-gray-700"
            >
              Color
            </label>
          </div>
          <div className="mt-2">
            <CheckBox
              labelTitle={inputMap.hideUnavailable}
              defaultChecked={loaderData.hideUnavailable}
              name="hideUnavailable"
              onChange={(event) => {
                const value = event.target.checked
                handleFormChange('hideUnavailable', value.toString())
              }}
            />
          </div>
        </div>
      </SmallFormContainer>
      {showNoResults && <NoResults href="/ffxiv/scrip-exchange" />}
      {flatData && (
        <Results data={flatData} />
      )}
    </PageWrapper>
  )
}

const Results = ({
  data
}: {
  data: Array<ScripExchange>
}) => {
  return (
    <PageWrapper>
      <SmallTable
        data={data}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        sortingOrder={[{ id: 'valuePerScrip', desc: true }]}
      />
    </PageWrapper>
  )
}

const mobileColumnList = [
  { columnId: 'itemName', header: 'Item name' },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' }
]

const columnList: Array<ColumnList<ScripExchange>> = [
  {
    columnId: 'itemName',
    header: 'Item Name',
    accessor: ({ row: { itemName } }) => (
      <div className="flex items-center justify-between">
        <span>{itemName}</span>
        <CopyButton text={itemName} />
      </div>
    )
  },
  { columnId: 'cost', header: 'Cost' },
  { columnId: 'minPrice', header: 'Min Price' },
  { columnId: 'salesAmountNQ', header: 'Sales Amount NQ' },
  { columnId: 'quantitySoldNQ', header: 'Quantity Sold NQ' },
  { columnId: 'valuePerScrip', header: 'Value Per Scrip' },
  { columnId: 'saddleLink', header: 'Saddle Link' },
  { columnId: 'uniLink', header: 'Universalis Link' },
  { columnId: 'webpage', header: 'Web Page' }
]
