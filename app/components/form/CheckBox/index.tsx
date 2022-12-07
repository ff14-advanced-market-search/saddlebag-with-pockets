const CheckBox = ({
  labelTitle,
  className,
  ...rest
}: { labelTitle: string } & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <div className="flex justify-center items-center max-w-fit">
    <label htmlFor={rest?.id}>{labelTitle}</label>
    <input
      className={`ml-2 rounded p-1${className ? ` ${className}` : ''}`}
      type="checkbox"
      {...rest}
    />
  </div>
)

export default CheckBox
