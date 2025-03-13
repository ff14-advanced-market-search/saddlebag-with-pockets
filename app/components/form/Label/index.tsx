/**
* Renders a styled label element with default styles and passed props.
* @example
* Label({ htmlFor: "username", children: "Username" })
* <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5 dark:bg-transparent" for="username">Username</label>
* @param {React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>} props - Props to be applied to the label element.
* @returns {JSX.Element} Returns a JSX element that represents a styled label.
* @description
*   - Applies default styling for responsive typography and color adjustment in light/dark modes.
*   - Ensures the label is block-level to occupy full width.
*/
export default function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
) {
  return (
    <label
      {...props}
      className={
        'block text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5 dark:bg-transparent'
      }
    />
  )
}
