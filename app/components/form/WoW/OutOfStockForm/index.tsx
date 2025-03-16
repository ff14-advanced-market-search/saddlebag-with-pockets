import { InputWithLabel } from '../../InputWithLabel'
import { ExpansionSelect } from '../WoWScanForm'
import Filter from '../../Filter'
import { wowCategories } from '~/consts'

/**
 * Component that manages various input fields and filters for a form.
 * @example
 * renderFormComponent({ defaultValues: { expansionNumber: '1', includeCategories: '2,3', salesPerDay: '10' }, onFormChange: (name, value) => console.log(name, value) })
 * @param {Object} defaultValues - Record containing default values keyed by input field names.
 * @param {Function} onFormChange - Callback function invoked when the value in a form field is changed; takes the name of the field and the new value as its arguments.
 * @returns {JSX.Element} A div containing a series of input components such as ExpansionSelect, Filter, and InputWithLabel.
 * @description
 *   - Utilizes helper functions to parse and convert category values to and from strings and arrays.
 *   - Includes both minimum and maximum range validation for numeric input fields.
 *   - Allows configuring multiple input components dynamically based on provided defaultValues.
 */
const OutOfStockForm = ({
  defaultValues,
  onFormChange
}: {
  defaultValues: Record<string, string>
  onFormChange: (name: string, value: string) => void
}) => {
  // Helper function to safely convert string to array of numbers
  const parseCategories = (value: string): number[] => {
    if (!value || value.trim() === '') return []
    return value
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n))
  }

  // Helper function to convert array back to string
  const categoriesToString = (categories: number[]): string => {
    return categories.join(',')
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
        onChange={(categories) =>
          onFormChange('includeCategories', categoriesToString(categories))
        }
      />
      <Filter
        formName="excludeCategories"
        defaultValue={parseCategories(defaultValues.excludeCategories)}
        options={wowCategories}
        title={'Item Categories (Exclude)'}
        onChange={(categories) =>
          onFormChange('excludeCategories', categoriesToString(categories))
        }
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
