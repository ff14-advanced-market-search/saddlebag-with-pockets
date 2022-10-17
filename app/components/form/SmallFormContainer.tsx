import { Form } from '@remix-run/react'
import React from 'react'
import { SubmitButton } from './SubmitButton'

const SmallFormContainer = ({
  children,
  title,
  error,
  onClick,
  loading,
  disabled
}: {
  children: React.ReactNode
  title: string
  error?: string
  loading?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
}) => {
  return (
    <Form method="post">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-blue-900 py-2">{title}</h1>
        <div className="mt-3 md:mt-0 md:col-span-3 py-2">
          <div className="shadow overflow-hidden rounded-md px-4 bg-white">
            {children}
            <div className="px-4 py-4 bg-white">
              <div className="flex justify-between">
                <p className="text-red-500 mx-2">{error}</p>
                <SubmitButton
                  title="Search"
                  onClick={onClick}
                  loading={loading}
                  disabled={disabled}
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
