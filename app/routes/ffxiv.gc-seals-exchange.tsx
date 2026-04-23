import { useActionData, useNavigation } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import NoResults from '~/components/Common/NoResults'
import { getUserSessionData } from '~/sessions'
import { useEffect, useState } from 'react'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import { PageWrapper } from '~/components/Common'
import { ClipboardIcon } from '@heroicons/react/outline'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import {
  GcSealsExchangeRequest,
  type GcSealsExchangeProps,
  type GcSealsExchangeResults,
  type GcSealsExchangeRow
} from '~/requests/FFXIV/gc-seals-exchange'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import z from 'zod'
import {
  parseCheckboxBoolean,
  parseStringToNumber,
  parseZodErrorsToDisplayString
} from '~/utils/zodHelpers'

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      console.error('Failed to copy text')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${
        copied ? 'text-green-500' : 'text-blue-500 hover:text-blue-700'
      } focus:outline-none`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}>
      <ClipboardIcon className="h-5 w-5 inline" />
    </button>
  )
}

export const meta = () => {
  return [
    { charset: 'utf-8' },
    { title: 'Saddlebag Exchange: FFXIV Grand Company Seals Exchange' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'Compare FFXIV market board prices to Grand Company seal costs for Expert Delivery. Find gear with the best GC seals per gil and GC experience on your home world or data center wide.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/ffxiv/gc-seals-exchange'
    }
  ]
}

const validateFormInput = z.object({
  home_server: z.string().min(1),
  max_item_cost: parseStringToNumber.pipe(z.number().min(1)),
  region_wide: parseCheckboxBoolean
})

const inputMap: Record<string, string> = {
  home_server: 'Home World',
  max_item_cost: 'Max item price (gil)',
  region_wide: 'Search entire data center'
}

type ActionResponse =
  | { data: GcSealsExchangeResults; payload: GcSealsExchangeProps }
  | { exception: string }
  | {}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const session = await getUserSessionData(request)
  formData.append('home_server', session.getWorld())

  const formPayload = Object.fromEntries(formData)
  const parsed = validateFormInput.safeParse(formPayload)

  if (!parsed.success) {
    return json({
      exception: parseZodErrorsToDisplayString(parsed.error, inputMap)
    })
  }

  const payload: GcSealsExchangeProps = {
    home_server: parsed.data.home_server,
    max_item_cost: parsed.data.max_item_cost,
    region_wide: parsed.data.region_wide
  }

  try {
    const data = await GcSealsExchangeRequest(payload)
    if (!data.length) {
      return json({ exception: 'No data found.', payload })
    }
    return json({ data, payload })
  } catch (err) {
    console.error('Error fetching GC seals exchange:', err)
    return json({ exception: 'Error fetching data.' })
  }
}

const parseServerError = (error: string) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API'
  }
  return error
}

const FFXIVGcSealsExchange = () => {
  const transition = useNavigation()
  const actionData = useActionData<ActionResponse>()
  const [maxItemCost, setMaxItemCost] = useState('1500')
  const [regionWide, setRegionWide] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (transition.state === 'submitting') {
      e.preventDefault()
    }
  }

  const data = actionData && 'data' in actionData ? actionData.data : undefined

  useEffect(() => {
    if (!actionData || Object.keys(actionData).length === 0) return

    const exception =
      actionData && 'exception' in actionData ? actionData.exception : undefined
    const payload =
      actionData && 'payload' in actionData ? actionData.payload : undefined

    if (data) {
      setError(undefined)
    } else if (exception) {
      if (exception === 'No data found.' && payload) {
        setError('No results found')
      } else {
        setError(`Server Error: ${parseServerError(exception)}`)
      }
    }
  }, [actionData, data])

  return (
    <PageWrapper>
      <div className="py-3">
        <SmallFormContainer
          title="Grand Company seals vs market price"
          description={
            <>
              Finds market listings at or below your max buyout price for Expert
              Delivery turn-ins: seal cost, seals per gil, and Grand Company
              experience via{' '}
              <a
                href="https://ffxiv.consolegameswiki.com/wiki/Grand_Company#Expert_Delivery_Missions"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer">
                Expert Delivery Missions
              </a>
              .
            </>
          }
          onClick={onSubmit}
          error={error}
          loading={transition.state === 'submitting'}
          disabled={false}>
          <>
            <InputWithLabel
              labelTitle="Max item price (gil)"
              name="max_item_cost"
              type="number"
              min={1}
              required
              value={maxItemCost}
              onChange={(e) => {
                setMaxItemCost(e.target.value)
                if (error) setError(undefined)
              }}
            />
            <div className="mt-4 flex items-center gap-2">
              <input
                id="region_wide"
                name="region_wide"
                type="checkbox"
                checked={regionWide}
                onChange={(e) => {
                  setRegionWide(e.target.checked)
                  if (error) setError(undefined)
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label
                htmlFor="region_wide"
                className="text-sm font-medium text-gray-700 dark:text-gray-100">
                Search entire data center (region-wide)
              </label>
            </div>
          </>
        </SmallFormContainer>
      </div>
      {error === 'No results found' && (
        <NoResults href="/ffxiv/gc-seals-exchange" />
      )}
      {data && (
        <SmallTable
          data={data}
          columnList={columnList}
          mobileColumnList={mobileColumnList}
          columnSelectOptions={['itemName']}
          sortingOrder={[{ id: 'gcSealsPerGil', desc: true }]}
        />
      )}
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<GcSealsExchangeRow>> = [
  {
    columnId: 'itemName',
    header: 'Name',
    accessor: ({ row: { itemName } }) => (
      <div className="flex items-center justify-between gap-2">
        <span>{itemName}</span>
        <CopyButton text={itemName} />
      </div>
    )
  },
  {
    columnId: 'universalis',
    header: 'Universalis',
    accessor: ({ row }) => (
      <UniversalisBadgedLink
        link={`https://universalis.app/market/${row.itemID}`}
      />
    )
  },
  {
    columnId: 'itemData',
    header: 'Item data',
    accessor: ({ row }) => (
      <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
    )
  },
  { columnId: 'listingServer', header: 'Server' },
  { columnId: 'price', header: 'Price (gil)' },
  { columnId: 'gcSealsPerGil', header: 'GC seals / gil' },
  { columnId: 'seals', header: 'GC seals' },
  { columnId: 'gcExperience', header: 'GC experience' },
  { columnId: 'itemLevel', header: 'Item Level' }
]

const mobileColumnList: Array<ColumnList<GcSealsExchangeRow>> = [
  {
    columnId: 'itemName',
    header: 'Name',
    accessor: ({ row: { itemName } }) => (
      <div className="flex items-center justify-between gap-2">
        <span>{itemName}</span>
        <CopyButton text={itemName} />
      </div>
    )
  },
  {
    columnId: 'universalis',
    header: 'Universalis',
    accessor: ({ row }) => (
      <UniversalisBadgedLink
        link={`https://universalis.app/market/${row.itemID}`}
      />
    )
  },
  {
    columnId: 'itemData',
    header: 'Item data',
    accessor: ({ row }) => (
      <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
    )
  },
  { columnId: 'listingServer', header: 'Server' },
  { columnId: 'price', header: 'Price (gil)' },
  { columnId: 'gcSealsPerGil', header: 'GC seals / gil' },
  { columnId: 'seals', header: 'GC seals' },
  { columnId: 'gcExperience', header: 'GC experience' },
  { columnId: 'itemLevel', header: 'Item Level' }
]

export default FFXIVGcSealsExchange
