import { SubmitButton } from '../form/SubmitButton'

export interface JSONProps<DataType> {
  data: Array<DataType>
}

export default function JSONButton<DataType>({ data }: JSONProps<DataType>) {
  const handleCopy = () => {
    const jsonString = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(jsonString)
  }

  return (
    <SubmitButton type="button" title="Copy as JSON" onClick={handleCopy} />
  )
}
