import { SubmitButton } from '../form/SubmitButton'

export interface JSONProps<DataType> {
  data: DataType[]
}

/**
 * Renders a button that copies the provided data as formatted JSON to the clipboard.
 *
 * When clicked, the button converts the given data into a pretty-printed JSON string (using a 2-space indent)
 * and attempts to write it to the clipboard via the Clipboard API. If the copy operation fails, the error is logged.
 *
 * @param data - The array of data items to be converted to JSON and copied.
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
    <SubmitButton type="button" title="Copy as JSON" onClick={handleCopy} />
  )
}
