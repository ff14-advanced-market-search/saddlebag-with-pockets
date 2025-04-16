interface VisibleItemsListProps {
  visibleItems: Record<string, boolean>
  visibilityFilter: string
  onVisibilityChange: (name: string, isVisible: boolean) => void
}

/**
 * Displays a scrollable, filterable list of items with checkboxes to toggle their visibility.
 *
 * Filters items by name using the provided {@link visibilityFilter} (case-insensitive). If no items match, a message is shown. Toggling a checkbox calls {@link onVisibilityChange} with the item's name and new visibility state.
 */
export default function VisibleItemsList({
  visibleItems,
  visibilityFilter,
  onVisibilityChange
}: VisibleItemsListProps) {
  return (
    <div className="overflow-auto px-4 pb-4 flex-grow">
      <div className="space-y-2">
        {Object.entries(visibleItems).filter(([name]) =>
          name.toLowerCase().includes(visibilityFilter.toLowerCase())
        ).length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 p-2">
            No items match your filter criteria
          </p>
        )}
        {Object.entries(visibleItems)
          .filter(([name]) =>
            name.toLowerCase().includes(visibilityFilter.toLowerCase())
          )
          .map(([name, isVisible]) => (
            <label
              key={name}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => onVisibilityChange(name, !isVisible)}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
              <span
                className="text-sm text-gray-900 dark:text-gray-100"
                title={name}>
                {name}
              </span>
            </label>
          ))}
      </div>
    </div>
  )
}
