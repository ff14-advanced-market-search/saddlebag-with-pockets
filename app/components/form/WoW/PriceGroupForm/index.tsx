import { useState } from 'react'
import { InputWithLabel } from '../../InputWithLabel'
import { ItemClassSelect } from '../WoWScanForm'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'
import CodeBlock from '~/components/Common/CodeBlock'

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
  const [currentItemName, setCurrentItemName] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    onChange({
      name: newName,
      item_ids: itemIds,
      categories
    })
  }

  const handleItemSelect = (value: string) => {
    setCurrentItemName(value)
    const itemId = getItemIDByName(value.trim(), wowItems)
    if (itemId) {
      const newIds = [...new Set([...itemIds, parseInt(itemId)])]
      setItemIds(newIds)
      onChange({
        name,
        item_ids: newIds,
        categories
      })
    }
  }

  const removeItem = (idToRemove: number) => {
    const newIds = itemIds.filter(id => id !== idToRemove)
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

      <div className="mt-4">
        <DebouncedSelectInput
          title="Add item by name"
          label="Item"
          id="item-select"
          selectOptions={wowItemsList}
          onSelect={handleItemSelect}
          displayValue={currentItemName}
        />
      </div>

      {itemIds.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Selected Items:</h4>
          <div className="space-y-2">
            {itemIds.map((id) => {
              // Get the item name from wowItemsList
              const itemEntry = wowItemsList.find(item => item.value === id.toString())
              const itemName = itemEntry ? itemEntry.label : `Unknown Item (${id})`
              return (
                <div key={id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <div className="flex-1 text-sm">
                    {itemName}
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => removeItem(id)}>
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <span>Class: {cat.item_class}, Subclass: {cat.item_subclass}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const newCategories = categories.filter((_, i) => i !== index)
                      setCategories(newCategories)
                      onChange({
                        name,
                        item_ids: itemIds,
                        categories: newCategories
                      })
                    }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceGroupForm
