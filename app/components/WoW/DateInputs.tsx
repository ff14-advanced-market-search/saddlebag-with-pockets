import { InputWithLabel } from '~/components/form/InputWithLabel'

interface DateInputsProps {
  startYear: number
  startMonth: number
  startDay: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onDayChange: (day: number) => void
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
  onDayChange
}: DateInputsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <InputWithLabel
        labelTitle="Start Year"
        name="startYear"
        type="number"
        value={startYear}
        onChange={(e) => onYearChange(Number.parseInt(e.target.value))}
        min={2020}
        max={2090}
      />
      <InputWithLabel
        labelTitle="Start Month"
        name="startMonth"
        type="number"
        value={startMonth}
        onChange={(e) => onMonthChange(Number.parseInt(e.target.value))}
        min={1}
        max={12}
      />
      <InputWithLabel
        labelTitle="Start Day"
        name="startDay"
        type="number"
        value={startDay}
        onChange={(e) => onDayChange(Number.parseInt(e.target.value))}
        min={1}
        max={31}
      />
    </div>
  )
}
