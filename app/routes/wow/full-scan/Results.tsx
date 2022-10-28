import type {
  WoWOutOfStock,
  WoWProfitableItems,
  WoWScanResponse
} from '~/requests/WOWScan'
import ReusableTable from './ReusableTable'
import type { ColumnList } from './ReusableTable'

export const Results = ({ data }: { data: WoWScanResponse }) => {
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
      newComponent: (value) => <p>{`${value}%`}</p>
    },
    { columnId: 'home_price', header: 'Home World Price' },
    { columnId: 'new_price', header: 'New World Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' }
  ]

  return (
    <>
      <ReusableTable<WoWProfitableItems>
        data={data.profitable_items}
        columnList={profitableItemsColumnList}
        sortingOrder={[{ id: 'profit', desc: true }]}
        title="Profitable Items"
        description="This shows items you can buy on your home server and sell on your new server for a profit!"
      />
      <ReusableTable<WoWOutOfStock>
        data={data.out_of_stock}
        columnList={oosColumnList}
        sortingOrder={[{ id: 'historicPrice', desc: true }]}
        title="Out of Stock Items"
        description="This shows items that are not listed on the new server.  You can buy on your home server and sell them for any price you want on your new server!"
      />
    </>
  )
}
