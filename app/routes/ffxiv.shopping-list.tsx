import { TrashIcon } from '@heroicons/react/solid'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useNavigate
} from '@remix-run/react'
import { useCallback, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import NoResults from '~/components/Common/NoResults'
import TitleTooltip from '~/components/Common/TitleTooltip'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CheckBox from '~/components/form/CheckBox'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { SubmitButton } from '~/components/form/SubmitButton'
import Select from '~/components/form/select'
import type { ColumnList } from '~/components/types'
import { dOHOptions } from '~/consts'
import type {
  ShoppingInputItem,
  GetShoppingListResponse,
  ShoppingListItem
} from '~/requests/FFXIV/shopping-list'
import GetShoppingList from '~/requests/FFXIV/shopping-list'
import { getUserSessionData } from '~/sessions'
import { getItemIDByName } from '~/utils/items'
import { ffxivItemsList } from '~/utils/items/id_to_item'
import PremiumPaywall from '~/components/Common/PremiumPaywall'
import { combineWithDiscordSession } from '~/components/Common/DiscordSessionLoader'

const VideoGuide = () => {
  return (
    <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          📺 Video Guide: How to Use the Shopping List Generator
        </h3>
        <p className="text-blue-700 dark:text-blue-300 mb-4 max-w-2xl">
          Learn how to effectively use this tool to find the best servers to buy
          crafting materials and plan your bulk crafting projects!
        </p>
        <div className="relative w-full max-w-2xl">
          <iframe
            className="w-full aspect-video rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/6wyHmxMr6Y8"
            title="FFXIV Shopping List Generator Guide"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

// Overwrite default meta in the root.tsx
export const meta: MetaFunction = () => {
  return {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
    title: 'Saddlebag Exchange: FFXIV Shopping List, Bulk Craft',
    description:
      'Find the best sever to buy items from the FFXIV marketboard. Find bulk crafting ingredients',
    links: [
      {
        rel: 'canonical',
        href: 'https://saddlebagexchange.com/ffxiv/shopping-list'
      }
    ]
  }
}

const FORM_DEFAULTS = {
  craft_amount: 5,
  hq: false,
  job: 0
}

const FORM_NAME = 'shopping-list'
const REGION_WIDE = 'region-wide'

type ShoppingFormItem = ShoppingInputItem & { name: string }
type ActionDataResponse = GetShoppingListResponse | { exception: string } | {}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const shoppingData = formData.get(FORM_NAME)
  const regionData = formData.get(REGION_WIDE)

  if (!shoppingData || typeof shoppingData !== 'string') {
    return json({ exception: 'Input not found' })
  }

  try {
    const shoppingList = JSON.parse(shoppingData)

    // Server-side validation for craft_amount
    for (const item of shoppingList) {
      if (
        item.craft_amount == null ||
        isNaN(item.craft_amount) ||
        item.craft_amount <= 0
      ) {
        return json({
          exception: `Invalid craft amount for item ID ${item.itemID}.`
        })
      }
    }

    const session = await getUserSessionData(request)
    const homeServer = session.getWorld()

    return GetShoppingList({
      shoppingList,
      homeServer,
      regionWide: regionData === 'on'
    })
  } catch {
    return json({ exception: 'Invalid form data.' })
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  return combineWithDiscordSession(request, {})
}

/**
 * Renders the main FFXIV shopping list page, handling premium access control, form submission, and result display.
 *
 * Displays a paywall if the user is not logged in or lacks premium status. Shows the shopping list form, and conditionally renders results or a no-results message based on server responses.
 */
export default function Index() {
  const loaderData = useLoaderData<{
    isLoggedIn: boolean
    hasPremium: boolean
    needsRefresh: boolean
  }>()
  const navigation = useNavigation()
  const actionData = useActionData<ActionDataResponse>()
  const error =
    actionData && 'exception' in actionData ? actionData.exception : undefined
  const loading = navigation.state === 'submitting'

  const results = actionData && 'data' in actionData ? actionData : undefined

  const noResults =
    (!results && actionData && !Object.keys(actionData).length) ||
    (results && results.data.length === 0)

  return (
    <PageWrapper>
      <VideoGuide />
      <PremiumPaywall loaderData={loaderData}>
        <ShoppingListForm error={error} loading={loading} />
      </PremiumPaywall>
      {noResults && <NoResults />}
      {results && <Results {...results} />}
    </PageWrapper>
  )
}

const Results = ({
  average_cost_per_craft,
  total_cost,
  data
}: GetShoppingListResponse) => {
  const summaryData = [
    { label: 'Average cost per craft', value: average_cost_per_craft },
    { label: 'Total cost', value: total_cost }
  ]

  return (
    <>
      <div className="h-4 w-full" />
      <SmallTable
        data={data}
        sortingOrder={[{ id: 'worldName', desc: true }]}
        columnList={columnList}
        mobileColumnList={columnList}
        columnSelectOptions={['pricePerUnit', 'quantity', 'worldName']}
        summaryData={summaryData}
      />
    </>
  )
}

const columnList: Array<ColumnList<ShoppingListItem>> = [
  { columnId: 'name', header: 'Item Name' },
  { columnId: 'pricePerUnit', header: 'Price Per Unit' },
  { columnId: 'quantity', header: 'Quantity' },
  { columnId: 'worldName', header: 'World' },
  {
    columnId: 'hq',
    header: 'High Quality',
    accessor: ({ getValue }) => {
      const value = getValue()
      return <p>{value === true ? 'Yes' : ''}</p>
    }
  }
]

const Row = ({
  name,
  craft_amount,
  hq,
  job,
  itemID,
  error,
  onClick,
  updateRow
}: ShoppingFormItem & {
  onClick: (id: number | string) => void
  error?: boolean
  updateRow: (row: ShoppingFormItem) => void
}) => {
  const form = { name, hq, job, itemID, craft_amount }
  return (
    <tr
      className={`px-4 py-2 my-3 mx-1 dark:text-gray-100${
        error
          ? ' shadow-[0px_0px_4px_2px_rgba(0,0,0,0.3)] shadow-red-500 rounded dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400'
          : ''
      }`}>
      <TableCell>{name}</TableCell>
      <TableCell>
        <input
          className="w-[70px] border border-gray-300 rounded-md dark:border-gray-400 dark:bg-gray-600"
          type="number"
          min="1"
          max="1000000000"
          value={craft_amount ?? ''}
          onChange={(e) => {
            const value = e.target.value

            // Handle empty input
            if (value === '') {
              updateRow({ ...form, craft_amount: undefined })
              return
            }

            const parsedValue = parseInt(value, 10)
            if (!isNaN(parsedValue)) {
              updateRow({ ...form, craft_amount: parsedValue })
            }
          }}
        />
        {error && (
          <p className="text-red-500 text-sm">Craft amount is required.</p>
        )}
      </TableCell>
      <TableCell>
        <input
          type="checkbox"
          checked={form.hq}
          onChange={(e) => {
            const checked = e.target.checked
            if (checked === undefined || checked === null) return
            updateRow({ ...form, hq: checked })
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          options={dOHOptions}
          value={form.job}
          onChange={(e) => {
            const value = e.target.value
            if (value === undefined || value === null) return

            updateRow({ ...form, job: parseInt(value) })
          }}
          className="min-w-[100px]"
        />
      </TableCell>
      <TableCell>
        <SubmitButton
          type="button"
          onClick={() => {
            onClick(itemID)
          }}>
          <TrashIcon className={`h-4 w-4 mx-auto text-white`} />
        </SubmitButton>
      </TableCell>
    </tr>
  )
}
const TableCell = ({ children }: { children: React.ReactNode }) => {
  return <td className="text-center min-w-[80px]">{children}</td>
}

const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <th className="text-center">{children}</th>
}

const ShoppingListForm = ({
  error,
  loading
}: {
  error?: string
  loading: boolean
}) => {
  const [shoppingList, setShoppingList] = useState<Array<ShoppingFormItem>>([])
  const disableList = shoppingList.length >= 10

  const handleSelect = useCallback(
    (name: string) => {
      if (disableList) {
        return
      }

      const itemID = getItemIDByName(name)

      if (
        !itemID ||
        shoppingList.find((item) => item.itemID.toString() === itemID)
      ) {
        return
      }

      setShoppingList([
        ...shoppingList,
        {
          itemID: parseInt(itemID, 10),
          name,
          ...FORM_DEFAULTS
        }
      ])
    },
    [shoppingList, disableList]
  )

  const hideResultsTable = shoppingList.length === 0

  return (
    <SmallFormContainer
      onClick={() => {}}
      title="Shopping list generator"
      loading={loading}
      hideSubmitButton={hideResultsTable}
      error={error}>
      <div className="py-2 flex flex-col max-w-md">
        <TitleTooltip
          title="Find Items"
          toolTip="Add up to 10 items to find crafting ingredients for"
          relative
        />
        <DebouncedSelectInput
          id="shopping-list-search"
          selectOptions={ffxivItemsList}
          formName={'shoppingList'}
          onSelect={handleSelect}
          error={error}
          placeholder="Search items..."
          disabled={disableList}
        />
      </div>
      {!hideResultsTable && (
        <div className="max-w-full overflow-x-scroll">
          <table className="min-w-full my-4 px-1 text-gray-800 dark:text-gray-100 border-t border-separate border-spacing-y-2">
            <thead className="mt-4 py-4">
              <tr>
                <TableHead>Item</TableHead>
                <TableHead>Craft Amount</TableHead>
                <TableHead>High Quality</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Remove Item</TableHead>
              </tr>
            </thead>
            <tbody>
              {shoppingList.map((item, index) => {
                return (
                  <Row
                    key={`${index}-${item.itemID}`}
                    error={!!error && error.includes(item.itemID.toString())}
                    {...item}
                    updateRow={(newForm) => {
                      const newList = shoppingList.map((row) => {
                        return newForm.itemID === row.itemID && row !== newForm
                          ? newForm
                          : row
                      })
                      setShoppingList(newList)
                    }}
                    onClick={(id) => {
                      setShoppingList(
                        shoppingList.filter(
                          (listItem) => listItem.itemID !== id
                        )
                      )
                    }}
                  />
                )
              })}
            </tbody>
            <input
              hidden
              readOnly
              name={FORM_NAME}
              value={JSON.stringify(shoppingList)}
            />
          </table>
          <div className="w-fit">
            <CheckBox labelTitle="Use Region Wide Search" name={REGION_WIDE} />
          </div>
        </div>
      )}
    </SmallFormContainer>
  )
}
