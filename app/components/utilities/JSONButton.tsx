import { SubmitButton } from '../form/SubmitButton'

export interface JSONProps<DataType> {
  data: DataType[]
}

/**
 * Renders a button that copies a JSON-formatted representation of the provided data to the clipboard.
 *
 * When the button is clicked, the component converts the given data to a pretty-printed JSON string and attempts to write it to the clipboard.
 * If the operation fails, an error is logged to the console.
 *
 * @param data - The array of items to be converted into JSON.
 *
 * @returns A button element that triggers the copy-to-clipboard action on click.
 */
export default function JSONButton<DataType>({ data }: JSONProps<DataType>) {
  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2)
    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        // Optional: Add success feedback
      })
      .catch((error) => {
        console.error('Failed to copy to clipboard:', error)
        // Optional: Add user feedback for failure
      })
  }

  return (
    <SubmitButton type='button' title='Copy as JSON' onClick={handleCopy} />
  )
}
