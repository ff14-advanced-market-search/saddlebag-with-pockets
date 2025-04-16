import { InputWithLabel } from '~/components/form/InputWithLabel'

interface DateInputsProps {
  startYear: number
  startMonth: number
  startDay: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onDayChange: (day: number) => void
  onError?: (error: string | undefined) => void
}

/**
 * Renders three numeric input fields for selecting a year, month, and day, each with labeled controls and value constraints.
 *
 * Calls the provided change handlers with the new numeric value when the user updates any input.
 *
 * @param startYear - The current value for the year input.
 * @param startMonth - The current value for the month input.
 * @param startDay - The current value for the day input.
 * @param onYearChange - Callback invoked with the new year value when the year input changes.
 * @param onMonthChange - Callback invoked with the new month value when the month input changes.
 * @param onDayChange - Callback invoked with the new day value when the day input changes.
 */
export default function DateInputs({
  startYear,
  startMonth,
  startDay,
  onYearChange,
  onMonthChange,
  onDayChange,
  onError
}: DateInputsProps) {
  const validateDates = () => {
    if (!startYear) {
      onError?.('Please enter a year')
      return false
    }
    if (!startMonth) {
      onError?.('Please enter a month')
      return false
    }
    if (!startDay) {
      onError?.('Please enter a day')
      return false
    }
    return true
  }

  const handleYearChange = (value: string) => {
    const year = value ? Number.parseInt(value) : 0
    onYearChange(year)
    validateDates()
  }

  const handleMonthChange = (value: string) => {
    const month = value ? Number.parseInt(value) : 0
    onMonthChange(month)
    validateDates()
  }

  const handleDayChange = (value: string) => {
    const day = value ? Number.parseInt(value) : 0
    onDayChange(day)
    validateDates()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <InputWithLabel
          labelTitle="Start Year"
          name="startYear"
          type="number"
          value={startYear || ''}
          onChange={(e) => handleYearChange(e.target.value)}
          min={2020}
          max={2090}
          required
        />
        <InputWithLabel
          labelTitle="Start Month"
          name="startMonth"
          type="number"
          value={startMonth || ''}
          onChange={(e) => handleMonthChange(e.target.value)}
          min={1}
          max={12}
          required
        />
        <InputWithLabel
          labelTitle="Start Day"
          name="startDay"
          type="number"
          value={startDay || ''}
          onChange={(e) => handleDayChange(e.target.value)}
          min={1}
          max={31}
          required
        />
      </div>
      {(!startYear || !startMonth || !startDay) && (
        <p className="text-sm text-red-500 dark:text-red-400">
          Please fill in all date fields
        </p>
      )}
    </div>
  )
}
