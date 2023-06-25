import { useEffect, useState, forwardRef } from 'react'

type DebouncedInputProps = {
  debounceTimer?: number
  onDebouncedChange: (debouncedValue: string) => void
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ onDebouncedChange, debounceTimer = 250, ...rest }, ref) => {
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

    return <input ref={ref} onChange={handleInputChange} {...rest} />
  }
)

DebouncedInput.displayName = 'DebouncedInput'

export default DebouncedInput
