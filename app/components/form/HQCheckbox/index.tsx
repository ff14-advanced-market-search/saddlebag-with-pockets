import Label from '../Label'

/**
* Renders a checkbox with an associated label and handles change events specific to marking a "High Quality Only" option.
* @example
* `renderCheckbox({ checked: true, onChange: handleCheckboxChange })`
* Outputs a checkbox UI with the "High Quality Only" label and an event handler.
* @param {boolean} checked - Indicates whether the checkbox is checked or not.
* @param {function} onChange - Function to handle change events triggered by the checkbox.
* @returns {JSX.Element} Returns a JSX element containing the checkbox and label arrangement.
* @description
*   - The checkbox is visually styled and aligned centrally within a parent container.
*   - It utilizes custom tailwind classes for styling.
*/
const HQCheckbox = ({
  onChange,
  checked
}: {
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="flex justify-center items-center max-w-fit">
    <Label htmlFor="hq-only">High Quality Only</Label>
    <input
      className="ml-2 rounded p-1"
      id="hq-only"
      type="checkbox"
      checked={checked}
      onChange={onChange}
    />
  </div>
)
export default HQCheckbox
