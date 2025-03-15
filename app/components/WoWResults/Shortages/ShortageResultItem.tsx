import type { WoWServerRegion } from '~/requests/WoW/types'
import type { WoWShortage } from '~/requests/WoW/WoWCommodities'
import { getOribosLink } from '~/components/utilities/getOribosLink'

export const numberToLocaleStringWithDecimal = (value: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * Renders a flexbox container displaying two text elements with optional bold styling.
 * @example
 * ({
 *   leftText: "Item Name",
 *   rightText: 120,
 *   bold: true
 * })
 * // Returns a JSX element displaying "Item Name" and "120" with bold styling.
 * @param {string | number} leftText - Text content to be displayed on the left side.
 * @param {string | number} rightText - Text content to be displayed on the right side.
 * @param {boolean} [bold] - Optional parameter to apply bold styling to the text.
 * @returns {JSX.Element} A component rendering the supplied `leftText` and `rightText` within a styled div.
 * @description
 *   - Utilizes Tailwind CSS classes for styling.
 *   - Conditional styling applied based on the `bold` parameter.
 *   - Designed to work within a dark theme environment with `dark:text-gray-200` classes applied.
 */
export const TextRow = ({
  leftText,
  rightText,
  bold
}: {
  leftText: string | number
  rightText: string | number
  bold?: boolean
}) => (
  <div
    className={`flex flex-1 max-w-full text-sm justify-between items-start dark:text-gray-200${
      bold ? ' font-semibold' : ''
    }`}>
    <p className="min-w-fit">{leftText}</p>
    <p>{rightText}</p>
  </div>
)

/**
 * Render a visual representation of the market shortage for a World of Warcraft item.
 * @example
 * renderShortageItem(item, homeServer, region)
 * // Returns a JSX element displaying the item shortage details.
 * @param {WoWShortage} item - The item object containing price levels and sales information.
 * @param {string} [homeServer] - Optional home server name to customize Oribos links.
 * @param {WoWServerRegion} region - Server region, defaults to 'NA'.
 * @returns {JSX.Element} A JSX element representing the market shortage overview for the item.
 * @description
 *   - The function calculates and displays shortage costs and suggested resell prices based on item data.
 *   - It includes links to the Oribos platform with item-specific information.
 *   - Visual styling is conditionally rendered based on the presence of flip and price reset data.
 */
export const WoWShortageItem = (
  item: WoWShortage,
  homeServer?: string,
  region = 'NA' as WoWServerRegion
) => {
  const OribosLink = getOribosLink(homeServer, 'Oribos', region)
  return (
    <div
      key={item.item_id + '-increase'}
      className="my-0.5 mx-1 min-w-[260px] w-4/5 max-w-xs sm:w-1/2 max-h-fit shrink-0 p-3 border rounded border-gray-300 dark:bg-slate-700 dark:border-0 shadow">
      <div className="flex flex-1 justify-between items-center">
        <p className="font-bold my-2 text-blue-900 dark:text-blue-300">
          {item.name}
        </p>
        <OribosLink row={{ itemID: item.item_id }} />
      </div>
      {item.flip_price_levels.length > 0 && (
        <>
          <p className="font-semibold">Shorting the market</p>

          <div className="my-2 px-3 border border-w-1 p-1 rounded">
            <TextRow
              leftText="Start Price:"
              rightText={
                item.flip_price_levels[0].listing_price_level.from_price_level
              }
            />
            {item.flip_price_levels.map((level, _) => (
              <div
                key={`${item.item_id}-${level.total_price}`}
                className="pb-2 border-b last:border-none">
                <TextRow
                  leftText="Stop buying at:"
                  rightText={numberToLocaleStringWithDecimal(
                    level.listing_price_level.to_price_level
                  )}
                />
                <TextRow
                  leftText="Shortage cost:"
                  rightText={numberToLocaleStringWithDecimal(level.total_price)}
                  bold
                />
              </div>
            ))}
          </div>
        </>
      )}

      {item.max_sane_flip_level?.listing_price_level && (
        <>
          <p className="font-semibold">Suggested resell price</p>
          <div className="my-2 border-2 border-blue-900 dark:border-blue-300 rounded p-2">
            {Math.floor(
              item.max_sane_flip_level.listing_price_level.from_price_level - 1
            ) ===
            Math.floor(
              item.max_sane_flip_level.listing_price_level.to_price_level - 1
            ) ? (
              <TextRow
                leftText="List for:"
                rightText={numberToLocaleStringWithDecimal(
                  item.max_sane_flip_level.listing_price_level
                    .from_price_level - 1
                )}
              />
            ) : (
              <TextRow
                leftText="Between:"
                rightText={`${numberToLocaleStringWithDecimal(
                  Math.floor(
                    item.max_sane_flip_level.listing_price_level
                      .from_price_level - 1
                  )
                )} - ${numberToLocaleStringWithDecimal(
                  Math.floor(
                    item.max_sane_flip_level.listing_price_level
                      .to_price_level - 1
                  )
                )}`}
              />
            )}

            {item.flip_price_levels.length > 0 && (
              <TextRow
                leftText={'Sales for profit:'}
                rightText={Math.ceil(
                  item.flip_price_levels[0].total_price /
                    (item.max_sane_flip_level.listing_price_level
                      .from_price_level -
                      1)
                ).toLocaleString()}
              />
            )}
          </div>
        </>
      )}

      {item.price_reset_info?.recommend_price &&
        item.price_reset_info.total_price && (
          <>
            <p className="font-semibold">Reset the market</p>
            <div className="my-2 border-2 border-blue-900 rounded p-2 dark:border-blue-200">
              <TextRow
                leftText={'Total cost:'}
                rightText={numberToLocaleStringWithDecimal(
                  item.price_reset_info.total_price
                )}
              />
              <TextRow
                leftText={'Suggested Price:'}
                rightText={numberToLocaleStringWithDecimal(
                  item.price_reset_info.recommend_price
                )}
              />
              <TextRow
                leftText={'Sales for profit:'}
                rightText={Math.ceil(
                  item.price_reset_info.total_price /
                    item.price_reset_info.recommend_price
                ).toLocaleString()}
              />
            </div>
          </>
        )}

      <p className="font-semibold mt-3">More item info</p>
      <div className="my-2 px-3 border border-w-1 p-1 rounded dark:border-gray-300">
        <div className="my-2 pb-2 border-b">
          <TextRow leftText={'Item ID:'} rightText={item.item_id} />
          <TextRow
            leftText={'Avg price:'}
            rightText={numberToLocaleStringWithDecimal(item.avg_price)}
          />
        </div>

        <p className="font-semibold text-sm">No# of Sales</p>
        <div>
          <TextRow
            leftText={'Daily:'}
            rightText={item.sales_per_day.toLocaleString()}
          />
          <TextRow
            leftText={'Hourly:'}
            rightText={numberToLocaleStringWithDecimal(item.sales_per_hour)}
          />
        </div>
      </div>
    </div>
  )
}
