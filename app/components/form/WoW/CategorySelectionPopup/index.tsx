import { useState } from 'react'
import { ExpansionSelect } from '../WoWScanForm'
import CommodityQualitySelect from '../CommodityQualitySelect'
import { ItemClassSelect } from '../WoWScanForm'
import { getCommodityItemClasses } from '~/utils/WoWFilers/commodityClasses'

interface Category {
  item_class: number
  item_subclass: number
  expansion_number: number
  min_quality: number
  commodity_type?: string
}

interface CategorySelectionPopupProps {
  onClose: () => void
  onAdd: (category: Category) => void
}

const CategorySelectionPopup = ({
  onClose,
  onAdd
}: CategorySelectionPopupProps) => {
  const [expansion, setExpansion] = useState('-1')
  const [quality, setQuality] = useState('0')
  const [itemClass, setItemClass] = useState(-1)
  const [itemSubClass, setItemSubClass] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  const handleCategoryChange = (
    newItemClass: number,
    newItemSubClass: number
  ) => {
    setItemClass(newItemClass)
    setItemSubClass(newItemSubClass)
    setError(null)
  }

  const handleExpansionChange = (value: string) => {
    setExpansion(value)
    setError(null)
  }

  const handleQualityChange = (value: string) => {
    setQuality(value)
    setError(null)
  }

  const handleAdd = () => {
    if (itemClass === -1) {
      setError('Please select an item category')
      return
    }
    onAdd({
      item_class: itemClass,
      item_subclass: itemSubClass,
      expansion_number: Number(expansion),
      min_quality: Number(quality)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add Category
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-gray-900 dark:text-gray-100">
            <ExpansionSelect
              defaultValue={expansion}
              onChange={handleExpansionChange}
            />
          </div>

          <div className="text-gray-900 dark:text-gray-100">
            <CommodityQualitySelect
              defaultValue={quality}
              onChange={handleQualityChange}
            />
          </div>

          <div className="text-gray-900 dark:text-gray-100">
            <ItemClassSelect
              itemClass={itemClass}
              itemSubClass={itemSubClass}
              onChange={handleCategoryChange}
              itemClassesOverride={getCommodityItemClasses()}
            />
          </div>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategorySelectionPopup
