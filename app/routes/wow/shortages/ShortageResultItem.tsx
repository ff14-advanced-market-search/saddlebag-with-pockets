import type { WoWShortage } from '~/requests/WoWCommodities'
import { getOribosLink } from '../../../components/utilities/getOribosLink'

export const numberToLocaleStringWithDecimal = (value: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

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
    className={`flex flex-1 max-w-full text-sm justify-between items-start${
      bold ? ' font-semibold' : ''
    }`}>
    <p className="min-w-fit">{leftText}</p>
    <p>{rightText}</p>
  </div>
)

export const WoWShortageItem = (item: WoWShortage, homeServer?: string) => {
  const OribosLink = getOribosLink(homeServer, 'Oribos')
  return (
    <div
      key={item.item_id + '-increase'}
      className="my-0.5 mx-1 min-w-[260px] w-4/5 max-w-xs sm:w-1/2 max-h-fit shrink-0 p-3 border rounded border-gray-300 shadow">
      <div className="flex flex-1 justify-between items-center">
        <p className="font-bold my-2 text-blue-900">{item.name}</p>
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
          <div className="my-2 border-2 border-blue-900 rounded p-2">
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
            <div className="my-2 border-2 border-blue-900 rounded p-2">
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
      <div className="my-2 px-3 border border-w-1 p-1 rounded ">
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
