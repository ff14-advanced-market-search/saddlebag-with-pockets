import { classNames } from '~/utils'

/**
 * A customizable submit button component for forms with loading and disabled states.
 * @example
 * <SubmitButton
 *   title="Submit"
 *   onClick={handleSubmit}
 *   loading={isSubmitting}
 *   disabled={!isValidForm}
 *   className="extra-class"
 * />
 * @param {string} title - Optional text to display on the button.
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} onClick - Callback function executed on button click.
 * @param {boolean} loading - If true, a loading spinner is shown and the button is disabled; defaults to false.
 * @param {boolean} disabled - If true, the button is rendered in a disabled state; defaults to false.
 * @param {string} className - Additional classes to style the button.
 * @param {React.ReactNode} children - Content to display within the button when 'title' is not provided.
 * @returns {React.ReactElement} A React element representing a customizable submit button.
 * @description
 *   - Button shows a loading spinner when `loading` is true.
 *   - Mixed state is possible when `loading` and `disabled` are both true.
 *   - Additional props are spread onto the underlying button element.
 */
export const SubmitButton = ({
  title,
  onClick,
  loading,
  disabled,
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  title?: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: boolean
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading || disabled}
      className={classNames(
        loading || disabled ? 'bg-gray-500' : 'bg-blue-600',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-700',
        'ml-3 inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        className || ''
      )}
      {...rest}>
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {title}
      {!title && children}
    </button>
  )
}
