import { useState } from 'react'
import { PageWrapper } from '~/components/Common'
import type { ColumnList } from '~/components/types'
import SmallTable from '~/components/WoWResults/FullScan/SmallTable'
import type { DealItem, BestDealsResponse } from '~/requests/FFXIV/BestDeals'
import { ContentContainer, Title } from '~/components/Common'
import ItemDataLink from '~/components/utilities/ItemDataLink'
import UniversalisBadgedLink from '~/components/utilities/UniversalisBadgedLink'

const mobileColumnList: Array<ColumnList<Record<string, any>>> = [
  { columnId: 'itemName', header: 'Item Name' },
  { columnId: 'discount', header: 'Discount' }
]

const getColumnList = (hqOnly: boolean): Array<ColumnList<Record<string, any>>> => {
  const baseColumns = [
    { columnId: 'itemName', header: 'Item Name' },
    { columnId: 'worldName', header: 'Server' },
    { columnId: 'discount', header: 'Discount' },
    { columnId: 'minPrice', header: 'Minimum Price' },
    {
      columnId: 'universalisLink',
      header: 'Universalis Link',
      accessor: ({ row }: { row: DealItem }) => (
        <UniversalisBadgedLink
          link={`https://universalis.app/market/${row.itemID}`}
        />
      )
    },
    {
      columnId: 'itemData',
      header: 'Item Data',
      accessor: ({ row }: { row: DealItem }) => (
        <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
      )
    }
  ]

  const nqColumns = [
    { columnId: 'medianNQ', header: 'NQ Median Price' },
    { columnId: 'averageNQ', header: 'NQ Average Price' },
    { columnId: 'salesAmountNQ', header: 'NQ Sales' },
    { columnId: 'quantitySoldNQ', header: 'NQ Quantity Sold' }
  ]

  const hqColumns = [
    { columnId: 'medianHQ', header: 'HQ Median Price' },
    { columnId: 'averageHQ', header: 'HQ Average Price' },
    { columnId: 'salesAmountHQ', header: 'HQ Sales' },
    { columnId: 'quantitySoldHQ', header: 'HQ Quantity Sold' }
  ]

  return [...baseColumns, ...(hqOnly ? hqColumns : nqColumns)]
}

export const Results = ({
  results,
  pageTitle
}: {
  results: BestDealsResponse & { hq_only: boolean }
  pageTitle: string
}) => {
  const columnList = getColumnList(results.hq_only)
  const columnSelectOptions = [
    'discount',
    'minPrice',
    ...(results.hq_only 
      ? ['medianHQ', 'salesAmountHQ']
      : ['medianNQ', 'salesAmountNQ'])
  ]

  return (
    <PageWrapper>
      <div className="flex flex-col w-full">
        <ContentContainer>
          <Title title={pageTitle} />
        </ContentContainer>
        <SmallTable
          title="Best Deals"
          sortingOrder={[{ desc: true, id: 'discount' }]}
          columnList={columnList}
          mobileColumnList={mobileColumnList}
          columnSelectOptions={columnSelectOptions}
          data={results.data as Record<string, any>[]}
          csvOptions={{
            filename: 'saddlebag-best-deals.csv',
            columns: [
              { title: 'Item ID', value: 'itemID' },
              { title: 'Item Name', value: 'itemName' },
              { title: 'Min Price', value: 'minPrice' },
              ...(results.hq_only 
                ? [
                    { title: 'HQ Median', value: 'medianHQ' },
                    { title: 'HQ Sales', value: 'salesAmountHQ' }
                  ]
                : [
                    { title: 'NQ Median', value: 'medianNQ' },
                    { title: 'NQ Sales', value: 'salesAmountNQ' }
                  ]),
              { title: 'Discount', value: 'discount' },
              { title: 'World', value: 'worldName' }
            ]
          }}
        />
      </div>
    </PageWrapper>
  )
}
