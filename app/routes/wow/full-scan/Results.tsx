import type {
  WoWOutOfStock,
  WoWProfitableItems,
  WoWScanResponseWithPayload
} from '~/requests/WOWScan'
import SmallTable from './SmallTable'
import type { ColumnList } from './SmallTable'
import { Section } from '~/components/Common'
import ExternalLink from '~/components/utilities/ExternalLink'

export const Results = ({ data }: { data: WoWScanResponseWithPayload }) => {
  const oosColumnList: Array<ColumnList<WoWOutOfStock>> = [
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'price', header: 'Price' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' }
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
      accessor: ({ row }) => (
        <ExternalLink
          link={'https://www.wowhead.com/item=' + row.itemID}
          text="WoWHead"
        />
      )
    },
    {
      columnId: 'OribosNewWorld',
      header: 'Oribos New World',
      accessor: ({ row }) => {
        const itemId = row.itemID
        if (typeof itemId !== 'number') return null

        const serverName = data?.payload.newRealmServerName

        if (!serverName) return null

        const editedServerName = serverName
          .replaceAll('-', '')
          .replaceAll("'", '')
          .replaceAll(' ', '-')
          .toLowerCase()

        return (
          <ExternalLink
            link={`https://oribos.exchange/#us-${editedServerName}/${itemId}`}
            text="New World"
            tooltip="Oribos marketplace new world link"
          />
        )
      }
    },
    {
      columnId: 'OribosHomeWorld',
      header: 'Oribos Home World',
      accessor: ({ row }) => {
        const itemId = row.itemID
        if (typeof itemId !== 'number') return null

        const serverName = data?.payload.homeRealmServerName

        if (!serverName) return null

        const editedServerName = serverName
          .replaceAll('-', '')
          .replaceAll("'", '')
          .replaceAll(' ', '-')
          .toLowerCase()

        return (
          <ExternalLink
            link={`https://oribos.exchange/#us-${editedServerName}/${itemId}`}
            text="Home World"
            tooltip="Oribos marketplace home world link"
          />
        )
      }
    }
  ]

  return (
    <div className="my-4">
      <Section>
        <>
          <SmallTable<WoWProfitableItems>
            data={data.profitable_items}
            columnList={profitableItemsColumnList}
            sortingOrder={[{ id: 'profit', desc: true }]}
            title="Profitable Items"
            description="This shows items you can buy on your home server and sell on your new server for a profit!"
          />
          <SmallTable<WoWOutOfStock>
            data={data.out_of_stock}
            columnList={oosColumnList}
            sortingOrder={[{ id: 'historicPrice', desc: true }]}
            title="Out of Stock Items"
            description="This shows items that are not listed on the new server. You can buy on your home server and sell them for any price you want on your new server!"
          />
          <SmallTable<WoWProfitableItems>
            data={data.profit_w_sales}
            columnList={profitableItemsColumnList}
            sortingOrder={[{ id: 'profit', desc: true }]}
            title="Profitable Items With Sales"
            description="This shows items you can buy on your home server and sell on your new server for a profit!"
          />
          <SmallTable<WoWOutOfStock>
            data={data.out_w_sales}
            columnList={oosColumnList}
            sortingOrder={[{ id: 'historicPrice', desc: true }]}
            title="Out of Stock Items With Sales"
            description="This shows items that are not listed on the new server. You can buy on your home server and sell them for any price you want on your new server!"
          />
        </>
      </Section>
    </div>
  )
}
