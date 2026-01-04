import { useState } from 'react'
import { InputWithLabel } from '../form/InputWithLabel'
import DebouncedSelectInput from '../Common/DebouncedSelectInput'
import { gw2ItemsList } from '~/utils/items/id_to_item'
import { itemTypes, type ItemType } from '~/utils/GW2Filters/itemTypes'
import ErrorPopup from '../Common/ErrorPopup'
import type { GW2PriceGroup } from '~/requests/GW2/WeeklyPriceGroupDelta'

interface PriceGroupsSectionProps {
  priceGroups: GW2PriceGroup[]
  onPriceGroupsChange: (groups: GW2PriceGroup[]) => void
  onError: (error: string | undefined) => void
  isSubmitting: boolean
  setIsAddingPriceGroup: (isAdding: boolean) => void
}

const MAX_PRICE_GROUPS = 10

// Build a flat list of all types and details_types for selection
const allTypesAndDetails: Array<{
  name: string
  value: number
  isDetailsType: boolean
}> = []

itemTypes.forEach((itemType: ItemType) => {
  // Add main type
  allTypesAndDetails.push({
    name: `${itemType.name} (Type)`,
    value: itemType.value,
    isDetailsType: false
  })
  // Add all details types
  itemType.subClasses.forEach((subClass) => {
    allTypesAndDetails.push({
      name: `${itemType.name} - ${subClass.name} (Details Type)`,
      value: subClass.value,
      isDetailsType: true
    })
  })
})

export default function PriceGroupsSection({
  priceGroups,
  onPriceGroupsChange,
  onError,
  isSubmitting,
  setIsAddingPriceGroup
}: PriceGroupsSectionProps) {
  const [showAddGroup, setStateShowAddGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [currentItemNames, setCurrentItemNames] = useState<
    Record<string, string>
  >({})
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [localError, setLocalError] = useState<string | undefined>(undefined)
  const [showLocalErrorPopup, setShowLocalErrorPopup] = useState(false)

  const setShowAddGroup = (value: boolean) => {
    setStateShowAddGroup(value)
    setIsAddingPriceGroup(value)
  }

  const handleAddGroup = () => {
    if (!groupName) {
      setLocalError('Group name is required')
      setShowLocalErrorPopup(true)
      onError('Group name is required')
      return
    }

    if (selectedItems.length === 0 && selectedTypes.length === 0) {
      setLocalError('Please add at least one item or type to the group')
      setShowLocalErrorPopup(true)
      onError('Please add at least one item or type to the group')
      return
    }

    onPriceGroupsChange([
      ...priceGroups,
      {
        name: groupName,
        item_ids: selectedItems,
        types: selectedTypes
      }
    ])
    setGroupName('')
    setSelectedTypes([])
    setSelectedItems([])
    setCurrentItemNames({})
    setShowAddGroup(false)
    setLocalError(undefined)
    setShowLocalErrorPopup(false)
    onError(undefined)
  }

  const handleItemSelect = (value: string, groupIndex?: number) => {
    // Find item by label in gw2ItemsList
    const itemEntry = gw2ItemsList.find(
      (item) => item.label.toLowerCase() === value.trim().toLowerCase()
    )
    if (itemEntry) {
      const numericItemId = Number.parseInt(itemEntry.value)
      if (!isNaN(numericItemId)) {
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
  }

  const handleRemoveGroup = (index: number) => {
    const newGroups = priceGroups.filter((_, i) => i !== index)
    onPriceGroupsChange(newGroups)
    // Remove the input value for this group
    setCurrentItemNames((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([key]) => key !== index.toString())
      )
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

  const handleTypeToggle = (typeValue: number, groupIndex?: number) => {
    if (groupIndex !== undefined) {
      // Toggle type in existing group
      const newGroups = [...priceGroups]
      const currentTypes = newGroups[groupIndex].types
      if (currentTypes.includes(typeValue)) {
        newGroups[groupIndex].types = currentTypes.filter(
          (t) => t !== typeValue
        )
      } else {
        newGroups[groupIndex].types = [...currentTypes, typeValue]
      }
      onPriceGroupsChange(newGroups)
    } else {
      // Toggle type in new group being created
      if (selectedTypes.includes(typeValue)) {
        setSelectedTypes(selectedTypes.filter((t) => t !== typeValue))
      } else {
        setSelectedTypes([...selectedTypes, typeValue])
      }
    }
  }

  const getTypeName = (typeValue: number): string => {
    const typeInfo = allTypesAndDetails.find((t) => t.value === typeValue)
    return typeInfo ? typeInfo.name : `Type ${typeValue}`
  }

  return (
    <div className="space-y-4">
      {/* Error Popup for local validation errors */}
      {localError && showLocalErrorPopup && (
        <ErrorPopup
          error={localError}
          onClose={() => setShowLocalErrorPopup(false)}
        />
      )}

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
                selectOptions={gw2ItemsList}
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
                  const itemEntry = gw2ItemsList.find(
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
                htmlFor="new-group-types"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Types (Item Types or Details Types)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                {allTypesAndDetails.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => handleTypeToggle(type.value)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {type.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedTypes.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected Types:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((typeValue) => (
                    <div
                      key={typeValue}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {getTypeName(typeValue)}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleTypeToggle(typeValue)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  setSelectedTypes([])
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
                selectOptions={gw2ItemsList}
                onSelect={(value) => handleItemSelect(value, groupIndex)}
                displayValue={currentItemNames[groupIndex] || ''}
              />
            </div>

            <div>
              <label
                htmlFor={`group-types-${groupIndex}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Types (Item Types or Details Types)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                {allTypesAndDetails.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={group.types.includes(type.value)}
                      onChange={() => handleTypeToggle(type.value, groupIndex)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {type.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {group.types.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected Types:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {group.types.map((typeValue) => (
                    <div
                      key={typeValue}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {getTypeName(typeValue)}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-sm"
                        onClick={() => handleTypeToggle(typeValue, groupIndex)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {group.item_ids.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Selected Items:
                </h5>
                {group.item_ids.map((itemId) => {
                  const itemEntry = gw2ItemsList.find(
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
