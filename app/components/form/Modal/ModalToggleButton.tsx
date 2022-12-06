export const ModalToggleButton = ({
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <div className={`mt-1 flex rounded-md shadow-sm max-w-fit`}>
      <button
        className={`w-full py-2 px-4 text-sm bg-gray-100 border-gray-300 rounded text-left${
          className ? ' ' + className : ''
        }`}
        {...rest}>
        {rest?.children}
      </button>
    </div>
  )
}
