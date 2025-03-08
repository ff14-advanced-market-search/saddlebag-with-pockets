const CheckBox = ({
  labelTitle,
  className,
  labelClassName,
  ...rest
}: { labelTitle: string; labelClassName?: string } & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <div className='flex justify-center items-center max-w-fit'>
    <label
      htmlFor={rest?.id}
      className={`dark:text-gray-200 ${labelClassName}`}
    >
      {labelTitle}
    </label>
    <input
      className={`ml-2 rounded p-1${className ? ` ${className}` : ''}`}
      type='checkbox'
      {...rest}
    />
  </div>
)

export default CheckBox
