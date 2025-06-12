import { SubmitButton } from '../form/SubmitButton'

interface JSONDownloadProps<DataType> {
  filename: string
  data: DataType[]
}

const downloadJSON = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

export default function JSONDownloadButton<DataType>({
  filename,
  data
}: JSONDownloadProps<DataType>) {
  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2)
    downloadJSON(jsonString, filename)
  }

  return (
    <SubmitButton
      type="button"
      title="Download as JSON"
      onClick={handleDownload}
    />
  )
}
