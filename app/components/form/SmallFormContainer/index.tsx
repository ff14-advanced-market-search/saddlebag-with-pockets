import { Form } from 'react-router'
import React from 'react'
import { SubmitButton } from '../SubmitButton'

/**
 * Renders a small form container with optional title, description, error message, and a submit button.
 * @example
 * <SmallFormContainer
 *   title="Form Title"
 *   error="Error message"
 *   onClick={handleClick}
 *   loading={true}
 *   disabled={false}
 *   description="This is a description."
 *   buttonTitle="Submit"
 *   hideSubmitButton={false}
 *   action="/submit"
 * >
 *   <ChildComponent />
 * </SmallFormContainer>
 * @param {React.ReactNode} children - The content elements to be wrapped within the form container.
 * @param {string} [title] - An optional title to be displayed at the top of the form.
 * @param {string} [error] - An optional error message displayed within the form.
 * @param {boolean} [loading] - Flag indicating if the button displays a loading state.
 * @param {Function} onClick - Handler for the submit button's click event.
 * @param {boolean} [disabled] - Flag indicating if the submit button is disabled.
 * @param {string | JSX.Element} [description] - Optional description below the title, can be text or a JSX element.
 * @param {string} [buttonTitle="Search"] - Title for the submit button, defaults to 'Search'.
 * @param {boolean} [hideSubmitButton=false] - Flag to determine if the submit button should be hidden.
 * @param {string} [action] - The form action attribute value for form submission path.
 * @returns {JSX.Element} The rendered form component with the specified configuration.
 * @description
 *   - The function wraps children elements within a form container, optionally displaying a title and description.
 *   - Handles the display of error messages and submit button state (loading or disabled).
 *   - Supports hiding the submit button based on props.
 */
const SmallFormContainer = ({
  children,
  title,
  error,
  onClick,
  loading,
  disabled,
  description,
  buttonTitle = 'Search',
  hideSubmitButton = false,
  action
}: {
  children: React.ReactNode
  title?: string
  error?: string
  loading?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  description?: string | JSX.Element
  buttonTitle?: string
  hideSubmitButton?: boolean
  action?: string
}) => {
  const descriptionForDisplay = description ? (
    typeof description === 'string' ? (
      <p className="italic text-sm text-grey-500 px-3 py-1 dark:text-gray-300 mb-1">
        {description}
      </p>
    ) : (
      description
    )
  ) : undefined
  return (
    <Form method="POST" action={action}>
      <div className="max-w-4xl mx-auto px-4">
        {title && (
          <h1 className="text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100">
            {title}
          </h1>
        )}
        {!!descriptionForDisplay && descriptionForDisplay}
        <div className="mt-0 md:col-span-3">
          <div className="shadow rounded-md px-4 bg-white dark:bg-slate-700">
            {children}
            <div className="px-0 sm:px-4 py-4 bg-white dark:bg-slate-700">
              <div className="flex flex-col justify-between items-start sm:flex-row">
                <p className="text-red-500 dark:text-red-300 mx-0 sm:mx-0 shrink-1">
                  {error}
                </p>
                {!hideSubmitButton && (
                  <SubmitButton
                    title={buttonTitle}
                    onClick={onClick}
                    loading={loading}
                    disabled={disabled}
                    className="max-h-fit grow-0 ml-0 sm:ml-3 mt-2 sm:mt-0 shrink-0 self-start sm:self-center"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default SmallFormContainer
