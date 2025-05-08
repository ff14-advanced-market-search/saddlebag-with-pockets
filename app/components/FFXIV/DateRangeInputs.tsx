import { useEffect } from 'react'
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
  // Validate date range whenever any date part changes
  useEffect(() => {
    if (
      !startYear ||
      !startMonth ||
      !startDay ||
      !endYear ||
      !endMonth ||
      !endDay
    ) {
      return
    }

    const startDate = new Date(startYear, startMonth - 1, startDay)
    const endDate = new Date(endYear, endMonth - 1, endDay)

    if (endDate < startDate) {
      onError('End date must be after start date')
    } else {
      onError(undefined)
    }
  }, [startYear, startMonth, startDay, endYear, endMonth, endDay, onError])

  const handleStartDateChange = (year: number, month: number, day: number) => {
    if (year !== startYear) onStartYearChange(year)
    if (month !== startMonth) onStartMonthChange(month)
    if (day !== startDay) onStartDayChange(day)
  }

  const handleEndDateChange = (year: number, month: number, day: number) => {
    if (year !== endYear) onEndYearChange(year)
    if (month !== endMonth) onEndMonthChange(month)
    if (day !== endDay) onEndDayChange(day)
  }

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
          onYearChange={(year) =>
            handleStartDateChange(year, startMonth, startDay)
          }
          onMonthChange={(month) =>
            handleStartDateChange(startYear, month, startDay)
          }
          onDayChange={(day) =>
            handleStartDateChange(startYear, startMonth, day)
          }
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
          onYearChange={(year) => handleEndDateChange(year, endMonth, endDay)}
          onMonthChange={(month) => handleEndDateChange(endYear, month, endDay)}
          onDayChange={(day) => handleEndDateChange(endYear, endMonth, day)}
          onError={onError}
        />
      </div>
    </div>
  )
}
