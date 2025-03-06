import type { ListingResponseType } from '~/requests/FFXIV/GetListing'
import { Differences } from './Differences'
import ListingTable from './ListingTable'

const Results = ({ data }: { data: ListingResponseType }) => {
  return (
    <>
      <div className="flex flex-col justify-around mx-3 my-1 sm:flex-row">
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Avg Price Difference"
            diffAmount={`${data.listing_price_diff.avg_price_diff.toLocaleString()} gil`}
            className={
              data.listing_price_diff.avg_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {'listing_price_diff' in data && (
          <Differences
            diffTitle="Median Price Difference"
            diffAmount={`${data.listing_price_diff.median_price_diff.toLocaleString()} gil`}
            className={
              data.listing_price_diff.median_price_diff >= 10000
                ? 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
                : 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
            }
          />
        )}
        {/* doesnt work anymore but leave it here for reference */}
        {/* {'listing_time_diff' in data && (
          <Differences
            diffTitle="Avg Time Difference"
            diffAmount={`${data.listing_time_diff.avg_time_diff.toLocaleString()} minutes`}
            className={
              data.listing_time_diff.avg_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
                : 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
            }
          />
        )}
        {'listing_time_diff' in data && (
          <Differences
            diffTitle="Median Time Difference"
            diffAmount={`${data.listing_time_diff.median_time_diff.toLocaleString()} minutes`}
            className={
              data.listing_time_diff.median_time_diff >= 30
                ? 'bg-green-100 font-semibold text-green-600 dark:bg-green-600 dark:text-gray-100'
                : 'bg-red-100 font-semibold text-red-600 dark:bg-red-600 dark:text-gray-100'
            }
          />
        )} */}
        {'min_price' in data && (
          <Differences
            diffTitle="Minimum Price"
            diffAmount={`${data.min_price.toLocaleString()} gil`}
            className={
              'bg-blue-100 font-semibold text-blue-600  dark:bg-blue-600 dark:text-gray-100'
            }
          />
        )}
      </div>
      <ListingTable data={data} />
    </>
  )
}

export default Results
