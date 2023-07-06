import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useEffect, useMemo, useState } from 'react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import { useTypedSelector } from '~/redux/useTypedSelector'
import type { ExportItem, WoWExportResponse } from '~/requests/WoW/ExportSearch'
import WoWExportSearch from '~/requests/WoW/ExportSearch'
import { getUserSessionData } from '~/sessions'
import { parseItemsForDataListSelect } from '~/utils/items/id_to_item'
import z from 'zod'
import { useActionData, useNavigation } from '@remix-run/react'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import { getItemIDByName } from '~/utils/items'
import Select from '~/components/form/select'
import NoResults from '~/components/Common/NoResults'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { ColumnList } from '~/components/types'
import ExternalLink from '~/components/utilities/ExternalLink'
import { Differences } from '~/routes/queries/listings/Differences'
import ItemDataLink from '~/components/utilities/ItemDataLink'

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

  const result = await WoWExportSearch({
    region,
    ...validatedFormData.data
  })

  return json({
    ...(await result.json()),
    sortby: validatedFormData.data.sortBy
  })
}

type ActionResponseType =
  | {}
  | { exception: string }
  | (WoWExportResponse & { sortby: string })

const ExportSearch = () => {
  const result = useActionData<ActionResponseType>()
  const transistion = useNavigation()
  const { wowItems } = useTypedSelector((state) => state.user)
  const [itemName, setItemName] = useState<{ name: string; error: string }>({
    name: '',
    error: ''
  })

  const isSubmitting = transistion.state === 'submitting'

  const handleSelect = (value: string) => {
    setItemName({ error: '', name: value })
  }

  const memoItems = useMemo(
    () => wowItems.map(parseItemsForDataListSelect),
    [wowItems]
  )

  const itemId = getItemIDByName(itemName.name.trim(), wowItems)
  const error = result && 'exception' in result ? result.exception : undefined

  if (result && !Object.keys(result).length) {
    return <NoResults href="/wow/export-search" />
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
    if (!itemId) {
      setItemName({ ...itemName, error: 'Invalid item selected' })
    }
  }

  return (
    <PageWrapper>
      <SmallFormContainer
        title="Export Search"
        onClick={handleSubmit}
        error={error || itemName.error}
        loading={isSubmitting}>
        <div className="pt-3 flex flex-col">
          <DebouncedSelectInput
            title={'Item to search for'}
            label="Item"
            id="export-item-select"
            selectOptions={memoItems}
            onSelect={handleSelect}
          />
          <input hidden name="itemID" value={itemId} />
          <InputWithLabel
            labelTitle="Maximum Quantity"
            name="maxQuantity"
            type="number"
            defaultValue={1000}
            min={0}
          />

          <InputWithLabel
            labelTitle="Minimum Price"
            name="minPrice"
            type="number"
            defaultValue={1000}
            min={0}
          />
          <InputWithLabel
            labelTitle="Population"
            name="populationWP"
            type="number"
            defaultValue={1}
            min={1}
          />
          <InputWithLabel
            labelTitle="Population Blizzard"
            name="populationBlizz"
            type="number"
            defaultValue={1}
            min={1}
          />
          <InputWithLabel
            labelTitle="Ranking"
            name="rankingWP"
            type="number"
            defaultValue={90}
            min={1}
          />
          <Select
            title="Sort Results By"
            name="sortBy"
            defaultValue={'minPrice'}
            options={[
              { label: 'Minimum Price', value: 'minPrice' },
              { label: 'Item Quantity', value: 'itemQuantity' },
              { label: 'Realm Population', value: 'realmPopulationReal' },
              { label: 'Realm Ranking', value: 'realmRanking' }
            ]}
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default ExportSearch

const differencesBlue =
  'bg-blue-100 text-blue-900 font-semibold dark:bg-blue-600 dark:text-gray-100'

const Results = ({
  data,
  sortby,
  itemInfo
}: WoWExportResponse & { sortby: string }) => {
  useEffect(() => {
    if (window && document) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
  }, [])
  return (
    <PageWrapper>
      <ContentContainer>
        <div className="flex flex-col min-w-full">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Title title={itemInfo.itemName} />
            <ItemDataLink link={itemInfo.link} />
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex  flex-col md:min-w-[50%] justify-center">
              <Differences
                className={differencesBlue}
                diffTitle="Average Min Price"
                diffAmount={itemInfo.avgMinPrice}
              />
              <Differences
                className={differencesBlue}
                diffTitle="Avg TSM Price"
                diffAmount={itemInfo.avgTSMPrice}
              />
            </div>
            <div className="flex flex-col md:min-w-[50%] justify-center">
              <Differences
                className={differencesBlue}
                diffTitle="Sales per Day"
                diffAmount={itemInfo.salesPerDay}
              />
              <Differences
                className={differencesBlue}
                diffTitle="Average Server Quantity"
                diffAmount={itemInfo.avgServerQuantity}
              />
            </div>
          </div>
        </div>
      </ContentContainer>
      <SmallTable
        title="Export Results"
        description="Results for your item in different worlds"
        sortingOrder={[{ desc: true, id: sortby }]}
        columnList={columnList}
        mobileColumnList={mobileColumnList}
        columnSelectOptions={[
          'minPrice',
          'itemQuantity',
          'realmPopulationReal',
          'realmRanking'
        ]}
        data={data}
      />
    </PageWrapper>
  )
}

const columnList: Array<ColumnList<ExportItem>> = [
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'itemQuantity', header: 'Item Quantity' },
  { columnId: 'realmPopulationReal', header: 'Realm Population' },
  { columnId: 'realmPopulationInt', header: 'Realm Pop Int' },
  { columnId: 'realmRanking', header: 'Realm Ranking' },
  {
    columnId: 'undermineLink',
    header: 'Undermine Link',
    accessor: ({ getValue }) => (
      <ExternalLink text="Undermine" link={getValue() as string} />
    )
  }
]
const mobileColumnList: Array<ColumnList<ExportItem>> = [
  {
    columnId: 'connectedRealmNames',
    header: 'Realm Names',
    accessor: ({ row }) => (
      <p className=" px-3 py-2 max-w-[200px] overflow-x-scroll">
        {row.connectedRealmNames.join(', ')}
      </p>
    )
  },
  { columnId: 'minPrice', header: 'Minimum Price' }
]
