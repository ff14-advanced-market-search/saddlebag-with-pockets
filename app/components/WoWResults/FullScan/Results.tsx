import type {
  WoWOutOfStock,
  WoWProfitableItems,
  WoWScanResponseWithPayload
} from '~/requests/WoW/WOWScan'
import SmallTable from './SmallTable'
import type { ColumnList } from '~/components/types'
import { Section } from '~/components/Common'
import ExternalLink from '~/components/utilities/ExternalLink'
import { getOribosLink } from '~/components/utilities/getOribosLink'
import { useEffect, useRef } from 'react'
import { findRegionByWorldId } from '~/utils/WoWServers'

const woWHeadLink = ({ row }: { row: { itemID: number } }) => (
  <ExternalLink
    link={'https://www.wowhead.com/item=' + row.itemID}
    text='WoWHead'
  />
)

export const Results = ({ data }: { data: WoWScanResponseWithPayload }) => {
  const region = findRegionByWorldId(data.payload.homeRealmId)
  const newOribosLink = getOribosLink(
    data?.payload.newRealmServerName,
    'New World',
    region
  )
  const homeOribosLink = getOribosLink(
    data?.payload.homeRealmServerName,
    'Home World',
    region
  )

  const oosSelectOptions = ['price', 'historicPrice', 'salesPerDay']

  const oosColumnList: Array<ColumnList<WoWOutOfStock>> = [
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'price', header: 'Price' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    {
      columnId: 'WoWHead',
      header: 'WoWHead Link',
      accessor: woWHeadLink
    },
    {
      columnId: 'OribosNewWorld',
      header: 'Oribos New World',
      accessor: newOribosLink
    },
    {
      columnId: 'OribosHomeWorld',
      header: 'Oribos Home World',
      accessor: homeOribosLink
    }
  ]

  const mobileOosList: Array<ColumnList<WoWOutOfStock>> = [
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'historicPrice', header: 'Historic Price' }
  ]

  const profiableSelectOptions = [
    'profit',
    'historicPrice',
    'roi',
    'home_price',
    'new_price',
    'salesPerDay'
  ]

  const profitableItemsColumnList: Array<ColumnList<WoWProfitableItems>> = [
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'profit', header: 'Profit Per Sale' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    {
      columnId: 'roi',
      header: 'ROI Percentage',
      accessor: ({ getValue }) => <p>{`${getValue()}%`}</p>
    },
    { columnId: 'home_price', header: 'Home World Price' },
    { columnId: 'new_price', header: 'New World Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    {
      columnId: 'WoWHead',
      header: 'WoWHead Link',
      accessor: woWHeadLink
    },
    {
      columnId: 'OribosNewWorld',
      header: 'Oribos New World',
      accessor: newOribosLink
    },
    {
      columnId: 'OribosHomeWorld',
      header: 'Oribos Home World',
      accessor: homeOribosLink
    }
  ]

  const mobileProfitableItemsList: Array<ColumnList<WoWProfitableItems>> = [
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'profit', header: 'Profit Per Sale' }
  ]

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [divRef])

  const profitableItemsCSVOptions = {
    filename: 'saddlebag-profitable-items.csv',
    columns: [
      { title: 'Item ID', value: 'itemID' },
      { title: 'Item Name', value: 'name' },
      { title: 'Home Price', value: 'home_price' },
      { title: 'New Price', value: 'new_price' },
      { title: 'Historic Price', value: 'historicPrice' },
      { title: 'Price', value: 'profit' },
      { title: 'Return on investment', value: 'roi' },
      { title: 'Sales Per Day', value: 'salesPerDay' }
    ]
  }

  const outOfStockCSVOptions = {
    filename: 'saddlebag-oos-items.csv',
    columns: [
      { title: 'Item ID', value: 'itemID' },
      { title: 'Item Name', value: 'name' },
      { title: 'Price', value: 'price' },
      { title: 'Historic Price', value: 'historicPrice' },
      { title: 'Sales Per Day', value: 'salesPerDay' }
    ]
  }

  return (
    <div ref={divRef} className='my-4'>
      <Section>
        <>
          <SmallTable
            data={data.profit_w_sales}
            columnList={profitableItemsColumnList}
            mobileColumnList={mobileProfitableItemsList}
            columnSelectOptions={profiableSelectOptions}
            sortingOrder={[{ id: 'profit', desc: true }]}
            title='Profitable Items With Sales'
            description='This shows items you can buy on your home server and sell on your new server for a profit!'
            fitScreen={true}
            csvOptions={{
              ...profitableItemsCSVOptions,
              filename: 'saddlebag-profit-with-sales.csv'
            }}
          />
          <SmallTable
            data={data.out_w_sales}
            columnList={oosColumnList}
            mobileColumnList={mobileOosList}
            columnSelectOptions={oosSelectOptions}
            sortingOrder={[{ id: 'historicPrice', desc: true }]}
            title='Out of Stock Items With Sales'
            description='This shows items that are not listed on the new server. You can buy on your home server and sell them for any price you want on your new server!'
            fitScreen={true}
            csvOptions={{
              ...outOfStockCSVOptions,
              filename: 'saddlebag-oos-with-sales.csv'
            }}
          />
          <SmallTable
            data={data.profitable_items}
            columnList={profitableItemsColumnList}
            mobileColumnList={mobileProfitableItemsList}
            columnSelectOptions={profiableSelectOptions}
            sortingOrder={[{ id: 'profit', desc: true }]}
            title='Profitable Items'
            description='This shows items you can buy on your home server and sell on your new server for a profit!'
            csvOptions={profitableItemsCSVOptions}
            fitScreen={true}
          />
          <SmallTable
            data={data.out_of_stock}
            columnList={oosColumnList}
            mobileColumnList={mobileOosList}
            columnSelectOptions={oosSelectOptions}
            sortingOrder={[{ id: 'historicPrice', desc: true }]}
            title='Out of Stock Items'
            description='This shows items that are not listed on the new server. You can buy on your home server and sell them for any price you want on your new server!'
            fitScreen={true}
            csvOptions={outOfStockCSVOptions}
          />
        </>
      </Section>
    </div>
  )
}
