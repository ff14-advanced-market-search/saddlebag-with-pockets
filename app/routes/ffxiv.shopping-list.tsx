import { TrashIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import TitleTooltip from '~/components/Common/TitleTooltip'
import CheckBox from '~/components/form/CheckBox'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { SubmitButton } from '~/components/form/SubmitButton'
import Select from '~/components/form/select'
import { dOHOptions } from '~/consts'
import type { ShoppingInputItem } from '~/requests/FFXIV/shopping-list'
import { getItemIDByName } from '~/utils/items'
import { ffxivItemsList } from '~/utils/items/id_to_item'

const FORM_DEFAULTS = {
  craft_amount: 1,
  hq: true,
  job: 8
}

type ShoppingFormItem = ShoppingInputItem & { name: string }

export default function Index() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [form, setForm] = useState<ShoppingFormItem | undefined>(undefined)
  const [shoppingList, setShoppingList] = useState<Array<ShoppingFormItem>>([])

  const handleSelect = (name: string) => {
    if (error) {
      setError(undefined)
    }

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
    <PageWrapper>
      <SmallFormContainer
        onClick={() => {}}
        title="Shopping list generator"
        hideSubmitButton={hideResultsTable}>
        <div className="pt-2">
          <div>
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
              containerClassNames="w-40"
            />
          </div>
        </div>
        {form && (
          <div className="flex flex-col gap-3 mx-1 my-2 border rounded-md shadow-md p-2 mt-3">
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
          <table className="text-gray-800 dark:text-gray-100 w-full my-4 border-t">
            <thead>
              <tr className="py-1">
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
                        shoppingList.filter(
                          (listItem) => listItem.itemID !== id
                        )
                      )
                    }}
                  />
                )
              })}
            </tbody>
          </table>
        )}
      </SmallFormContainer>
    </PageWrapper>
  )
}

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
          <TrashIcon
            className={`h-4 w-4 text-gray-700 mx-auto text-gray-100`}
          />
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
