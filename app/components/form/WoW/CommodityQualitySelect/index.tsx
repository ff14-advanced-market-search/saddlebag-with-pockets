import { useState } from 'react'
import Label from '../../Label'

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
      <Label>Commodity Quality</Label>
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
