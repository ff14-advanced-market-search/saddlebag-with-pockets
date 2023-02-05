import { Form } from '@remix-run/react'
import React from 'react'
import { SubmitButton } from '../SubmitButton'

const SmallFormContainer = ({
  children,
  title,
  error,
  onClick,
  loading,
  disabled,
  description,
  buttonTitle = 'Search'
}: {
  children: React.ReactNode
  title: string
  error?: string
  loading?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  description?: string
  buttonTitle?: string
}) => {
  return (
    <Form method="post">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-blue-900 py-2 dark:text-gray-100">
          {title}
        </h1>
        {description && (
          <p className="italic text-sm text-grey-500 px-3 py-1 dark:text-gray-300">
            {description}
          </p>
        )}
        <div className="mt-0 md:col-span-3">
          <div className="shadow rounded-md px-4 bg-white dark:bg-slate-700">
            {children}
            <div className="px-4 py-4 bg-white dark:bg-slate-700">
              <div className="flex justify-between">
                <p className="text-red-500 dark:text-red-300 mx-2">{error}</p>
                <SubmitButton
                  title={buttonTitle}
                  onClick={onClick}
                  loading={loading}
                  disabled={disabled}
                  className="max-h-fit grow-0 shrink-0 self-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default SmallFormContainer
