import { useActionData, useLoaderData, useTransition } from '@remix-run/react'
import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import {
  ItemClassSelect,
  ItemQualitySelect
} from '~/components/form/WoW/WoWScanForm'
import { useState } from 'react'
import type { WoWLoaderData } from '~/requests/WoW/types'
import { InputWithLabel } from '~/components/form/InputWithLabel'
import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
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
import Modal from '~/components/form/Modal'
import ModalButton from '~/components/Common/ModalButton'
import FullTable from '~/components/Tables/FullTable'
import type { ColumnList } from '../full-scan/SmallTable'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import Label from '~/components/form/Label'
import { SubmitButton } from '~/components/form/SubmitButton'
import RegionAndServerSelect from '~/components/form/WoW/RegionAndServerSelect'
import { getUserSessionData } from '~/sessions'

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

export const loader: LoaderFunction = async ({ request }) => {
  const { getWoWSessionData } = await getUserSessionData(request)
  const { server, region } = getWoWSessionData()
  return json({ wowRealm: server, wowRegion: region })
}

const Index = () => {
  const transition = useTransition()
  const { wowRealm, wowRegion } = useLoaderData<WoWLoaderData>()
  const results = useActionData<ActionResponse>()
  const [filteredIds, setFilteredIds] = useState<Array<number>>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)

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
        'Oribos',
        results.alert_json.region
      )

      const columnList: Array<ColumnList<Prediction>> = [
        { columnId: 'item_name', header: 'Item Name' },
        {
          columnId: 'item_id_filter',
          header: 'Added to Alert Input',
          accessor: ({ row }) => {
            const itemId = row.item_id
            return (
              <input
                className="min-w-[16px] min-h-[16px] mx-20 border-box rounded-md"
                type="checkbox"
                checked={!filteredIds.includes(itemId)}
                onChange={() => {
                  if (filteredIds.includes(itemId)) {
                    setFilteredIds(filteredIds.filter((id) => id !== itemId))
                  } else {
                    setFilteredIds([...filteredIds, itemId])
                  }
                }}
              />
            )
          }
        },
        {
          columnId: 'item_id',
          header: 'Oribos Link',
          accessor: ({ row }) => OribosLink({ row: { itemID: row.item_id } })
        },
        { columnId: 'quality', header: 'Quality' },
        {
          columnId: 'hours_til_shortage',
          header: 'Estimated Hours until Shortage'
        },
        {
          columnId: 'quantity_decline_rate_per_hour',
          header: 'Quantity Decline Rate per Hour'
        },
        {
          columnId: 'tsm_avg_sale_rate_per_hour',
          header: 'TSM Sales Per Hour'
        },
        {
          columnId: 'current_quantity_vs_avg_percent',
          header: 'Quantity Percent Available',
          accessor: ({ getValue }) => {
            const value = getValue()
            if (typeof value === 'string') {
              return <p>{parseFloat(value).toFixed(2)}%</p>
            }
            return <p>{(value as number).toFixed(2)}%</p>
          }
        },
        {
          columnId: 'current_quantity',
          header: 'Current Quantity Amount Available'
        },
        { columnId: 'avg_quantity', header: 'Avg Quantity' },
        { columnId: 'current_price', header: 'Price' },
        { columnId: 'current_avg_price', header: 'Avg Price' },
        { columnId: 'tsm_avg_price', header: 'TSM Avg Price' },
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
        }
      ]

      return (
        <PageWrapper>
          <>
            <ContentContainer>
              <>
                <Title title={pageTitle} />
                <Label>
                  Discord Bot Alert Data --- Plug this into our discord bot with
                  the command '/wow price-register', so we can monitor these
                  items and alert you when the price spike happens!
                </Label>
                <div className="flex justify-between items-center">
                  <div className="h-9">
                    <SubmitButton
                      title="Copy Input Data"
                      onClick={async () => {
                        if (
                          typeof window !== 'undefined' &&
                          typeof document !== 'undefined'
                        ) {
                          if (!window.isSecureContext) {
                            alert('Failed to copy text to clipboard')
                            return
                          }
                          await navigator.clipboard.writeText(codeString)
                          alert('Copied to clipboard')
                        }
                      }}
                    />
                  </div>
                  <div className="max-w-[140px] my-3">
                    <ModalButton onClick={() => setModalIsOpen(true)}>
                      View input
                    </ModalButton>
                  </div>
                </div>
              </>
            </ContentContainer>

            {modalIsOpen && (
              <Modal title="" onClose={() => setModalIsOpen(false)}>
                <pre className="overflow-x-scroll bg-slate-700 text-gray-200 p-4 rounded w-full">
                  <code>{codeString}</code>
                </pre>
              </Modal>
            )}

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
            defaultValue={20}
            type="number"
            labelTitle="Minimum Desired Avg Price"
            inputTag="Gold"
            name="desiredAvgPrice"
            min={0}
            step={0.01}
            toolTip="Find items that on average sell for this amount of gold or more."
          />
          <InputWithLabel
            defaultValue={200}
            type="number"
            labelTitle="Minimum Desired Sales per Day"
            inputTag="Sales"
            name="desiredSalesPerDay"
            min={0}
            toolTip="Finds items that have this many sales per day."
          />
          <ItemQualitySelect />
          <ItemClassSelect />
          <RegionAndServerSelect
            serverSelectFormName="homeRealmName"
            region={wowRegion}
            defaultRealm={wowRealm}
          />
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
            defaultValue={50}
            type="number"
            labelTitle="Current Market Quantity Percentage"
            inputTag="%"
            name="desiredQuantityVsAvgPercent"
            min={0}
            toolTip="How much of the market quantity is left? For 50% we want to find items which only have 50% of their average quantity remaining in stock."
          />
        </div>
      </SmallFormContainer>
    </PageWrapper>
  )
}

export default Index
