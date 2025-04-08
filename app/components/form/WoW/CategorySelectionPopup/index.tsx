import { useState } from 'react'
import { ExpansionSelect } from '../WoWScanForm'
import CommodityQualitySelect from '../CommodityQualitySelect'
import { ItemClassSelect } from '../WoWScanForm'

interface Category {
  item_class: number
  item_subclass: number
  expansion_number: number
  min_quality: number
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
    // Check if item category is "All"
    if (itemClass === -1) {
      setError('Please select an item category')
      return
    }

    // // Check if at least one other field has been changed from default
    // const isAllDefault =
    //   expansion === '-1' &&
    //   quality === '0' &&
    //   itemSubClass === -1

    // if (isAllDefault) {
    //   setError('Please change at least one additional option (expansion, quality, or subcategory)')
    //   return
    // }

    onAdd({
      item_class: itemClass,
      item_subclass: itemSubClass,
      expansion_number: parseInt(expansion),
      min_quality: parseInt(quality)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add Category</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <ExpansionSelect
            defaultValue={expansion}
            onChange={handleExpansionChange}
          />

          <CommodityQualitySelect
            defaultValue={quality}
            onChange={handleQualityChange}
          />

          <ItemClassSelect
            itemClass={itemClass}
            itemSubClass={itemSubClass}
            onChange={handleCategoryChange}
          />

          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategorySelectionPopup
