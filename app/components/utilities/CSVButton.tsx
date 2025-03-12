import { SubmitButton } from '../form/SubmitButton'

interface CSVColumn<T> {
  title: string
  value: keyof T
}

const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()
}

const createCSVString = (values: Array<string>): string => {
  return values.join('\r\n')
}

function mapValuesToString<DataType>(
  data: Array<DataType>,
  columns: Array<CSVColumn<DataType>>
): Array<string> {
  const result = [columns.map(({ title }) => `"${title}"`).join(',')]

  data.forEach((row) => {
    result.push(
      columns
        .map(({ value }) => {
          const hasValue = row[value]

          if (hasValue !== undefined && hasValue !== null) {
            return `"${hasValue.toString()}"`
          } 
            return '""'
          
        })
        .join(',')
    )
  })

  return result
}

function createCSVFromData<T>(
  data: Array<T>,
  columns: Array<CSVColumn<T>>,
  title: string
) {
  const stringValues = mapValuesToString(data, columns)
  const csvString = createCSVString(stringValues)
  downloadCSV(csvString, title)
}

export interface CSVProps<DataType> {
  filename: string
  data: Array<DataType>
  columns: Array<CSVColumn<DataType>>
}

export default function CSVButton<DataType>({
  filename,
  data,
  columns
}: CSVProps<DataType>) {
  const handleDownload = () => {
    createCSVFromData(data, columns, filename)
  }
  return (
    <SubmitButton
      type="button"
      title="Download as .csv"
      onClick={handleDownload}
    />
  )
}
