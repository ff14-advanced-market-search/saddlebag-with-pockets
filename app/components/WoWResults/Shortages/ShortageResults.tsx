import { ContentContainer, PageWrapper, Title } from '~/components/Common'
import type { WoWServerRegion } from '~/requests/WoW/types'
import type { WoWShortage } from '~/requests/WoW/WoWCommodities'
import { WoWShortageItem } from './ShortageResultItem'

/**
 * Renders a page with actionable item lists based on shortage results in a game.
 * @example
 * renderShortageResults({
 *   results: {
 *     increase: [{ item: 'item1' }, { item: 'item2' }],
 *     reset: [{ item: 'item3' }, { item: 'item4' }]
 *   },
 *   serverName: 'myServer',
 *   region: 'EU'
 * })
 * React element
 * @param {Object} {results, serverName, region} - Configuration and data for rendering the page.
 * @param {Object} {results} - Contains the arrays of items to increase or reset.
 * @param {Array<WoWShortage>} {results.increase} - Items to buy the cheapest listings from the market.
 * @param {Array<WoWShortage>} {results.reset} - Items to buy all stock from the market.
 * @param {string} [serverName] - Optional server name to associate with item listings.
 * @param {WoWServerRegion} [region='NA'] - Optional server region, default is 'NA'.
 * @returns {ReactElement} React component page wrapping the item lists for buying strategies.
 * @description
 *   - The page includes two strategies: buying the cheapest or buying all stock.
 *   - Utilizes `WoWShortageItem` to render individual item components.
 *   - Applies styling based on dark mode preference.
 *   - Displays informative and actionable titles and descriptions for each section.
 */
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
