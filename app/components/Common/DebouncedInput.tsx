import { useEffect, useState } from 'react'
export default function DebouncedInput({
  onDebouncedChange,
  debounceTimer = 250,
  ...rest
}: {
  debounceTimer?: number
  onDebouncedChange: (debouncedValue: string) => void
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDebouncedChange(inputValue)
    }, debounceTimer)
    return () => clearTimeout(timeoutId)
  }, [inputValue, onDebouncedChange, debounceTimer])

  return <input onChange={handleInputChange} {...rest} />
}
