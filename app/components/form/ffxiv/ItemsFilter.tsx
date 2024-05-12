import Filter from '../Filter'

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
