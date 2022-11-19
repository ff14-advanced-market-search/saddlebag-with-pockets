const getPluralEnding = (value: number) => {
  return value !== 1 ? 's' : ''
}

const getTimeFromNow = (dateFrom: Date, nowDate: Date) => {
  const timeDiffSec = Math.round(
    (nowDate.getTime() - dateFrom.getTime()) / 1000
  )
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
        className={`absolute hidden peer-hover:bottom-6 peer-hover:flex bg-black opacity-80 text-sm text-white rounded px-3 py-1 z-50${
          fixRight ? ' -right-1' : 'left-0'
        }`}>
        {valueAsDate.toLocaleString()}
      </p>
    </div>
  )
}

export default DateCell
