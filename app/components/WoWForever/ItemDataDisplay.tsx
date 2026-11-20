import type { ReactNode } from 'react'
import type { ForeverItemListing } from '../../requests/WoWForever/Listings'
import SmallTable from '../WoWResults/FullScan/SmallTable'
import CustomButton from '../utilities/CustomButton'
import Banner from '../Common/Banner'
import { Title } from '../Common'
import type { ColumnList } from '../types'
import {
  foreverAuctionHouseLabel,
  foreverUndermineItemUrl,
  foreverWowheadItemUrl,
  WOW_FOREVER_FACTIONS,
  WOW_FOREVER_RULESETS,
  type WoWForeverFaction,
  type WoWForeverRegion,
  type WoWForeverRuleset
} from '../../utils/WoWForever'
import GoldPrice from '../WoW/GoldPrice'

interface Metric {
  label: string
  value: ReactNode
}

interface TableRow {
  price: number
  quantity: number
  [key: string]: string | number | boolean | null | undefined
}

const formatMetric = (
  label: string,
  value: number | null | undefined,
  options?: { skip?: number; suffix?: string; gold?: boolean }
): Metric | null => {
  if (value == null || Number.isNaN(value)) return null
  if (options?.skip != null && value === options.skip) return null
  if (options?.gold) {
    return { label, value: <GoldPrice amount={value} /> }
  }
  const formatted = value.toLocaleString()
  return {
    label,
    value: options?.suffix ? `${formatted}${options.suffix}` : formatted
  }
}

const titleCaseWords = (value: string): string =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

const factionHeadingLabel = (faction: string): string => {
  const known = WOW_FOREVER_FACTIONS.find(
    (entry) => entry.value === (faction.toLowerCase() as WoWForeverFaction)
  )
  return known?.label ?? titleCaseWords(faction)
}

/** API gameType uses spaces (e.g. `rp pvp`); options use underscores. */
const gameTypeHeadingLabel = (gameType: string): string => {
  const normalized = gameType.trim().toLowerCase().replaceAll(/\s+/g, '_')
  const known = WOW_FOREVER_RULESETS.find(
    (entry) => entry.value === (normalized as WoWForeverRuleset)
  )
  return known?.label ?? titleCaseWords(gameType)
}

/** e.g. Alliance Normal Statistics from listing.faction + listing.gameType */
const liveStatisticsHeading = (listing: ForeverItemListing): string => {
  const faction = factionHeadingLabel(listing.faction)
  const gameMode = gameTypeHeadingLabel(listing.gameType)
  const label = [faction, gameMode].filter(Boolean).join(' ')
  return label ? `${label} Statistics` : 'Statistics'
}

const MetricGrid = ({
  heading,
  description,
  metrics
}: Readonly<{
  heading?: string
  description?: string
  metrics: (Metric | null)[]
}>) => {
  const rows = metrics.filter((row): row is Metric => row != null)
  if (!rows.length) return null
  return (
    <section className="mx-3 my-5">
      {heading ? (
        <h2 className="mb-2 text-center text-base font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {heading}
        </h2>
      ) : null}
      {description ? (
        <p className="mx-auto mb-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>
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
  formatMetric('Minimum Price', listing.minPrice, { skip: -1, gold: true }),
  formatMetric('Current Quantity', listing.currentQuantity, { skip: -1 }),
  formatMetric('Current Sold Per Day', listing.currentSoldPerDay, {
    skip: -1
  }),
  formatMetric('Current Market Value', listing.currentMarketValue, {
    skip: -1,
    gold: true
  }),
  formatMetric('Historic Market Value', listing.historicMarketValue, {
    skip: -1,
    gold: true
  }),
  formatMetric('Price Percent Change', listing.percentChange, {
    suffix: '%'
  })
]

const tsmMetrics = (listing: ForeverItemListing): (Metric | null)[] => [
  formatMetric('Quantity', listing.tsmQuantity),
  formatMetric('Average Sale Price', listing.tsmAvgSalePrice, { gold: true }),
  formatMetric('Sale Rate', listing.tsmSaleRate),
  formatMetric('Sold Per Day', listing.tsmSoldPerDay),
  formatMetric('Historical', listing.tsmHistorical, { gold: true })
]

const TSM_STATISTICS_DESCRIPTION =
  'TSM values are averages across all Forever factions, auction houses, and game modes. They can run lower than Normal markets and higher than Role Play markets.'

const columnList: ColumnList<TableRow>[] = [
  {
    columnId: 'price',
    header: 'Price',
    accessor: ({ row }) =>
      typeof row.price === 'number' ? <GoldPrice amount={row.price} /> : null
  },
  { columnId: 'quantity', header: 'Quantity' }
]

const toTableRows = (listing: ForeverItemListing): TableRow[] =>
  listing.listingData.map((row) => ({
    price: row.price,
    quantity: row.quantity
  }))

/**
 * Forever item-data body: live metrics, optional TSM statistics, listings.
 */
export default function ForeverItemDataDisplay({
  listing,
  region
}: Readonly<{
  listing: ForeverItemListing
  region: WoWForeverRegion
}>) {
  const houseLabel =
    listing.auctionHouseName || foreverAuctionHouseLabel(listing.auctionHouseId)
  const undermineLink = foreverUndermineItemUrl(
    region,
    listing.auctionHouseId,
    listing.itemID
  )
  const wowheadLink = foreverWowheadItemUrl(listing.itemID)

  return (
    <>
      <Title title={listing.itemName} />
      {listing.blog ? <p style={{ fontSize: '1px' }}>{listing.blog}</p> : null}
      <Banner />
      <MetricGrid
        heading={liveStatisticsHeading(listing)}
        metrics={liveMetrics(listing)}
      />
      <MetricGrid
        heading="TSM Statistics"
        description={TSM_STATISTICS_DESCRIPTION}
        metrics={tsmMetrics(listing)}
      />
      <div className="mx-3 my-6 flex flex-wrap justify-center gap-2">
        <CustomButton
          link="https://saddlebagexchange.com/wow-forever/"
          buttonText="View all Forever tools"
        />
        {undermineLink ? (
          <CustomButton link={undermineLink} buttonText="View on Undermine" />
        ) : null}
        <CustomButton link={wowheadLink} buttonText="View on Wowhead" />
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
