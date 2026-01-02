/**
 * Renders a set of tabbed buttons for selecting between different options.
 * @example
 * TabbedButtons({
 *   currentValue: "price",
 *   onClick: (value) => setValue(value),
 *   options: [{ value: "price", label: "Price" }, { value: "volume", label: "Volume" }]
 * })
 * @param {string} currentValue - The currently selected value.
 * @param {(value: string) => void} onClick - Callback function when a button is clicked.
 * @param {Array<{value: string, label: string}>} options - Array of button options.
 * @returns {JSX.Element} Rendered tabbed buttons component.
 * @description
 *   - Buttons are styled differently when selected.
 *   - Each button is disabled if it represents the current selected value.
 *   - Layout is responsive with hidden elements for non-md screens.
 */
export const TabbedButtons = ({
  currentValue,
  onClick,
  options
}: {
  currentValue: string
  onClick: (value: string) => void
  options: Array<{ value: string; label: string }>
}) => (
  <div className="hidden md:flex mt-2 gap-2 overflow-x-auto">
    {options.map(({ value, label }) => {
      const selected = value === currentValue
      return (
        <button
          key={`chartTable-${label}`}
          className={`${
            selected
              ? 'text-blue-800 bg-gray-100 dark:text-blue-200 dark:bg-gray-800'
              : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200 shadow-[inset_0_-3px_3px_rgba(0,0,0,0.2)]'
          } px-2 py-1 grow w-1/3 rounded-t-md`}
          disabled={value === currentValue}
          type="button"
          onClick={() => onClick(value)}>
          {label}
        </button>
      )
    })}
  </div>
)
