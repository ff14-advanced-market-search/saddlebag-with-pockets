import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type { WoWServerRegion } from '~/requests/WoW/types'
import type { WoWShortage } from '~/requests/WoWCommodities'
import { WoWShortageItem } from './ShortageResultItem'

const ShortageResults = ({
  results,
  serverName,
  region = 'NA'
}: {
  results: {
    increase: Array<WoWShortage>
    reset: Array<WoWShortage>
  }
  serverName?: string
  region?: WoWServerRegion
}) => (
  <PageWrapper>
    <>
      <ContentContainer className="dark:bg-transparent">
        <div className="sm:m-3 text-slate-900 dark:text-gray-100">
          <Title title="Buy the cheapest of these items" />
          <p className="italic my-2 text-sm text-slate-700 dark:text-gray-300">
            The idea with these items is to take the cheapest listings off the
            market and then sell a small amount for profit.
          </p>
          <div className="flex w-full overflow-x-scroll gap-3">
            {results.increase.map((item) =>
              WoWShortageItem(item, serverName, region)
            )}
          </div>
        </div>
      </ContentContainer>
      <ContentContainer className="dark:bg-transparent">
        <div className="sm:m-3 dark:text-gray-100">
          <Title title="Buy all stock from the market with these items" />
          <p className="italic my-2 text-sm text-slate-700 dark:text-gray-300">
            The idea with these items is to buy up all the stock and list a
            small amount of items for profit.
          </p>
          <div className="flex w-full overflow-x-scroll gap-3">
            {results.reset.map((item) =>
              WoWShortageItem(item, serverName, region)
            )}
          </div>
        </div>
      </ContentContainer>
    </>
  </PageWrapper>
)

export default ShortageResults
