interface CheckboxRowProps {
  selected: boolean
  onChange: (e: React.ChangeEvent) => void
  id: string | number
  title: string
}

export const CheckBoxRow = ({
  selected,
  onChange,
  id,
  title
}: CheckboxRowProps) => {
  return (
    <div className="w-[95%] flex px-1 py-2 z-[inherit] shadow-sm mb-0.5 content-between items-center min-h-12 dark:text-gray-300 dark:border-b dark:border-gray-500">
      <label htmlFor={`${title}-${id}`} className="grow text-left">
        {title}
      </label>
      <input
        id={`${title}-${id}`}
        checked={selected}
        onChange={onChange}
        type="checkbox"
      />
    </div>
  )
}
