const getPluralEnding = (value: number) => {
  return value !== 1 ? 's' : ''
}

/**
 * Converts a past Date object to a human-readable relative time string.
 * @example
 * calculateTimeDifference(new Date('2023-09-15T12:00:00Z'), new Date('2023-09-16T15:34:00Z'))
 * '1 day ago'
 * @param {Date} dateFrom - The past date to compare against the current date.
 * @param {Date} nowDate - The current date.
 * @returns {string} A string indicating time passed since 'dateFrom' relative to 'nowDate'.
 * @description
 *   - Outputs are rounded to the nearest integer for seconds, minutes, hours, and days.
 *   - Returns relative time in the largest time unit that is less than the current time difference.
 *   - Supports singular and plural units (e.g., '1 minute' vs '2 minutes').
 *   - The function assumes 'nowDate' is always on or after 'dateFrom'.
 */
const getTimeFromNow = (dateFrom: Date, nowDate: Date) => {
  const timeDiffSec = Math.round(
    (nowDate.getTime() - dateFrom.getTime()) / 1000
  )
  if (timeDiffSec <= 0) {
    return '0 seconds ago'
  }

  if (timeDiffSec < 60) {
    return `${timeDiffSec} second${getPluralEnding(timeDiffSec)} ago`
  }
  const timeDiffMins = Math.round(timeDiffSec / 60)
  if (timeDiffMins < 60) {
    return `${timeDiffMins} minute${getPluralEnding(timeDiffMins)} ago`
  }

  const timeDiffHours = Math.round(timeDiffMins / 60)
  if (timeDiffHours < 24) {
    return `${timeDiffHours} hour${getPluralEnding(timeDiffHours)} ago`
  }

  const timeDiffDays = Math.round(timeDiffHours / 24)
  return `${timeDiffDays} day${getPluralEnding(timeDiffDays)} ago`
}

/**
* Renders a flexible date display component with hover effects.
* @example
* renderDateCell({ date: '2023-10-01T12:00:00Z', fixRight: true })
* // Returns a React component with formatted date display.
* @param {Object} config - Configuration object for rendering the date cell.
* @param {string|number} config.date - The date to display, provided as a string or timestamp.
* @param {boolean} [config.fixRight] - Optional flag to align tooltip to the right.
* @returns {JSX.Element} A React component containing the date display with hover feature.
* @description
*   - Utilizes a flexbox layout to position elements.
*   - Displays relative time text which updates based on the current date.
*   - Shows full date in a tooltip that appears on hover.
*   - The tooltip position can adjust based on the `fixRight` flag.
*/
const DateCell = ({
  date,
  fixRight
}: {
  date: string | number
  fixRight?: boolean
}) => {
  const valueAsDate = new Date(date)

  return (
    <div className="flex flex-1 justify-between relative">
      <p className="peer">{getTimeFromNow(valueAsDate, new Date())}</p>
      <p
        className={`absolute hidden peer-hover:bottom-6 peer-hover:flex bg-black opacity-80 text-sm text-white rounded px-3 py-1 ${
          fixRight ? ' -right-1' : 'left-0'
        }`}>
        {valueAsDate.toLocaleString()}
      </p>
    </div>
  )
}

export default DateCell
