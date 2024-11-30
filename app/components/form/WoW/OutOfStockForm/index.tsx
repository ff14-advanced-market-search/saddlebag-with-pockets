import { InputWithLabel } from '../../InputWithLabel'
import { ExpansionSelect } from '../WoWScanForm'
import Filter from '../../Filter'
import { wowCategories } from '~/consts'

const OutOfStockForm = ({
  defaultValues,
  onFormChange
}: {
  defaultValues: Record<string, string | number | number[]>
  onFormChange: (name: string, value: string) => void
}) => {
  // Helper function to safely convert value to array of numbers
  const parseCategories = (value: string | number | number[]): number[] => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string' && value.trim() !== '') {
      return value
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n))
    }
    return []
  }

  return (
    <div className="pt-3 flex flex-col">
      <ExpansionSelect
        defaultValue={defaultValues.expansionNumber}
        onChange={(value) => onFormChange('expansionNumber', value)}
      />
      <Filter
        formName="includeCategories"
        defaultValue={parseCategories(defaultValues.includeCategories)}
        options={wowCategories}
        title={'Item Categories (Include)'}
      />
      <Filter
        formName="excludeCategories"
        defaultValue={parseCategories(defaultValues.excludeCategories)}
        options={wowCategories}
        title={'Item Categories (Exclude)'}
      />
      <InputWithLabel
        defaultValue={defaultValues.salesPerDay}
        type="number"
        labelTitle="Minimum Sales Per Day"
        inputTag="Sales"
        name="salesPerDay"
        min={0}
        step={0.01}
        onChange={(e) => onFormChange('salesPerDay', e.target.value)}
      />
      <InputWithLabel
        defaultValue={defaultValues.avgPrice}
        type="number"
        labelTitle="Minimum Average Price"
        inputTag="Gold"
        name="avgPrice"
        min={0}
        step={1}
        onChange={(e) => onFormChange('avgPrice', e.target.value)}
      />
      <InputWithLabel
        defaultValue={defaultValues.minMarketValue}
        type="number"
        labelTitle="Minimum Market Value"
        inputTag="Gold"
        name="minMarketValue"
        min={0}
        step={1}
        onChange={(e) => onFormChange('minMarketValue', e.target.value)}
      />
      <InputWithLabel
        defaultValue={defaultValues.populationWP}
        type="number"
        labelTitle="Minimum WoWProgress Population"
        inputTag="Players"
        name="populationWP"
        min={0}
        step={1}
        onChange={(e) => onFormChange('populationWP', e.target.value)}
      />
      <InputWithLabel
        defaultValue={defaultValues.populationBlizz}
        type="number"
        labelTitle="Minimum Blizzard Population"
        inputTag="Players"
        name="populationBlizz"
        min={0}
        step={1}
        onChange={(e) => onFormChange('populationBlizz', e.target.value)}
      />
      <InputWithLabel
        defaultValue={defaultValues.rankingWP}
        type="number"
        labelTitle="Maximum WoWProgress Ranking"
        inputTag="Rank"
        name="rankingWP"
        min={0}
        max={100}
        step={1}
        onChange={(e) => onFormChange('rankingWP', e.target.value)}
      />
    </div>
  )
}

export default OutOfStockForm
