import { useState } from 'react'
import { InputWithLabel } from '../../InputWithLabel'
import { ItemClassSelect } from '../WoWScanForm'

export interface PriceGroup {
  name: string
  item_ids: number[]
  categories: Array<{
    item_class: number
    item_subclass: number
    expansion_number: number
    min_quality: number
  }>
}

interface PriceGroupFormProps {
  defaultValue?: PriceGroup
  onChange: (group: PriceGroup) => void
  onRemove?: () => void
}

const PriceGroupForm = ({
  defaultValue,
  onChange,
  onRemove
}: PriceGroupFormProps) => {
  const [name, setName] = useState(defaultValue?.name || '')
  const [itemIds, setItemIds] = useState<number[]>(defaultValue?.item_ids || [])
  const [categories, setCategories] = useState(defaultValue?.categories || [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    onChange({
      name: newName,
      item_ids: itemIds,
      categories
    })
  }

  const handleItemIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIds = e.target.value
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id))

    setItemIds(newIds)
    onChange({
      name,
      item_ids: newIds,
      categories
    })
  }

  const handleCategoryChange = (itemClass: number, itemSubClass: number) => {
    const newCategories = [...categories]
    const existingIndex = categories.findIndex(
      (cat: { item_class: number; item_subclass: number }) =>
        cat.item_class === itemClass && cat.item_subclass === itemSubClass
    )

    if (existingIndex >= 0) {
      newCategories.splice(existingIndex, 1)
    } else {
      newCategories.push({
        item_class: itemClass,
        item_subclass: itemSubClass,
        expansion_number: -1, // Default to all expansions
        min_quality: -1 // Default to all qualities
      })
    }

    setCategories(newCategories)
    onChange({
      name,
      item_ids: itemIds,
      categories: newCategories
    })
  }

  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Price Group</h3>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
            type="button">
            Remove
          </button>
        )}
      </div>

      <InputWithLabel
        labelTitle="Group Name"
        name="groupName"
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="e.g., Test IDs"
      />

      <InputWithLabel
        labelTitle="Item IDs"
        name="itemIds"
        type="text"
        value={itemIds.join(', ')}
        onChange={handleItemIdsChange}
        placeholder="e.g., 190320, 190321, 6037"
      />

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <ItemClassSelect
          itemClass={-1}
          itemSubClass={-1}
          onChange={handleCategoryChange}
        />

        {categories.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium mb-1">Selected Categories:</h5>
            <ul className="text-sm">
              {categories.map((cat, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>
                    Class: {cat.item_class}, Subclass: {cat.item_subclass}
                  </span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const newCategories = categories.filter(
                        (_, i) => i !== index
                      )
                      setCategories(newCategories)
                      onChange({
                        name,
                        item_ids: itemIds,
                        categories: newCategories
                      })
                    }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceGroupForm
