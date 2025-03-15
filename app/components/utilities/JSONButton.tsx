import { SubmitButton } from '../form/SubmitButton'

export interface JSONProps<DataType> {
  data: DataType[]
}

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
