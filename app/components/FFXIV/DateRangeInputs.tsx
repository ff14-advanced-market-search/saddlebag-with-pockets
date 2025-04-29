import DateInputs from '../WoW/DateInputs'

interface DateRangeInputsProps {
  startYear: number
  startMonth: number
  startDay: number
  endYear: number
  endMonth: number
  endDay: number
  onStartYearChange: (year: number) => void
  onStartMonthChange: (month: number) => void
  onStartDayChange: (day: number) => void
  onEndYearChange: (year: number) => void
  onEndMonthChange: (month: number) => void
  onEndDayChange: (day: number) => void
  onError: (error: string | undefined) => void
}

export default function DateRangeInputs({
  startYear,
  startMonth,
  startDay,
  endYear,
  endMonth,
  endDay,
  onStartYearChange,
  onStartMonthChange,
  onStartDayChange,
  onEndYearChange,
  onEndMonthChange,
  onEndDayChange,
  onError
}: DateRangeInputsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-4">
        <DateInputs
          startYear={startYear}
          startMonth={startMonth}
          startDay={startDay}
          onYearChange={onStartYearChange}
          onMonthChange={onStartMonthChange}
          onDayChange={onStartDayChange}
          onError={onError}
        />
      </div>

      <div className="space-y-4">
        <DateInputs
          startYear={endYear}
          startMonth={endMonth}
          startDay={endDay}
          onYearChange={onEndYearChange}
          onMonthChange={onEndMonthChange}
          onDayChange={onEndDayChange}
          onError={onError}
        />
      </div>
    </div>
  )
}
