import Filter from '../Filter'

/**
 * Renders a Filter component with specified properties.
 * @example
 * ItemsFilter({
 *   defaultFilters: [1, 2], 
 *   formName: 'myFilter',
 *   onChange: (ids) => console.log(ids)
 * })
 * @param {Array<number>} {defaultFilters} - An optional array of default filter IDs.
 * @param {string} {formName} - An optional form name for the Filter component.
 * @param {function} {onChange} - An optional callback function triggered when filters change.
 * @returns {JSX.Element} Filter component with configured properties.
 * @description
 *   - `defaultFilters`: Determines the default selection state of the filter component.
 *   - `formName`: Specifies the name of the form, aiding in identifying filter context.
 *   - `onChange`: This function should handle changes to the filter's values according to application logic.
 */
const ItemsFilter = ({
  defaultFilters = [0],
  formName = 'filters',
  onChange
}: {
  defaultFilters?: Array<number>
  onChange?: (newIds: Array<number>) => void
  formName?: string
}) => {
  return (
    <Filter
      formName={formName}
      defaultValue={defaultFilters}
      title="Item Filter"
      onChange={onChange}
    />
  )
}

export default ItemsFilter
