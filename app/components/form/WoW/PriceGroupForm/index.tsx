import { useState } from 'react'
import { InputWithLabel } from '../../InputWithLabel'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import { wowItems, wowItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'
import CategorySelectionPopup from '../CategorySelectionPopup'
import { itemClasses } from '~/utils/WoWFilers/itemClasses'
import { getExpansionName } from '~/utils/WoWFilers/expansions'

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
  const [showCategoryPopup, setShowCategoryPopup] = useState(false)

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
      const newIds = [...new Set([...itemIds, Number.parseInt(itemId)])]
      setItemIds(newIds)
      onChange({
        name,
        item_ids: newIds,
        categories
      })
    }
  }

  const removeItem = (idToRemove: number) => {
    const newIds = itemIds.filter((id) => id !== idToRemove)
    setItemIds(newIds)
    onChange({
      name,
      item_ids: newIds,
      categories
    })
  }

  const handleAddCategory = (newCategory: PriceGroup['categories'][0]) => {
    // Check if this category already exists
    const exists = categories.some(
      (cat) =>
        cat.item_class === newCategory.item_class &&
        cat.item_subclass === newCategory.item_subclass &&
        cat.expansion_number === newCategory.expansion_number &&
        cat.min_quality === newCategory.min_quality
    )

    if (!exists) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      onChange({
        name,
        item_ids: itemIds,
        categories: updatedCategories
      })
    }
  }

  const getQualityDisplay = (quality: number): string => {
    switch (quality) {
      case 0:
        return 'No quality'
      case 1:
        return '⭐'
      case 2:
        return '⭐⭐'
      case 3:
        return '⭐⭐⭐'
      default:
        return `Quality ${quality}`
    }
  }

  // Helper function to get class and subclass names
  const getClassAndSubclassNames = (
    itemClass: number,
    itemSubclass: number
  ) => {
    const classInfo = itemClasses.find((c) => c.value === itemClass)
    if (!classInfo)
      return {
        className: `Unknown (${itemClass})`,
        subclassName: `Unknown (${itemSubclass})`
      }

    const subclassInfo =
      itemSubclass === -1
        ? null
        : classInfo.subClasses.find((s) => s.value === itemSubclass)
    return {
      className: classInfo.name,
      subclassName: subclassInfo ? subclassInfo.name : 'All'
    }
  }

  return (
    <div className="border rounded-md p-4 mb-4 dark:border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Price Group
        </h3>
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
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Selected Items:
          </h4>
          <div className="space-y-2">
            {itemIds.map((id) => {
              const itemEntry = wowItemsList.find(
                (item) => item.value === id.toString()
              )
              const itemName = itemEntry
                ? itemEntry.label
                : `Unknown Item (${id})`
              return (
                <div
                  key={id}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <div className="flex-1 text-sm text-gray-900 dark:text-gray-100">
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
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Categories
          </h4>
          <button
            type="button"
            onClick={() => setShowCategoryPopup(true)}
            className="text-blue-500 hover:text-blue-600 text-sm">
            Add Category
          </button>
        </div>

        {categories.length > 0 && (
          <div className="space-y-2">
            {categories.map((cat, index) => {
              const { className, subclassName } = getClassAndSubclassNames(
                cat.item_class,
                cat.item_subclass
              )
              return (
                <div
                  key={`${cat.item_class}-${cat.item_subclass}-${cat.expansion_number}-${cat.min_quality}`}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <div className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                    <div>
                      Class: {className}, Subclass: {subclassName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      Quality: {getQualityDisplay(cat.min_quality)}, Expansion:{' '}
                      {getExpansionName(cat.expansion_number)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      const updatedCategories = categories.filter(
                        (_, i) => i !== index
                      )
                      setCategories(updatedCategories)
                      onChange({
                        name,
                        item_ids: itemIds,
                        categories: updatedCategories
                      })
                    }}>
                    Remove
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showCategoryPopup && (
        <CategorySelectionPopup
          onClose={() => setShowCategoryPopup(false)}
          onAdd={handleAddCategory}
        />
      )}
    </div>
  )
}

export default PriceGroupForm
