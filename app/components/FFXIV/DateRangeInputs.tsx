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
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Start Date
        </h4>
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

      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          End Date
        </h4>
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
