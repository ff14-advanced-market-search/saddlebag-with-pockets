import type { ListingResponseType } from '~/requests/GetListing'
import { Differences } from './Differences'
import ListingTable from './ListingTable'

const Results = ({ data }: { data: ListingResponseType }) => {
  return (
    <>
      <div className="flex flex-col justify-around mx-3 my-1 sm:flex-row">
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Avg Price Difference"
            diffAmount={`${data.listing_price_diff.avg_price_diff} gil`}
            className={
              data.listing_price_diff.avg_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-800'
                : 'bg-green-100 font-semibold text-green-800'
            }
          />
        )}
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Median Price Difference"
            diffAmount={`${data.listing_price_diff.median_price_diff} gil`}
            className={
              data.listing_price_diff.median_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-800'
                : 'bg-green-100 font-semibold text-green-800'
            }
          />
        )}
        {'listing_time_diff' in data && (
          <Differences
            diffTitle="Avg Time Difference"
            diffAmount={`${data.listing_time_diff.avg_time_diff} minutes`}
            className={
              data.listing_time_diff.avg_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-800'
                : 'bg-red-100 font-semibold text-red-800'
            }
          />
        )}
        {'listing_time_diff' in data && (
          <Differences
            diffTitle="Median Time Difference"
            diffAmount={`${data.listing_time_diff.median_time_diff} minutes`}
            className={
              data.listing_time_diff.median_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-800'
                : 'bg-red-100 font-semibold text-red-800'
            }
          />
        )}
        {'min_price' in data && (
          <Differences
            diffTitle="Minimum Price"
            diffAmount={`${data.min_price} gil`}
            className={'bg-blue-100 font-semibold text-blue-800'}
          />
        )}
      </div>
      <ListingTable data={data} />
    </>
  )
}

export default Results
