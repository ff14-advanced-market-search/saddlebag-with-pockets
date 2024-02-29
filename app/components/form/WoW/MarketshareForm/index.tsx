import { ToolTip } from '~/components/Common/InfoToolTip'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import CheckBox from '../../CheckBox'
import { InputWithLabel } from '../../InputWithLabel'
import RegionAndServerSelect from '../RegionAndServerSelect'
import { ItemClassSelect, ItemQualitySelect } from '../WoWScanForm'

const MarketShareForm = ({
  desiredPriceDefault = 10000,
  desiredSalesDefault = 0,
  regionDefault = 'NA',
  iLvlDefault = -1,
  requiredLevelDefault = -1,
  commodityDefault = false,
  homeRealm
}: {
  desiredPriceDefault?: number
  desiredSalesDefault?: number
  regionDefault?: WoWServerRegion
  iLvlDefault?: number
  requiredLevelDefault?: number
  commodityDefault?: boolean
  homeRealm: WoWServerData
}) => {
  return (
    <div className="pt-2 md:pt-4">
      <InputWithLabel
        defaultValue={desiredPriceDefault}
        type="number"
        labelTitle="Minimum Desired average price"
        inputTag="Gold"
        name="desiredAvgPrice"
        min={0.0}
        step={0.01}
      />
      <InputWithLabel
        defaultValue={desiredSalesDefault}
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
        serverSelectFormName="homeRealmId"
      />
      <ItemClassSelect />
      <ItemQualitySelect />
      <InputWithLabel
        defaultValue={iLvlDefault}
        type="number"
        labelTitle="Minimum Item Level (ilvl)"
        inputTag="Level"
        name="iLvl"
        min={-1}
      />
      <InputWithLabel
        defaultValue={requiredLevelDefault}
        type="number"
        labelTitle="Minimum Required Level"
        inputTag="Level"
        name="requiredLevel"
        min={-1}
        max={70}
      />
      <div className="my-2 relative flex">
        <CheckBox
          id="commodity"
          labelTitle="Commodity items"
          name="commodity"
          defaultChecked={commodityDefault}
          labelClassName="block text-sm font-medium text-gray-700 dark:text-grey-100"
        />
        <div className="ml-2">
          <ToolTip data="If checked the results will contain commodity items" />
        </div>
      </div>
    </div>
  )
}

export default MarketShareForm
