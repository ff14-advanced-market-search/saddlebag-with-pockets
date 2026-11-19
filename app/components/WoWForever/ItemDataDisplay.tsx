import type { ForeverItemListing } from '../../requests/WoWForever/Listings'
import SmallTable from '../WoWResults/FullScan/SmallTable'
import CustomButton from '../utilities/CustomButton'
import Banner from '../Common/Banner'
import { Title } from '../Common'
import type { ColumnList } from '../types'
import { foreverAuctionHouseLabel } from '../../utils/WoWForever'

type Metric = { label: string; value: string }

type TableRow = {
  price: number
  quantity: number
  [key: string]: string | number | boolean | null | undefined
}

const formatMetric = (
  label: string,
  value: number | null | undefined,
  options?: { skip?: number; suffix?: string }
): Metric | null => {
  if (value == null || Number.isNaN(value)) return null
  if (options?.skip != null && value === options.skip) return null
  const formatted = value.toLocaleString()
  return {
    label,
    value: options?.suffix ? `${formatted}${options.suffix}` : formatted
  }
}

const MetricGrid = ({
  heading,
  metrics
}: Readonly<{
  heading?: string
  metrics: (Metric | null)[]
}>) => {
  const rows = metrics.filter((row): row is Metric => row != null)
  if (!rows.length) return null
  return (
    <section className="mx-3 my-5">
      {heading ? (
        <h2 className="mb-3 text-center text-base font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {heading}
        </h2>
      ) : null}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
            <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {row.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

const liveMetrics = (listing: ForeverItemListing): (Metric | null)[] => [
  formatMetric('Minimum Price', listing.minPrice, { skip: -1 }),
  formatMetric('Current Market Value', listing.currentMarketValue, {
    skip: -1
  }),
  formatMetric('Historic Market Value', listing.historicMarketValue, {
    skip: -1
  }),
  formatMetric('Percent Change', listing.percentChange, {
    skip: -1,
    suffix: '%'
  }),
  formatMetric('Current Quantity', listing.currentQuantity, { skip: -1 })
]

const tsmMetrics = (listing: ForeverItemListing): (Metric | null)[] => [
  formatMetric('tsmQuantity', listing.tsmQuantity),
  formatMetric('tsmMarketValue', listing.tsmMarketValue),
  formatMetric('tsmAvgSalePrice', listing.tsmAvgSalePrice),
  formatMetric('tsmSaleRate', listing.tsmSaleRate),
  formatMetric('tsmSoldPerDay', listing.tsmSoldPerDay),
  formatMetric('tsmHistorical', listing.tsmHistorical)
]

const columnList: ColumnList<TableRow>[] = [
  { columnId: 'price', header: 'Price' },
  { columnId: 'quantity', header: 'Quantity' }
]

const toTableRows = (listing: ForeverItemListing): TableRow[] =>
  listing.listingData.map((row) => ({
    price: row.price,
    quantity: row.quantity
  }))

/**
 * Forever item-data body: AH label, live metrics, optional tsm* raw, listings.
 */
export default function ForeverItemDataDisplay({
  listing
}: Readonly<{
  listing: ForeverItemListing
}>) {
  const houseLabel =
    listing.auctionHouseName || foreverAuctionHouseLabel(listing.auctionHouseId)

  return (
    <>
      <Title title={listing.itemName} />
      <p className="mb-2 text-center text-sm text-slate-600 dark:text-slate-300">
        WoW Forever · {listing.faction} · {listing.gameType} · {houseLabel}
      </p>
      {listing.blog ? <p style={{ fontSize: '1px' }}>{listing.blog}</p> : null}
      <Banner />
      <MetricGrid metrics={liveMetrics(listing)} />
      <MetricGrid heading="TSM Raw" metrics={tsmMetrics(listing)} />
      <div className="mx-3 my-6 flex flex-wrap justify-center gap-2">
        <CustomButton
          link="https://saddlebagexchange.com/wow-forever/"
          buttonText="View all Forever tools"
        />
        <CustomButton
          link="https://saddlebagexchange.com/options"
          buttonText="Change Forever home AH"
        />
        <CustomButton
          link={`https://www.wowhead.com/item=${listing.itemID}`}
          buttonText="View on WoWHead"
        />
      </div>
      {listing.listingData.length === 0 ? (
        <div className="my-8 text-center text-xl font-bold text-red-700 dark:text-red-300">
          Out of Stock on Selected Auction House
        </div>
      ) : (
        <SmallTable
          title={`${listing.itemName} : ${houseLabel} Listings`}
          sortingOrder={[{ desc: false, id: 'price' }]}
          columnList={columnList}
          mobileColumnList={columnList}
          columnSelectOptions={['price', 'quantity']}
          data={toTableRows(listing)}
        />
      )}
    </>
  )
}
