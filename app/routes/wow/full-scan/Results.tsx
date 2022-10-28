import type { WoWOutOfStock } from '~/requests/WOWScan'
import ReusableTable from './ReusableTable'

export const Results = ({ data }: { data: Array<WoWOutOfStock> }) => {
  const columnList: Array<{
    columnId: keyof WoWOutOfStock
    header: string
  }> = [
    { columnId: 'itemID', header: 'Item ID' },
    { columnId: 'name', header: 'Item Name' },
    { columnId: 'price', header: 'Price' },
    { columnId: 'historicPrice', header: 'Historic Price' },
    { columnId: 'salesPerDay', header: 'Sales Per Day' }
  ]

  return ReusableTable<WoWOutOfStock>({
    data,
    columnList,
    sortingOrder: [{ id: 'price', desc: true }],
    title: 'Out of Stock Items',
    description:
      'This shows some out of stock stuff... Sell for mega profits $$$'
  })
}
