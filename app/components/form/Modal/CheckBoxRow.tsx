interface CheckboxRowProps {
  selected: boolean
  onChange: (e: React.ChangeEvent) => void
  id: string | number
  title: string
}

/**
 * Renders a checkbox row with a label based on provided props.
 * @example
 * CheckboxRow({ selected: true, onChange: () => {}, id: "1", title: "Label" })
 * // Returns a JSX element rendering a checkbox with a label
 * @param {boolean} selected - Boolean indicating if the checkbox is checked.
 * @param {function} onChange - Handler function to execute on checkbox change.
 * @param {string} id - Unique identifier used for the checkbox element and label.
 * @param {string} title - The text to display as the label next to the checkbox.
 * @returns {JSX.Element} Returns a JSX element representing a checkbox and label row.
 * @description
 *   - Applies styling for both dark and light themes.
 *   - The checkbox's id is composed using both title and id for uniqueness.
 *   - Adopts flex styling to maintain structural consistency.
 */
export const CheckBoxRow = ({
  selected,
  onChange,
  id,
  title
}: CheckboxRowProps) => {
  return (
    <div className="w-[95%] flex px-1 py-2 z-[inherit] shadow-sm mb-0.5 content-between items-center min-h-12 dark:text-gray-300 dark:border-b dark:border-gray-500">
      <label htmlFor={`${title}-${id}`} className="grow text-left">
        {title}
      </label>
      <input
        id={`${title}-${id}`}
        checked={selected}
        onChange={onChange}
        type="checkbox"
      />
    </div>
  )
}
