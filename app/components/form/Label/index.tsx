export default function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
) {
  return (
    <label
      {...props}
      className="block text-sm font-medium text-gray-700 dark:text-grey-100 mt-0.5"
    />
  )
}
