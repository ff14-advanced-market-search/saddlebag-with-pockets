import { InputWithLabel } from '~/components/form/InputWithLabel'

interface DateInputsProps {
  startYear: number
  startMonth: number
  startDay: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  onDayChange: (day: number) => void
}

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
