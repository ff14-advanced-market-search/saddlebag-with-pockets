import { TrashIcon } from '@heroicons/react/solid'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useActionData, useNavigation } from '@remix-run/react'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import TitleTooltip from '~/components/Common/TitleTooltip'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import CheckBox from '~/components/form/CheckBox'
import { InputWithLabel } from '~/components/form/InputWithLabel'
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

const FORM_DEFAULTS = {
  craft_amount: 1,
  hq: true,
  job: 8
}

const FORM_NAME = 'shopping-list'

type ShoppingFormItem = ShoppingInputItem & { name: string }
type ActionDataResponse = GetShoppingListResponse | { exception: string } | {}

export const action: ActionFunction = async ({ request }) => {
  const formData = (await request.formData()).get(FORM_NAME)
  if (!formData || typeof formData !== 'string') {
    return json({ exception: 'Input not found' })
  }
  try {
    const shoppingList = JSON.parse(formData)
    const session = await getUserSessionData(request)

    const homeServer = session.getWorld()

    return GetShoppingList({ shoppingList, homeServer })
  } catch {
    return json({ exception: 'Invalid form data.' })
  }
}

export default function Index() {
  const navigation = useNavigation()
  const actionData = useActionData<ActionDataResponse>()
  const error =
    actionData && 'exception' in actionData ? actionData.exception : undefined
  const loading = navigation.state === 'submitting'

  const results = actionData && 'data' in actionData ? actionData : undefined

  console.log(actionData)

  return (
    <PageWrapper>
      <ShoppingListForm error={error} loading={loading} />
      {results && <Results {...results} />}
    </PageWrapper>
  )
}

const Results = ({ data }: GetShoppingListResponse) => {
  return (
    <>
      <div className="h-4 w-full" />
      <SmallTable
        data={data}
        sortingOrder={[{ id: 'pricePerUnit', desc: true }]}
        columnList={columnList}
        mobileColumnList={columnList}
        columnSelectOptions={['pricePerUnit', 'quantity']}
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
      return <p>{getValue() === true ? 'Yes' : ''}</p>
    }
  }
]

const Row = ({
  name,
  craft_amount,
  hq,
  job,
  itemID,
  onClick
}: ShoppingFormItem & { onClick: (id: number | string) => void }) => {
  return (
    <tr className={`gap-2 px-4 py-2 dark:text-gray-100`}>
      <TableCell>{name}</TableCell>
      <TableCell>{craft_amount}</TableCell>
      <TableCell>{hq ? 'Yes' : 'No'}</TableCell>
      <TableCell>{findJobName(job)}</TableCell>
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
  return <td className="text-center">{children}</td>
}

const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <th className="text-center">{children}</th>
}

const findJobName = (jobId: number) => {
  const job = dOHOptions.find(({ value }) => value === jobId)
  if (!job) {
    return undefined
  }

  return job.label
}

const ShoppingListForm = ({
  error,
  loading
}: {
  error?: string
  loading: boolean
}) => {
  const [form, setForm] = useState<ShoppingFormItem | undefined>(undefined)
  const [shoppingList, setShoppingList] = useState<Array<ShoppingFormItem>>([])

  const handleSelect = (name: string) => {
    const itemID = getItemIDByName(name)

    if (!itemID) {
      setForm(undefined)
      return
    }

    setForm({
      itemID: parseInt(itemID, 10),
      name,
      ...FORM_DEFAULTS
    })
  }

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
          toolTip="Add items to find crafting ingredients for"
          relative
        />
        <DebouncedSelectInput
          id="shopping-list-search"
          selectOptions={ffxivItemsList}
          formName={'shoppingList'}
          onSelect={handleSelect}
          error={error}
          placeholder="Search items..."
        />
      </div>
      {form && (
        <div className="flex flex-col gap-3 mx-1 mt-3 mb-2 p-2 border rounded-md shadow-md">
          <p className="text-md font-bold text-gray-700 dark:text-gray-100">
            {form.name}
          </p>
          <InputWithLabel
            labelTitle="Amount to craft"
            inputTag="No#"
            type="number"
            value={form.craft_amount}
            min={1}
            onChange={(e) => {
              const value = e.target.value

              if (value === undefined || value === null) return

              const craft_amount = parseInt(value, 10)
              setForm({ ...form, craft_amount })
            }}
          />
          <CheckBox
            labelTitle="High Quality"
            labelClassName="text-sm font-medium text-gray-700 dark:text-gray-100"
            checked={form.hq}
            onChange={(e) => {
              const checked = e.target.checked
              if (checked === undefined || checked === null) return
              setForm({ ...form, hq: checked })
            }}
          />

          <Select
            title="DoH To Use"
            options={dOHOptions}
            onChange={(e) => {
              const value = e.target.value
              if (value === undefined || value === null) return

              setForm({ ...form, job: parseInt(value) })
            }}
          />
          <SubmitButton
            title="Add +"
            className="max-w-[80px]"
            type="button"
            onClick={() => {
              setForm(undefined)
              setShoppingList([...shoppingList, form])
            }}
          />
        </div>
      )}
      {!hideResultsTable && (
        <table className="w-full my-4 text-gray-800 dark:text-gray-100 border-t">
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
                  {...item}
                  onClick={(id) => {
                    setShoppingList(
                      shoppingList.filter((listItem) => listItem.itemID !== id)
                    )
                  }}
                />
              )
            })}
          </tbody>
          <input hidden name={FORM_NAME} value={JSON.stringify(shoppingList)} />
        </table>
      )}
    </SmallFormContainer>
  )
}
