import { useState } from 'react'
import { InputWithLabel } from '../../InputWithLabel'
import DebouncedSelectInput from '~/components/Common/DebouncedSelectInput'
import {
  wowStackableItemList,
  wowStackableItems
} from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'
import CategorySelectionPopup from '../CategorySelectionPopup'
import { itemClasses } from '~/utils/WoWFilters/itemClasses'
import { getExpansionName } from '~/utils/WoWFilters/expansions'

export interface PriceGroup {
  name: string
  item_ids: number[]
  categories: Array<{
    item_class: number
    item_subclass: number
    expansion_number: number
    min_quality: number
    commodity_type?: string
  }>
}

interface PriceGroupFormProps {
  group: PriceGroup
  groupIndex: number
  currentItemName: string
  onGroupNameChange: (newName: string) => void
  onItemSelect: (value: string) => void
  onItemInputChange: (value: string) => void
  onRemoveItem: (itemId: number) => void
  onCategoriesChange: (newCategories: PriceGroup['categories']) => void
  onRemoveGroup: () => void
  canRemove: boolean
}

const PriceGroupForm = ({
  group,
  groupIndex,
  currentItemName,
  onGroupNameChange,
  onItemSelect,
  onItemInputChange,
  onRemoveItem,
  onCategoriesChange,
  onRemoveGroup,
  canRemove
}: PriceGroupFormProps) => {
  const [showCategoryPopup, setShowCategoryPopup] = useState(false)

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
        {canRemove && (
          <button
            onClick={onRemoveGroup}
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
        value={group.name}
        onChange={(e) => onGroupNameChange(e.target.value)}
        placeholder="e.g., Test IDs"
      />

      <div className="mt-4">
        <DebouncedSelectInput
          title="Add item by name (stackable commodity items only)"
          label="Item"
          id={`item-select-${groupIndex}`}
          selectOptions={wowStackableItemList}
          onSelect={onItemSelect}
          displayValue={currentItemName}
        />
      </div>

      {group.item_ids.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Selected Items:
          </h4>
          <div className="space-y-2">
            {group.item_ids.map((id) => {
              const itemEntry = wowStackableItemList.find(
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
                    onClick={() => onRemoveItem(id)}>
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

        {group.categories.length > 0 && (
          <div className="space-y-2">
            {group.categories.map((cat, index) => {
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
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => {
                      const updatedCategories = group.categories.filter(
                        (_, i) => i !== index
                      )
                      onCategoriesChange(updatedCategories)
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
          onAdd={(newCategory) => {
            onCategoriesChange([...group.categories, newCategory])
            setShowCategoryPopup(false)
          }}
        />
      )}
    </div>
  )
}

export default PriceGroupForm
