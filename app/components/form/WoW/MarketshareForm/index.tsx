import { ToolTip } from '~/components/Common/InfoToolTip'
import type { WoWServerData, WoWServerRegion } from '~/requests/WoW/types'
import CheckBox from '../../CheckBox'
import { InputWithLabel } from '../../InputWithLabel'
import RegionAndServerSelect from '../RegionAndServerSelect'
import { ItemClassSelect, ItemQualitySelect } from '../WoWScanForm'
import type { defaultFormValuesMarketShare } from '~/routes/wow.marketshare'

const MarketShareForm = ({
  loaderData,
  handleFormChange,
  inputMap
}: {
  handleFormChange: (
    name: keyof typeof defaultFormValuesMarketShare,
    value: string
  ) => void
  loaderData: typeof defaultFormValuesMarketShare
  inputMap: Record<keyof typeof defaultFormValuesMarketShare, string>
  commodityDefault?: boolean
}) => {
  // // debug the issue is this is being passed as a bool not a string
  // console.log('loaderdata', loaderData.commodity)
  return (
    <div className="pt-2 md:pt-4">
      <InputWithLabel
        defaultValue={loaderData.desiredAvgPrice}
        labelTitle={inputMap.desiredAvgPrice}
        type="number"
        inputTag="Gold"
        name="desiredAvgPrice"
        min={0.0}
        step={0.01}
        onChange={(e) => handleFormChange('desiredAvgPrice', e.target.value)}
      />
      <InputWithLabel
        defaultValue={loaderData.desiredSalesPerDay}
        labelTitle={inputMap.desiredSalesPerDay}
        type="number"
        inputTag="Sales"
        name="desiredSalesPerDay"
        min={0}
        step={0.01}
        onChange={(e) => handleFormChange('desiredSalesPerDay', e.target.value)}
      />
      <RegionAndServerSelect
        region={loaderData.region as WoWServerRegion}
        defaultRealm={
          {
            id: parseInt(loaderData.homeRealmId.split('---')[0], 10),
            name: loaderData.homeRealmId.split('---')[1]
          } as WoWServerData
        }
        serverSelectFormName="homeRealmId"
        regionOnChange={(region) => handleFormChange('region', region)}
        onServerSelectChange={(realm) =>
          handleFormChange(
            'homeRealmId',
            realm ? `${realm.id}---${realm.name}` : ''
          )
        }
      />
      <ItemClassSelect
        itemClass={parseInt(loaderData.itemClass)}
        itemSubClass={parseInt(loaderData.itemSubClass)}
        onChange={(itemClassValue, itemSubClassValue) => {
          handleFormChange('itemClass', itemClassValue.toString())
          handleFormChange('itemSubClass', itemSubClassValue.toString())
        }}
      />
      <ItemQualitySelect
        defaultValue={loaderData.itemQuality}
        onChange={(value) => handleFormChange('itemQuality', value)}
      />
      <InputWithLabel
        defaultValue={loaderData.iLvl}
        labelTitle={inputMap.iLvl}
        type="number"
        inputTag="Level"
        name="iLvl"
        min={-1}
        onChange={(e) => handleFormChange('iLvl', e.target.value)}
      />
      <InputWithLabel
        defaultValue={loaderData.requiredLevel}
        labelTitle={inputMap.requiredLevel}
        type="number"
        inputTag="Level"
        name="requiredLevel"
        min={-1}
        max={70}
        onChange={(e) => handleFormChange('requiredLevel', e.target.value)}
      />
      <div className="my-2 relative flex">
        <CheckBox
          defaultChecked={loaderData.commodity}
          labelTitle={inputMap.commodity}
          id="commodity"
          name="commodity"
          labelClassName="block text-sm font-medium text-gray-700 dark:text-grey-100"
          onChange={(e) =>
            handleFormChange('commodity', e.target.checked ? 'on' : 'off')
          }
        />
        <div className="ml-2">
          <ToolTip data="If checked the results will contain commodity items" />
        </div>
      </div>
    </div>
  )
}

export default MarketShareForm
