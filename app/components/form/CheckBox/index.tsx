/**
 * Renders a checkbox input with an associated label.
 * @example
 * CheckBox({ labelTitle: "Accept Terms", className: "custom-class", labelClassName: "label-custom-class", id: "terms" })
 * <div class="flex justify-center items-center max-w-fit">
 *   <label class="dark:text-gray-200 label-custom-class" for="terms">Accept Terms</label>
 *   <input class="ml-2 rounded p-1 custom-class" type="checkbox" id="terms"></input>
 * </div>
 * @param {string} labelTitle - Text to display as the label for the checkbox.
 * @param {string} [labelClassName] - Additional CSS classes for the label element.
 * @param {string} [className] - Additional CSS classes for the checkbox input.
 * @param {Object} rest - Additional attributes to pass to the input element.
 * @returns {JSX.Element} A React component containing a label and checkbox input.
 * @description
 *   - Component is styled using Tailwind CSS classes for layout and theme compatibility.
 *   - Supports passing HTML input attributes via the `rest` parameter.
 */
const CheckBox = ({
  labelTitle,
  className,
  labelClassName,
  ...rest
}: { labelTitle: string; labelClassName?: string } & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <div className="flex justify-center items-center max-w-fit">
    <label
      htmlFor={rest?.id}
      className={`dark:text-gray-200 ${labelClassName}`}>
      {labelTitle}
    </label>
    <input
      className={`ml-2 rounded p-1${className ? ` ${className}` : ''}`}
      type="checkbox"
      {...rest}
    />
  </div>
)

export default CheckBox
