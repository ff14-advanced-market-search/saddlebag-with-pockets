import { classNames } from '~/utils'
import Label from '../Label'

/**
 * Renders a styled select dropdown component with optional title label.
 * @example
 * SelectComponent({ title: "Choose option", options: [{ label: "Option 1", value: 1 }, { label: "Option 2", value: 2 }], id: "select-id", className: "custom-class" })
 * Returns JSX element containing select dropdown with specified options and styling.
 * @param {string} title - Optional title for the select dropdown.
 * @param {Array<{ label: string; value: string | number }>} options - Array of objects representing the options for the dropdown.
 * @param {string} id - Optional id for the select element to facilitate form handling.
 * @param {string} className - Additional CSS class names for the select element styling.
 * @returns {JSX.Element} JSX element representing a select dropdown with optional styling and title.
 * @description
 *   - Utilizes Tailwind CSS classes for styling the select element and its container.
 *   - Dynamically adds a title label if the `title` parameter is provided.
 *   - Merges custom class names with default styling using a utility function.
 */
const Select = ({
  title,
  options,
  className,
  id,
  ...rest
}: {
  title?: string
  options: Array<{ label: string; value: string | number }>
  id?: string
  className?: string
} & React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>) => {
  const selectClassName =
    'flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400'

  const classes = classNames(selectClassName, className || '')

  return (
    <div className="my-2">
      {title && <Label htmlFor={id}>{title}</Label>}
      <select id={id} className={classes} {...rest}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
