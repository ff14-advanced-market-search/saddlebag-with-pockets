import XMarkIcon from '~/icons/XMarkIcon'

const Modal: React.FC<{
  onClose: () => void
  children: React.ReactNode
  title: string
}> = ({ children, onClose, title }) => {
  return (
    <>
      <div
        className="z-[10001] bg-white fixed rounded top-5 bottom-5 left-3.5 right-3.5 sm:translate-y-[-50%] sm:top-2/4 sm:bottom-[none] sm:right-[none] sm:translate-x-[-50%] sm:left-2/4 p-4 pt-1 flex flex-col sm:max-w-fit sm:h-[90vh]"
        onClick={(e) => {
          e.stopPropagation()
        }}>
        <div className="flex justify-between items-center m-1 mt-0 py-0">
          <p className="font-semibold">{title}</p>
          <button
            className="flex text-gray-700 rounded p-2 justify-between items-center"
            type="button"
            aria-label="Close filter selection"
            onClick={onClose}>
            <XMarkIcon />
          </button>
        </div>
        <div className="overflow-scroll max-h-full">{children}</div>
      </div>
      <div
        className="z-[10000] opacity-75 fixed inset-0 bg-black"
        onClick={onClose}></div>
    </>
  )
}

export default Modal
