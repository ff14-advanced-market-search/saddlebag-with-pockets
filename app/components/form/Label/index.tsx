export default function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
) {
  return (
    <label
      {...props}
      className={
        'block text-sm font-medium text-gray-700 dark:text-gray-200 mt-0.5 dark:bg-transparent'
      }
    />
  )
}
