import { classNames } from '~/utils'
import Label from '../Label'

const Select = ({
  title,
  options,
  className,
  id,
  ...rest
}: {
  title?: string
  options: Array<{ label: string; value: string | number }>
  id?: string
  className?: string
} & React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>) => {
  const selectClassName =
    'flex-1 min-w-0 block w-full px-3 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400'

  const classes = classNames(selectClassName, className || '')

  return (
    <div className='my-2'>
      {title && <Label htmlFor={id}>{title}</Label>}
      <select id={id} className={classes} {...rest}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
