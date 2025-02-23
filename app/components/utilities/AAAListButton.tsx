import { SubmitButton } from '../form/SubmitButton'

export interface AAAListProps<DataType> {
  data: Array<DataType>
}

export default function AAAListButton<DataType extends { itemID: number }>({ 
  data 
}: AAAListProps<DataType>) {
  const handleCopy = () => {
    const formattedData = data.reduce((acc, item) => {
      // Use avgTSMPrice if it exists (for pets), otherwise use historicPrice
      const price = 'avgTSMPrice' in item 
        ? (item as any).avgTSMPrice 
        : (item as any).historicPrice
        
      return {
        ...acc,
        [item.itemID]: price
      }
    }, {})

    navigator.clipboard.writeText(JSON.stringify(formattedData, null, 2))
  }

  return (
    <SubmitButton
      type="button"
      title="Copy AAA List"
      onClick={handleCopy}
    />
  )
} 