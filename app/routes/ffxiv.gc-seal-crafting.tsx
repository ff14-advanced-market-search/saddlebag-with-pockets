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
import Select from '~/components/form/select'
import Filter from '~/components/form/Filter'
import {
  GcSealCraftingRequest,
  type GcSealCraftingProps,
  type GcSealCraftingResults,
  type GcSealCraftingRow
} from '~/requests/FFXIV/gc-seal-crafting'
import type { ColumnList } from '~/components/types'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'
import { dOHOptions } from '~/consts'
import z from 'zod'
import {
  createUnionSchema,
  parseStringToNumber,
  parseStringToNumberArray,
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
    {
      title:
        'Saddlebag Exchange: FFXIV Grand Company seal crafting (material cost)'
    },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    {
      name: 'description',
      content:
        'FFXIV Expert Delivery crafting: estimate craft cost from regional material median or average prices, then compare GC seals and experience per gil for turn-in items.'
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://saddlebagexchange.com/ffxiv/gc-seal-crafting'
    }
  ]
}

const materialMetricSchema = createUnionSchema(['median', 'average'] as const)

const validateFormInput = z.object({
  home_server: z.string().min(1),
  material_price_metric: materialMetricSchema,
  max_material_cost: parseStringToNumber.pipe(z.number().min(1)),
  jobs: parseStringToNumberArray.pipe(z.array(z.number()).min(1))
})

const inputMap: Record<string, string> = {
  home_server: 'Home World',
  material_price_metric: 'Material price metric',
  max_material_cost: 'Max material cost (gil)',
  jobs: 'Disciples of the Hand'
}

type ActionResponse =
  | { data: GcSealCraftingResults; payload: GcSealCraftingProps }
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

  const payload: GcSealCraftingProps = {
    home_server: parsed.data.home_server,
    material_price_metric: parsed.data.material_price_metric,
    max_material_cost: parsed.data.max_material_cost,
    jobs: parsed.data.jobs
  }

  try {
    const data = await GcSealCraftingRequest(payload)
    if (!data.length) {
      return json({ exception: 'No data found.', payload })
    }
    return json({ data, payload })
  } catch (err) {
    console.error('Error fetching GC seal crafting:', err)
    return json({ exception: 'Error fetching data.' })
  }
}

const parseServerError = (error: string) => {
  if (error.includes('Error fetching data:')) {
    return 'Failed to receive result from external API'
  }
  return error
}

const FFXIVGcSealCrafting = () => {
  const transition = useNavigation()
  const actionData = useActionData<ActionResponse>()
  const [maxMaterialCost, setMaxMaterialCost] = useState('5000')
  const [materialMetric, setMaterialMetric] = useState<'median' | 'average'>(
    'median'
  )
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
          title="Grand Company seals: crafted turn-ins"
          description={
            <>
              Estimates how much it costs to craft each item using regional
              material prices (median or average), then shows GC seals and
              experience per gil for{' '}
              <a
                href="https://ffxiv.consolegameswiki.com/wiki/Grand_Company#Expert_Delivery_Missions"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer">
                Expert Delivery
              </a>{' '}
              turn-ins. Uses your home world from site options.
            </>
          }
          onClick={onSubmit}
          error={error}
          loading={transition.state === 'submitting'}
          disabled={false}>
          <>
            <Select
              title="Material price metric"
              name="material_price_metric"
              id="material_price_metric"
              value={materialMetric}
              options={[
                { label: 'Median (region)', value: 'median' },
                { label: 'Average (region)', value: 'average' }
              ]}
              onChange={(e) => {
                const v = e.target.value
                if (v === 'median' || v === 'average') {
                  setMaterialMetric(v)
                  if (error) setError(undefined)
                }
              }}
            />
            <InputWithLabel
              labelTitle="Max material cost (gil)"
              name="max_material_cost"
              type="number"
              min={1}
              required
              value={maxMaterialCost}
              onChange={(e) => {
                setMaxMaterialCost(e.target.value)
                if (error) setError(undefined)
              }}
            />
            <Filter
              formName="jobs"
              defaultValue={[0]}
              options={dOHOptions}
              title="Disciples of the Hand"
            />
          </>
        </SmallFormContainer>
      </div>
      {error === 'No results found' && (
        <NoResults href="/ffxiv/gc-seal-crafting" />
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

const columnList: Array<ColumnList<GcSealCraftingRow>> = [
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
  { columnId: 'craftCostGil', header: 'Craft cost (gil)' },
  { columnId: 'gcSealsPerGil', header: 'GC seals / gil' },
  { columnId: 'seals', header: 'GC seals' },
  { columnId: 'gcExperience', header: 'GC experience' },
  { columnId: 'itemLevel', header: 'Item Level' }
]

const mobileColumnList: Array<ColumnList<GcSealCraftingRow>> = [
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
  { columnId: 'craftCostGil', header: 'Craft cost (gil)' },
  { columnId: 'gcSealsPerGil', header: 'GC seals / gil' },
  { columnId: 'seals', header: 'GC seals' },
  { columnId: 'gcExperience', header: 'GC experience' }
]

export default FFXIVGcSealCrafting
