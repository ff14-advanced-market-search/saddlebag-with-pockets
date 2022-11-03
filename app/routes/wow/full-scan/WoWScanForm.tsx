import { InputWithLabel } from '~/components/form/InputWithLabel'
import SmallFormContainer from '~/components/form/SmallFormContainer'
import WoWServerSelect from './WoWServerSelect'

interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  loading: boolean
  error?: string
  clearErrors: () => void
}

const itemQuality = [
  {
    name: 'Poor',
    value: 0
  },
  {
    name: 'Common',
    value: 1
  },
  {
    name: 'Uncommon',
    value: 2
  },
  {
    name: 'Rare',
    value: 3
  },
  {
    name: 'Epic',
    value: 4
  },
  {
    name: 'Legendary',
    value: 5
  },
  {
    name: 'Artifact',
    value: 6
  },
  {
    name: 'Heirloom',
    value: 7
  }
]

const WoWScanForm = ({
  onClick,
  loading,
  error,
  onChange,
  clearErrors
}: Props) => (
  <SmallFormContainer
    title="WoW Sale Search"
    onClick={onClick}
    loading={loading}
    disabled={loading}
    error={error}>
    <div className="flex flex-col lg:flex-row lg:gap-7">
      <div className="w-full">
        <InputWithLabel
          defaultValue={10000}
          type="number"
          labelTitle="Minimum Historic Price"
          inputTag="Amount"
          name="minHistoricPrice"
          onChange={(e) => {
            onChange(e)
            clearErrors()
          }}
        />
        <InputWithLabel
          defaultValue={50}
          type="number"
          labelTitle="Return On Investment (%)"
          inputTag="%"
          name="roi"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={0}
          type="number"
          labelTitle="Minimum Sales Per Day"
          inputTag="Min Sales"
          name="salePerDay"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={-1}
          type="number"
          labelTitle="Minimum Required Level"
          inputTag="Level"
          name="requiredLevel"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={-1}
          type="number"
          labelTitle="Minimum Item Level (ilvl)"
          inputTag="Level"
          name="iLvl"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={-1}
          type="number"
          labelTitle="Item Category"
          inputTag="Class"
          name="itemClass"
          onChange={onChange}
        />
        <InputWithLabel
          defaultValue={-1}
          type="number"
          labelTitle="Item Sub Category"
          inputTag="Class"
          name="itemSubClass"
          onChange={onChange}
        />
      </div>
      <div className="w-full">
        <WoWServerSelect
          formName="homeRealmId"
          title="Home World"
          onSelectChange={clearErrors}
          onTextChange={clearErrors}
        />
        <WoWServerSelect
          formName="newRealmId"
          title="New World"
          onSelectChange={clearErrors}
          onTextChange={clearErrors}
        />
        <div className="w-full">
          <label
            htmlFor="item-quality"
            className="block text-sm font-medium text-gray-700 dark:text-grey-100">
            Item Quality
          </label>
          <select
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            id="item-quality"
            name="itemQuality"
            defaultValue={'Poor'}>
            {itemQuality.map(({ name, value }) => {
              return (
                <option key={name + value} value={value}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
    </div>
  </SmallFormContainer>
)

export default WoWScanForm
