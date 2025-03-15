import XMarkIcon from '~/icons/XMarkIcon'
import React from 'react'

/**
 * Renders a modal component with a title and close functionality.
 * @example
 * Modal({ children: <Content />, onClose: handleClose, title: "Sample Title" })
 * returns JSX for a modal with the specified content and title.
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @param {Function} onClose - Callback function to execute when the modal is closed.
 * @param {string} title - The title of the modal.
 * @returns {JSX.Element} A modal component containing the provided children and title.
 * @description
 *   - The modal traps click events within itself unless the background is clicked, which triggers the close function.
 *   - The render includes two main blocks: the modal content and a transparent overlay for closing the modal.
 *   - The modal's position adapts responsively with tailored style properties for different screen sizes.
 */
const Modal: React.FC<{
  onClose: () => void
  children: React.ReactNode
  title?: string
/**
* Renders a modal component with a title and close functionality.
* @example
* ModalComponent({ children: <Content />, onClose: handleClose, title: "Sample Title" })
* returns JSX for a modal with the specified content and title.
* @param {React.ReactNode} children - The content to be displayed inside the modal.
* @param {Function} onClose - Callback function to execute when the modal is closed.
* @param {string} title - The title of the modal.
* @returns {JSX.Element} A modal component containing the provided children and title.
* @description
*   - The modal traps click events within itself unless the background is clicked, which triggers the close function.
*   - The render includes two main blocks: the modal content and a transparent overlay for closing the modal.
*   - The modal's position adapts responsively with tailored style properties for different screen sizes.
*/
}> = ({ children, onClose, title }) => {
  return (
    <>
      <div
        className="z-[10001] bg-white dark:bg-slate-700 fixed rounded top-5 bottom-24 md:bottom-5 left-3.5 right-3.5 sm:translate-y-[-50%] sm:top-2/4 sm:bottom-[none] sm:right-[none] sm:translate-x-[-50%] sm:left-2/4 p-4 pt-1 flex flex-col sm:max-w-fit sm:h-[90vh]"
        onClick={(e) => {
          e.stopPropagation()
        }}>
        <div className="flex justify-between items-center m-1 mt-0 py-0">
          <p className="font-semibold dark:text-gray-100">{title}</p>
          <button
            className="flex text-gray-700 dark:text-gray-300 rounded p-2 justify-between items-center"
            type="button"
            aria-label="Close filter selection"
            onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>
        <div className="overflow-auto max-h-full">{children}</div>
      </div>
      <div
        className="z-[10000] opacity-75 dark:opacity-50 fixed inset-0 bg-black"
        onClick={onClose}></div>
    </>
  )
}

export default Modal
