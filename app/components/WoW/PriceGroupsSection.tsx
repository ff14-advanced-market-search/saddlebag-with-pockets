import type { PriceGroup } from '~/requests/WoW/WeeklyPriceGroupDelta'
import PriceGroupForm from '~/components/form/WoW/PriceGroupForm'
import { useState } from 'react'
import ErrorPopup from '~/components/Common/ErrorPopup'
import { wowStackableItems } from '~/utils/items/id_to_item'
import { getItemIDByName } from '~/utils/items'

interface PriceGroupsSectionProps {
  priceGroups: PriceGroup[]
  onPriceGroupsChange: (groups: PriceGroup[]) => void
  onError: (error: string | undefined) => void
  isSubmitting: boolean
}

const MAX_PRICE_GROUPS = 49
const MAX_NAME_LENGTH = 64
const VALID_NAME_REGEX = /^[a-zA-Z0-9\s'.,\-_]*$/

const validatePriceGroup = (group: PriceGroup): string | null => {
  // Check for empty name
  if (!group.name.trim()) {
    return 'Price group name cannot be empty'
  }

  // Validate name length
  if (group.name.length > MAX_NAME_LENGTH) {
    return `Price group "${group.name}" name must be less than 64 characters`
  }

  // Validate name characters
  if (!VALID_NAME_REGEX.test(group.name)) {
    return `Price group "${group.name}" name can only contain alphanumeric characters, periods, commas, spaces, hyphens, and underscores`
  }

  // Check if both item_ids and categories are empty
  if (group.item_ids.length === 0 && group.categories.length === 0) {
    return `Price group "${group.name}" must have at least one item or category`
  }

  // Validate that all item IDs are positive integers
  const invalidItemIds = group.item_ids.filter(
    (id) => !Number.isInteger(id) || id <= 0
  )
  if (invalidItemIds.length > 0) {
    return `Price group "${group.name}" contains invalid item IDs. All item IDs must be positive integers.`
  }

  return null
}

/**
 * Renders a section for managing and validating a list of price groups, allowing users to add, edit, remove, and submit groups with enforced constraints.
 *
 * Displays a list of editable price group forms, enforces a maximum of MAX_PRICE_GROUPS groups, and validates each group's name and contents before submission. Provides error feedback via the {@link onError} callback and disables submission during processing.
 *
 * @param priceGroups - The current list of price groups to display and edit.
 * @param onPriceGroupsChange - Callback invoked when the list of price groups is modified.
 * @param onError - Callback invoked with an error message when validation fails, or `undefined` to clear errors.
 * @param isSubmitting - Indicates whether a submission is currently in progress.
 *
 * @remark
 * Enforces a maximum of MAX_PRICE_GROUPS price groups. Each group must have a non-empty, valid name and at least one item or category. Submission is blocked if validation fails.
 */
export default function PriceGroupsSection({
  priceGroups,
  onPriceGroupsChange,
  onError,
  isSubmitting
}: PriceGroupsSectionProps) {
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  )
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [currentItemNames, setCurrentItemNames] = useState<
    Record<number, string>
  >({})

  const handleAddPriceGroup = () => {
    if (priceGroups.length >= MAX_PRICE_GROUPS) {
      onError(`Maximum of ${MAX_PRICE_GROUPS} price groups allowed`)
      return
    }

    onPriceGroupsChange([
      ...priceGroups,
      {
        name: '',
        item_ids: [],
        categories: []
      }
    ])
  }

  const handleItemSelect = (value: string, groupIndex: number) => {
    const itemId = getItemIDByName(value.trim(), wowStackableItems)
    if (itemId) {
      const numericItemId = Number.parseInt(itemId)
      const newGroups = [...priceGroups]
      if (!newGroups[groupIndex].item_ids.includes(numericItemId)) {
        newGroups[groupIndex].item_ids.push(numericItemId)
        onPriceGroupsChange(newGroups)
      }
      setCurrentItemNames((prev) => ({ ...prev, [groupIndex]: '' }))
    }
  }

  const handleRemoveItem = (groupIndex: number, itemId: number) => {
    const newGroups = [...priceGroups]
    newGroups[groupIndex].item_ids = newGroups[groupIndex].item_ids.filter(
      (id) => id !== itemId
    )
    onPriceGroupsChange(newGroups)
  }

  const handleRemoveGroup = (index: number) => {
    const newGroups = priceGroups.filter((_, i) => i !== index)
    onPriceGroupsChange(newGroups)
    setCurrentItemNames((prev) => {
      const { [index]: _, ...rest } = prev
      return rest
    })
  }

  const handleGroupNameChange = (index: number, newName: string) => {
    const newGroups = [...priceGroups]
    newGroups[index].name = newName
    onPriceGroupsChange(newGroups)
    onError(undefined)
  }

  const handleCategoriesChange = (index: number, newCategories: any) => {
    const newGroups = [...priceGroups]
    newGroups[index].categories = newCategories
    onPriceGroupsChange(newGroups)
    onError(undefined)
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting) {
      e.preventDefault()
      return
    }

    // Check if there are any price groups
    if (priceGroups.length === 0) {
      e.preventDefault()
      setValidationError('Please add at least one price group')
      setShowErrorPopup(true)
      onError('Please add at least one price group')
      return
    }

    // Validate all price groups before submission
    for (const group of priceGroups) {
      const validationError = validatePriceGroup(group)
      if (validationError) {
        e.preventDefault()
        setValidationError(validationError)
        setShowErrorPopup(true)
        onError(validationError)
        return
      }
    }

    setValidationError(undefined)
    setShowErrorPopup(false)
    onError(undefined)
  }

  return (
    <div className="space-y-4">
      {/* Error Popup for validation errors */}
      {validationError && showErrorPopup && (
        <ErrorPopup
          error={validationError}
          onClose={() => setShowErrorPopup(false)}
        />
      )}

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Price Groups
      </h3>

      {/* Submit Button or Empty State */}
      {priceGroups.length > 0 ? (
        <div className="flex justify-center my-8">
          <button
            type="submit"
            onClick={handleSubmit}
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
            onClick={handleAddPriceGroup}
            className="text-blue-500 hover:text-blue-600 font-medium">
            Add your first price group →
          </button>
        </div>
      )}

      {priceGroups.map((group, index) => (
        <PriceGroupForm
          key={index}
          group={group}
          groupIndex={index}
          currentItemName={currentItemNames[index] || ''}
          onGroupNameChange={(newName) => handleGroupNameChange(index, newName)}
          onItemSelect={(value) => handleItemSelect(value, index)}
          onItemInputChange={(value) =>
            setCurrentItemNames((prev) => ({ ...prev, [index]: value }))
          }
          onRemoveItem={(itemId) => handleRemoveItem(index, itemId)}
          onCategoriesChange={(newCategories) =>
            handleCategoriesChange(index, newCategories)
          }
          onRemoveGroup={() => handleRemoveGroup(index)}
          canRemove={priceGroups.length > 1}
        />
      ))}
      <button
        type="button"
        onClick={handleAddPriceGroup}
        disabled={priceGroups.length >= MAX_PRICE_GROUPS}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
        Add Price Group
      </button>
    </div>
  )
}
