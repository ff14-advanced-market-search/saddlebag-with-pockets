import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import { InputWithLabel } from '../../InputWithLabel'
import RegionAndServerSelect from '../RegionAndServerSelect'
import Select from '../../select'
import Filter from '../../Filter'
import { petMarketshareOptions } from '~/consts'
import { sortByOptions } from '~/routes/wow.pet-marketshare'

/**
 * Creates a form component for configuring pet market share in World of Warcraft.
 * @example
 * WoWPetMarketshareForm({
 *   regionDefault: 'EU',
 *   homeRealm: { id: 123, name: 'Stormrage' },
 *   minPriceDefault: 1500,
 *   salesPerDayDefault: 0.05,
 *   includeCategoriesDefault: [1, 2],
 *   excludeCategoriesDefault: [3]
 * })
 * <div>...</div>
 * @param {WoWServerRegion} regionDefault - The default server region, e.g., 'NA' or 'EU'.
 * @param {WoWServerData} homeRealm - Details of the user's default server realm, including its id and name.
 * @param {number} minPriceDefault - Minimum desired price for the pets, default is 1000.
 * @param {number} salesPerDayDefault - Minimum desired sales per day, default is 0.01.
 * @param {Array<number>} includeCategoriesDefault - List of category IDs to include in filtering.
 * @param {Array<number>} excludeCategoriesDefault - List of category IDs to exclude from filtering.
 * @returns {JSX.Element} The form component for configuring pet market share, with various inputs.
 * @description
 *   - The form contains inputs for setting minimum desired price and sales per day.
 *   - Region and server realm selections are customizable through dropdowns.
 *   - Includes filters to specify categories for inclusion and exclusion.
 *   - Users can sort results with a dropdown selection.
 */
const PetMarketShareForm = ({
  regionDefault = 'NA',
  homeRealm,
  minPriceDefault = 1000,
  salesPerDayDefault = 0.01,
  includeCategoriesDefault = [],
  excludeCategoriesDefault = []
}: {
  regionDefault?: WoWServerRegion
  homeRealm: WoWServerData
  minPriceDefault?: number
  salesPerDayDefault?: number
  includeCategoriesDefault?: Array<number>
  excludeCategoriesDefault?: Array<number>
}) => {
  return (
    <div className="pt-2 md:pt-4">
      <InputWithLabel
        defaultValue={minPriceDefault}
        type="number"
        labelTitle="Minimum Desired price"
        inputTag="Gold"
        name="desiredPrice"
        min={0}
        step={0.01}
      />
      <InputWithLabel
        defaultValue={salesPerDayDefault}
        type="number"
        labelTitle="Minimum Desired sales per day"
        inputTag="Sales"
        name="desiredSalesPerDay"
        min={0}
        step={0.01}
      />
      <RegionAndServerSelect
        region={regionDefault}
        defaultRealm={homeRealm}
        serverSelectFormName="homeRealmName"
      />
      <Filter
        formName="includeCategories"
        defaultValue={includeCategoriesDefault}
        options={petMarketshareOptions}
        title={'Pet Filter (Include)'}
      />
      <Filter
        formName="excludeCategories"
        defaultValue={excludeCategoriesDefault}
        options={petMarketshareOptions}
        title={'Pet Filter (Exclude)'}
      />
      <Select
        title="Sort Results By"
        options={sortByOptions}
        name="sortBy"
        id="sortBy"
      />
    </div>
  )
}

export default PetMarketShareForm
