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

/**
 * Converts an array of objects into a CSV-formatted string array.
 * @example
 * mapValuesToString([{name: 'John', age: 30}], [{title: 'Name', value: 'name'}, {title: 'Age', value: 'age'}])
 * returns ['"Name","Age"', '"John","30"']
 * @param {Array<DataType>} data - Array of data objects to be converted.
 * @param {Array<CSVColumn<DataType>>} columns - Array defining the CSV column titles and how to map object values.
 * @returns {Array<string>} Returns an array of strings formatted as CSV from given data and columns.
 * @description
 *   - Each object in the 'data' array is transformed into a CSV row based on the 'columns' mapping.
 *   - If a value in a data object is undefined or null, it is represented as an empty string in the CSV.
 *   - The column titles are included as the first row in the resulting CSV string array.
 *   - The function expects that the 'columns' parameter accurately reflects keys present in 'data' objects.
 */
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
          } else {
            return '""'
          }
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

/**
* Renders a button which triggers the download of data as a CSV file.
* @example
* CSVButton({ filename: 'data.csv', data: [{name: 'Alice', age: 30}], columns: ['name', 'age'] })
* // Triggers download of a CSV file named 'data.csv'
* @param {Object} props - The properties for configuring the CSV download.
* @param {string} props.filename - Name of the CSV file to be downloaded.
* @param {Array<DataType>} props.data - The data to be exported as CSV.
* @param {Array<string>} props.columns - The headers for the CSV file.
* @returns {JSX.Element} A submit button component for CSV download.
* @description
*   - Uses `createCSVFromData` to transform provided data into a CSV format.
*   - The button, when clicked, triggers the CSV file download with specified filename.
*   - Ensure `data` aligns with the `columns` for accurate CSV formatting.
*/
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
