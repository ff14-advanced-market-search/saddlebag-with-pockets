import { SubmitButton } from '../form/SubmitButton'

export interface JSONProps<DataType> {
  data: DataType[]
}

/**
* Renders a button to copy given data as a JSON string to the clipboard
* @example
* JSONButton({ data: { key: "value" } })
* Button rendered with click functionality to copy JSON string
* @param {Object} data - The data object to be converted and copied as a JSON string.
* @returns {JSX.Element} JSX element for a submit button that copies the data as JSON.
* @description
*   - Utilizes the Clipboard API to write text to the clipboard.
*   - Converts the data object into a formatted JSON string with 2 spaces indentation.
*/
export default function JSONButton<DataType>({ data }: JSONProps<DataType>) {
  /**
  * Copies a JSON data object to the clipboard as a formatted string.
  * @example
  * copyJsonToClipboard(data)
  * undefined
  * @param {Object} data - The JavaScript object to convert to a JSON string and copy.
  * @returns {void} Does not return a value.
  * @description
  *   - Converts a JavaScript object to a JSON string.
  *   - Formats the JSON string with an indentation of 2 spaces.
  *   - Utilizes the Clipboard API to write the formatted string to the clipboard.
  *   - Handles potential errors that may occur during the clipboard write operation.
  */
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
