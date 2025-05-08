import { useState } from 'react'
import { InputWithLabel } from '../form/InputWithLabel'
import DebouncedSelectInput from '../Common/DebouncedSelectInput'
import { ffxivItems, ffxivItemsList } from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'
import ItemsFilter from '../form/ffxiv/ItemsFilter'
import type { ImportData } from '~/requests/FFXIV/types'

type PriceGroup = NonNullable<ImportData['price_groups']>[number]

interface PriceGroupsSectionProps {
  priceGroups: PriceGroup[]
  onPriceGroupsChange: (groups: PriceGroup[]) => void
  onError: (error: string | undefined) => void
  isSubmitting: boolean
}

const MAX_PRICE_GROUPS = 10

export default function PriceGroupsSection({
  priceGroups,
  onPriceGroupsChange,
  onError,
  isSubmitting
}: PriceGroupsSectionProps) {
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [currentItemNames, setCurrentItemNames] = useState<
    Record<string, string>
  >({})
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const handleAddGroup = () => {
    if (!groupName) {
      onError('Group name is required')
      return
    }

    onPriceGroupsChange([
      ...priceGroups,
      {
        name: groupName,
        item_ids: selectedItems,
        categories: selectedCategories
      }
    ])
    setGroupName('')
    setSelectedCategories([])
    setSelectedItems([])
    setCurrentItemNames({})
    setShowAddGroup(false)
  }

  const handleItemSelect = (value: string, groupIndex?: number) => {
    const itemId = getItemIDByName(value.trim(), ffxivItems)
    if (itemId) {
      const numericItemId = Number.parseInt(itemId)
      if (groupIndex !== undefined) {
        // Adding to existing group
        const newGroups = [...priceGroups]
        if (!newGroups[groupIndex].item_ids.includes(numericItemId)) {
          newGroups[groupIndex].item_ids.push(numericItemId)
          onPriceGroupsChange(newGroups)
        }
        // Clear the input for this group
        setCurrentItemNames((prev) => ({ ...prev, [groupIndex]: '' }))
      } else {
        // Adding to new group being created
        if (!selectedItems.includes(numericItemId)) {
          setSelectedItems([...selectedItems, numericItemId])
        }
        // Clear the input for new group
        setCurrentItemNames((prev) => ({ ...prev, new: '' }))
      }
    }
  }

  const handleRemoveGroup = (index: number) => {
    const newGroups = priceGroups.filter((_, i) => i !== index)
    onPriceGroupsChange(newGroups)
    // Remove the input value for this group
    setCurrentItemNames((prev) => {
      const { [index]: _, ...rest } = prev
      return rest
    })
  }

  const handleRemoveItem = (groupIndex: number, itemId: number) => {
    const newGroups = [...priceGroups]
    newGroups[groupIndex].item_ids = newGroups[groupIndex].item_ids.filter(
      (id) => id !== itemId
    )
    onPriceGroupsChange(newGroups)
  }

  const handleRemoveNewItem = (itemId: number) => {
    setSelectedItems(selectedItems.filter((id) => id !== itemId))
  }

  return (
    <div className="space-y-4">
      {/* Submit Button or Empty State */}
      {priceGroups.length > 0 ? (
        <div className="flex justify-center my-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 pulse disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {isSubmitting ? 'Searching...' : 'Search Price Groups'}
          </button>
        </div>
      ) : (
        <div className="text-center my-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            No price groups added yet. Add a price group to begin your analysis.
          </p>
          <button
            type="button"
            onClick={() => setShowAddGroup(true)}
            className="text-blue-500 hover:text-blue-600 font-medium">
            Add your first price group →
          </button>
        </div>
      )}

      {/* Add Group Button */}
      {!showAddGroup && (
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowAddGroup(true)}
            disabled={priceGroups.length >= MAX_PRICE_GROUPS || isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Add Price Group
          </button>
          {priceGroups.length >= MAX_PRICE_GROUPS && (
            <span className="text-sm text-red-500">
              Maximum number of price groups reached
            </span>
          )}
        </div>
      )}

      {/* Add Group Form */}
      {showAddGroup && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Add Price Group
          </h3>
          <div className="space-y-4">
            <InputWithLabel
              name="groupName"
              labelTitle="Group Name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Test IDs"
            />
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Add item by name
              </h5>
              <DebouncedSelectInput
                id="new-group-item-select"
                title="Search for item by name"
                tooltip="Select items to add to this group"
                placeholder="Search for items..."
                label="Item"
                selectOptions={ffxivItemsList}
                onSelect={(value) => handleItemSelect(value)}
                displayValue={currentItemNames.new || ''}
              />
            </div>

            {selectedItems.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected Items:
                </h5>
                {selectedItems.map((itemId) => {
                  const itemEntry = ffxivItemsList.find(
                    (item) => item.value === itemId.toString()
                  )
                  const itemName = itemEntry
                    ? itemEntry.label
                    : `Unknown Item (${itemId})`
                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <div className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                        {itemName}
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleRemoveNewItem(itemId)}>
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div>
              <label
                htmlFor="new-group-categories"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Categories
              </label>
              <ItemsFilter
                formName="new-group-categories"
                defaultFilters={selectedCategories}
                onChange={(newCategories) =>
                  setSelectedCategories(newCategories)
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddGroup}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Add Group
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddGroup(false)
                  setGroupName('')
                  setSelectedCategories([])
                  setSelectedItems([])
                  setCurrentItemNames({})
                }}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Groups */}
      {priceGroups.map((group, groupIndex) => (
        <div
          key={`${group.name}-${groupIndex}`}
          className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {group.name}
            </h4>
            <button
              type="button"
              onClick={() => handleRemoveGroup(groupIndex)}
              className="text-red-500 hover:text-red-600">
              Remove Group
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Add item by name
              </h5>
              <DebouncedSelectInput
                id={`item-select-${groupIndex}`}
                title="Search for item by name"
                tooltip="Select items to add to this group"
                placeholder="Search for items..."
                label="Item"
                selectOptions={ffxivItemsList}
                onSelect={(value) => handleItemSelect(value, groupIndex)}
                displayValue={currentItemNames[groupIndex] || ''}
              />
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Categories
              </h5>
              <ItemsFilter
                defaultFilters={group.categories}
                onChange={(newCategories) => {
                  const newGroups = [...priceGroups]
                  newGroups[groupIndex].categories = newCategories
                  onPriceGroupsChange(newGroups)
                }}
              />
            </div>

            {group.item_ids.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected Items:
                </h5>
                {group.item_ids.map((itemId) => {
                  const itemEntry = ffxivItemsList.find(
                    (item) => item.value === itemId.toString()
                  )
                  const itemName = itemEntry
                    ? itemEntry.label
                    : `Unknown Item (${itemId})`
                  return (
                    <div
                      key={itemId}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                      <div className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                        {itemName}
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleRemoveItem(groupIndex, itemId)}>
                        Remove
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
