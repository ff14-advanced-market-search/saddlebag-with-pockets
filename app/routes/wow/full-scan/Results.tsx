import type {
  WoWOutOfStock,
  WoWProfitableItems,
  WoWScanResponse
} from '~/requests/WOWScan'
import ReusableTable from './ReusableTable'
import type { ColumnList } from './ReusableTable'

export const Results = ({ data }: { data: WoWScanResponse }) => {
  const oosColumnList: Array<ColumnList<WoWOutOfStock>> = [
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'price', header: 'Price' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' }
  ]

  const profitableItemsColumnList: Array<ColumnList<WoWProfitableItems>> = [
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'home_price', header: 'Home World Price' },
    { columnId: 'new_price', header: 'New World Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' },
    {
      columnId: 'roi',
      header: 'ROI Percentage',
      newComponent: (value) => <p>{`${value}%`}</p>
    },
    { columnId: 'salesPerDay', header: 'Sales Per Day' }
  ]

  return (
    <>
      <ReusableTable<WoWOutOfStock>
        data={data.out_of_stock}
        columnList={oosColumnList}
        sortingOrder={[{ id: 'price', desc: true }]}
        title="Out of Stock Items"
        description="This shows some out of stock stuff... Sell for mega profits $$$ "
      />
      <ReusableTable<WoWProfitableItems>
        data={data.profitable_items}
        columnList={profitableItemsColumnList}
        sortingOrder={[{ id: 'new_price', desc: true }]}
        title="Profitable Items"
        description="This shows some profitable stuff... Sell for mega profits $$$"
      />
    </>
  )
}
