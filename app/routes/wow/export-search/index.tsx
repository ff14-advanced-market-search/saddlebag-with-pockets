import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useMemo, useState } from 'react'
import { PageWrapper } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { WoWExportResponse } from '~/requests/WoW/ExportSearch'
import WoWExportSearch from '~/requests/WoW/ExportSearch'
import { getUserSessionData } from '~/sessions'
import { parseItemsForDataListSelect } from '~/utils/items/id_to_item'
import z from 'zod'
import { useActionData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import { getItemIDByName } from '~/utils/items'

const parseNumber = z.string().transform((value) => parseInt(value, 10))

const validateInput = z.object({
  itemID: parseNumber,
  populationWP: parseNumber,
  populationBlizz: parseNumber,
  rankingWP: parseNumber,
  minPrice: parseNumber,
  maxQuantity: parseNumber,
  sortBy: z.string(),
  connectedRealmIDs: z.record(z.string()).default({})
})
export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSessionData(request)

  const region = session.getWoWSessionData().region

  const formData = Object.fromEntries(await request.formData())

  const validatedFormData = validateInput.safeParse(formData)
  if (!validatedFormData.success) {
    return json({ exception: 'Invalid Input' })
  }

  console.log(JSON.stringify(validatedFormData.data, null, 2))
  return await WoWExportSearch({
    region,
    ...validatedFormData.data
  })
}

type ActionResponseType = {} | { exception: string } | WoWExportResponse

const ExportSearch = () => {
  const result = useActionData<ActionResponseType>()
  const transistion = useNavigation()
  const { wowItems } = useTypedSelector((state) => state.user)
  const [itemName, setItemName] = useState<string>('')

  const isSubmitting = transistion.state === 'submitting'

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isSubmitting) {
      event.preventDefault()
    }
  }

  const memoItems = useMemo(
    () => wowItems.map(parseItemsForDataListSelect),
    [wowItems]
  )

  const itemId = getItemIDByName(itemName.trim(), wowItems)
  const error = result && 'exception' in result ? result.exception : undefined
  console.log(result)

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Export Search"
        onClick={handleSubmit}
        error={error}
        loading={isSubmitting}>
        <div className="pt-3 flex flex-col">
          <DebouncedSelectInput
            title={'Item to search for'}
            label="Item"
            id="export-item-select"
            selectOptions={memoItems}
            onSelect={(itemName) => {
              setItemName(itemName)
            }}
          />
          <input hidden name="itemID" value={itemId} />
          <InputWithLabel
            labelTitle="Maximum Quantity"
            name="maxQuantity"
            type="number"
            defaultValue={1000}
          />

          <InputWithLabel
            labelTitle="Minimum Price"
            name="minPrice"
            type="number"
            defaultValue={1000}
          />
          <InputWithLabel
            labelTitle="Population"
            name="populationWP"
            type="number"
            defaultValue={1}
          />
          <InputWithLabel
            labelTitle="Population Blizzard"
            name="populationBlizz"
            type="number"
            defaultValue={1}
          />
          <InputWithLabel
            labelTitle="Ranking"
            name="rankingWP"
            type="number"
            defaultValue={90}
          />
          <InputWithLabel
            labelTitle="Sort By"
            name="sortBy"
            type="text"
            defaultValue={'minPrice'}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default ExportSearch
