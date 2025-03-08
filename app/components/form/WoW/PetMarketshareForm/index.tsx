import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import { InputWithLabel } from '../../InputWithLabel'
import RegionAndServerSelect from '../RegionAndServerSelect'
import Select from '../../select'
import Filter from '../../Filter'
import { petMarketshareOptions } from '~/consts'
import { sortByOptions } from '~/routes/wow.pet-marketshare'

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
    <div className='pt-2 md:pt-4'>
      <InputWithLabel
        defaultValue={minPriceDefault}
        type='number'
        labelTitle='Minimum Desired price'
        inputTag='Gold'
        name='desiredPrice'
        min={0}
        step={0.01}
      />
      <InputWithLabel
        defaultValue={salesPerDayDefault}
        type='number'
        labelTitle='Minimum Desired sales per day'
        inputTag='Sales'
        name='desiredSalesPerDay'
        min={0}
        step={0.01}
      />
      <RegionAndServerSelect
        region={regionDefault}
        defaultRealm={homeRealm}
        serverSelectFormName='homeRealmName'
      />
      <Filter
        formName='includeCategories'
        defaultValue={includeCategoriesDefault}
        options={petMarketshareOptions}
        title={'Pet Filter (Include)'}
      />
      <Filter
        formName='excludeCategories'
        defaultValue={excludeCategoriesDefault}
        options={petMarketshareOptions}
        title={'Pet Filter (Exclude)'}
      />
      <Select
        title='Sort Results By'
        options={sortByOptions}
        name='sortBy'
        id='sortBy'
      />
    </div>
  )
}

export default PetMarketShareForm
