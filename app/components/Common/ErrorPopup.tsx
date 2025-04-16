interface ErrorPopupProps {
  error: string | Error | unknown
  onClose: () => void
}

/**
 * Displays a modal popup with an error message and options to close the dialog.
 *
 * Shows the provided error message or a default message if the error is unknown. The popup overlays the entire viewport and supports both light and dark themes.
 *
 * @param error - The error to display, which can be a string, an Error object, or any unknown value.
 * @param onClose - Callback invoked when the popup is closed.
 */
export default function ErrorPopup({ error, onClose }: ErrorPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
            Error
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <div className="text-gray-700 dark:text-gray-300">
            {error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unknown error occurred'}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
