import { useState } from 'react'
import Label from '../../Label'
import { ToolTip } from '~/components/Common/InfoToolTip'

interface CommodityQualitySelectProps {
  defaultValue?: string
  onChange: (value: string) => void
}

const CommodityQualitySelect = ({
  defaultValue = '0',
  onChange
}: CommodityQualitySelectProps) => {
  const [selected, setSelected] = useState(defaultValue)

  const handleChange = (value: string) => {
    setSelected(value)
    onChange(value)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-1 items-center gap-1 mt-0.5 relative">
        <Label>Minimum Commodity Quality</Label>
        <ToolTip data="Select the minimum quality of commodities you're interested in." />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="0"
            checked={selected === '0'}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio"
          />
          <span>No quality</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="1"
            checked={selected === '1'}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio"
          />
          <span>⭐</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="2"
            checked={selected === '2'}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio"
          />
          <span>⭐⭐</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="3"
            checked={selected === '3'}
            onChange={(e) => handleChange(e.target.value)}
            className="form-radio"
          />
          <span>⭐⭐⭐</span>
        </label>
      </div>
    </div>
  )
}

export default CommodityQualitySelect
