import { useActionData, useTransition } from '@remix-run/react'
import { PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import { RegionRadioGroup } from '~/components/form/WoW/RegionRadioGroup'
import WoWServerSelect from '~/components/form/WoW/WoWServerSelect'
import { useState } from 'react'
import type { WoWServerRegion } from '~/requests/WoW/types'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { z } from 'zod'
import type {
  ShortagePredictorProps,
  PredictionResponse,
  AlertJson,
  Prediction
} from '~/requests/WoW/ShortagePredictor'
import WoWShortagePredictor from '~/requests/WoW/ShortagePredictor'
import NoResults from '~/components/Common/NoResults'
import CodeBlock from '~/components/Common/CodeBlock'
import { TrashIcon } from '@heroicons/react/outline'
import Modal from '~/components/form/Modal'
import ModalButton from '~/components/Common/ModalButton'
import FullTable from '~/components/Tables/FullTable'
import type { ColumnList } from '../full-scan/SmallTable'
import { getOribosLink } from '~/components/utilities/getOribosLink'

const inputMap: Record<keyof ShortagePredictorProps, string> = {
  homeRealmName: 'Home Realm Name',
  region: 'Region',
  desiredAvgPrice: 'Average Price',
  desiredSalesPerDay: 'Sales Per Day',
  itemQuality: 'Quality',
  itemClass: 'Item Class',
  itemSubClass: 'Item Sub Class',
  desiredPriceVsAvgPercent: 'Desired Current Price Percent vs Average Price',
  desiredQuantityVsAvgPercent:
    'Desired Current Quantity Percent vs Average Quantity'
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const formPayload = Object.fromEntries(formData)

  const validateFormData = z.object({
    homeRealmName: z
      .string()
      .min(1)
      .transform((value) => value.split('---')[1]),
    region: z.union([z.literal('NA'), z.literal('EU')]),
    desiredAvgPrice: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value) * 10000),
    desiredSalesPerDay: z
      .string()
      .min(1)
      .transform((value) => parseFloat(value)),
    itemQuality: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    itemSubClass: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredPriceVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10)),
    desiredQuantityVsAvgPercent: z
      .string()
      .min(1)
      .transform((value) => parseInt(value, 10))
  })

  const validInput = validateFormData.safeParse(formPayload)

  if (!validInput.success) {
    return json({
      exception: `Missing: ${validInput.error.issues
        .map(({ path }) =>
          path.map(
            (field) =>
              inputMap[field as keyof ShortagePredictorProps] ||
              'Unknown input error'
          )
        )
        .join(', ')}`
    })
  }

  return WoWShortagePredictor(validInput.data)
}

const getCodeString = (alertJson: AlertJson, idsToFiler: Array<number>) => {
  return `{\n  "homeRealmName": "${alertJson.homeRealmName}",\n  "region": "${
    alertJson.region
  }",\n  "user_auctions": [${alertJson.user_auctions
    .filter((auction) => !idsToFiler.includes(auction.itemID))
    .map(({ itemID, price, desired_state }) => {
      return `\n    { "itemID": ${itemID}, "price": ${price}, "desired_state": "${desired_state}" }`
    })
    .join(',')}\n  ]\n}`
}

type ActionResponse = PredictionResponse | { exception: string } | {}

const Index = () => {
  const transition = useTransition()
  const results = useActionData<ActionResponse>()
  const [filteredIds, setFilteredIds] = useState<Array<number>>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [region, setRegion] = useState<WoWServerRegion>('NA')

  const pageTitle =
    'Commodity Shortage Futures - Find Shortages and Price Spikes before they happen! Get there before prices increase!'

  const loading = transition.state === 'submitting'

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
    }
  }

  if (results) {
    if (!Object.keys(results)) {
      return <NoResults href="/" title="No results found" />
    }

    if ('data' in results) {
      const codeString = getCodeString(results.alert_json, filteredIds)

      const OribosLink = getOribosLink(
        results.alert_json.homeRealmName,
        'Oribos'
      )

      const columnList: Array<ColumnList<Prediction>> = [
        { columnId: 'item_name', header: 'Item Name' },
        { columnId: 'current_price', header: 'Price' },
        { columnId: 'current_avg_price', header: 'Avg Price' },
        {
          columnId: 'current_price_vs_avg_percent',
          header: 'Price vs Avg %',
          accessor: ({ getValue }) => {
            const value = getValue()
            if (typeof value === 'string') {
              return <p>{parseFloat(value).toFixed(2)}%</p>
            }
            return <p>{(value as number).toFixed(2)}%</p>
          }
        },
        { columnId: 'current_quantity', header: 'Quantity Sold' },
        { columnId: 'avg_quantity', header: 'Avg Quantity' },
        {
          columnId: 'current_quantity_vs_avg_percent',
          header: 'Quantity vs Average',
          accessor: ({ getValue }) => {
            const value = getValue()
            if (typeof value === 'string') {
              return <p>{parseFloat(value).toFixed(2)}%</p>
            }
            return <p>{(value as number).toFixed(2)}%</p>
          }
        },
        {
          columnId: 'hours_til_shortage',
          header: 'ETA Hours untill Shortage'
        },
        { columnId: 'quality', header: 'Quality' },
        {
          columnId: 'quantity_decline_rate_per_hour',
          header: 'Quantity Decline Rate per Hour'
        },
        { columnId: 'tsm_avg_price', header: 'TSM Avg Price' },
        { columnId: 'tsm_avg_sale_rate_per_hour', header: 'TSM Sale Rate' },
        {
          columnId: 'item_id',
          header: 'Oribos Link',
          accessor: ({ row }) => OribosLink({ row: { itemID: row.item_id } })
        }
      ]

      return (
        <PageWrapper>
          <>
            <Title title={pageTitle} />
            <CodeBlock
              title="Discord Bot Alert Data --- Plug this into our discord bot with the command '/wow price-register', so we can monitor these items and alert you when the price spike happens!"
              buttonTitle="Copy"
              codeString={codeString}>
              <div className="max-w-[140px] my-3">
                <ModalButton onClick={() => setModalIsOpen(true)}>
                  Remove items
                </ModalButton>
              </div>
              {modalIsOpen && (
                <Modal
                  title="Choose which items you want to be alerted on here!"
                  onClose={() => setModalIsOpen(false)}>
                  <div className="max-w-full flex flex-col gap-3">
                    {results.data
                      .filter(
                        (auction) => !filteredIds.includes(auction.item_id)
                      )
                      .map((item) => (
                        <button
                          key={item.item_name}
                          className="flex group gap-1 p-2 items-center justify-between border border-gray-300 rounded-md"
                          onClick={() =>
                            setFilteredIds((state) => [...state, item.item_id])
                          }>
                          <span className="group-hover:scale-105 transition ease-in-out duration-300">{`${item.item_name}`}</span>
                          <TrashIcon className="h-4 w-4 shrink-0 ml-2 group-hover:scale-125 transition ease-in-out duration-300" />
                        </button>
                      ))}
                  </div>
                </Modal>
              )}
            </CodeBlock>
            <FullTable<Prediction>
              data={results.data}
              columnList={columnList}
              sortingOrder={[{ id: 'quality', desc: true }]}
              description="Some description"
            />
          </>
        </PageWrapper>
      )
    }
  }
  const error =
    results && 'exception' in results ? results.exception : undefined
  return (
    <PageWrapper>
      <SmallFormContainer
        title={pageTitle}
        onClick={onSubmit}
        error={error}
        loading={loading}>
        <div className="pt-2 md:pt-4">
          <InputWithLabel
            defaultValue={30}
            type="number"
            labelTitle="Desired Avg Price"
            inputTag="Gold"
            name="desiredAvgPrice"
            min={0}
            step={0.01}
            toolTip="Find items that on average sell for this amount of gold or more."
          />
          <InputWithLabel
            defaultValue={200}
            type="number"
            labelTitle="Desired Sales per Day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            toolTip="Finds items that have this many sales per day."
          />
          <ItemQualitySelect />
          <ItemClassSelect />
          <RegionRadioGroup
            defaultChecked={region}
            onChange={(val) => setRegion(val)}
          />
          <WoWServerSelect formName="homeRealmName" regionValue={region} />
          <InputWithLabel
            defaultValue={120}
            type="number"
            labelTitle="Current Price Percent Above Average"
            inputTag="%"
            name="desiredPriceVsAvgPercent"
            min={0}
            toolTip="What is the maximum price spike to look for? 120% is to only find item that are at most 20% above the average price, so you get there before prices increase. After prices increase too much competition will show up preventing the price from going higher."
          />
          <InputWithLabel
            defaultValue={30}
            type="number"
            labelTitle="Current Market Quantity Percentage"
            inputTag="%"
            name="desiredQuantityVsAvgPercent"
            min={0}
            toolTip="How much of the market quantity is left? For 30% we want to find items which only have 30% of their average quantity remaining in stock."
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index