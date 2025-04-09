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

const columnList: Array<ColumnList<Record<string, any>>> = [
  { columnId: 'itemName', header: 'Item Name' },
  {
    columnId: 'universalisLink',
    header: 'Universalis Link',
    accessor: ({ row }) => (
      <UniversalisBadgedLink
        link={`https://universalis.app/market/${row.itemID}`}
      />
    )
  },
  {
    columnId: 'itemData',
    header: 'Item Data',
    accessor: ({ row }) => (
      <ItemDataLink link={`/queries/item-data/${row.itemID}`} />
    )
  },
  { columnId: 'discount', header: 'Discount' },
  { columnId: 'minPrice', header: 'Minimum Price' },
  { columnId: 'medianNQ', header: 'NQ Median Price' },
  { columnId: 'medianHQ', header: 'HQ Median Price' },
  { columnId: 'salesAmountNQ', header: 'NQ Sales' },
  { columnId: 'salesAmountHQ', header: 'HQ Sales' },
  { columnId: 'worldName', header: 'World' }
]

export const Results = ({
  results,
  pageTitle
}: {
  results: BestDealsResponse
  pageTitle: string
}) => {
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
          columnSelectOptions={[
            'discount',
            'minPrice',
            'medianNQ',
            'medianHQ',
            'salesAmountNQ',
            'salesAmountHQ'
          ]}
          data={results.data as Record<string, any>[]}
          csvOptions={{
            filename: 'saddlebag-best-deals.csv',
            columns: [
              { title: 'Item ID', value: 'itemID' },
              { title: 'Item Name', value: 'itemName' },
              { title: 'Min Price', value: 'minPrice' },
              { title: 'NQ Median', value: 'medianNQ' },
              { title: 'HQ Median', value: 'medianHQ' },
              { title: 'NQ Sales', value: 'salesAmountNQ' },
              { title: 'HQ Sales', value: 'salesAmountHQ' },
              { title: 'Discount', value: 'discount' },
              { title: 'World', value: 'worldName' }
            ]
          }}
        />
      </div>
    </PageWrapper>
  )
}
