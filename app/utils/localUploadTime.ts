/** Keep the numeric instant for sorting and format only after browser hydration. */
export const localizeUploadTime = (
  raw: string,
  formatter: Intl.DateTimeFormat | null
) => {
  const timestamp = Date.parse(raw)
  const valid = Number.isFinite(timestamp)
  return {
    lastUploadLocal: valid ? timestamp : null,
    lastUploadTimeLocal: valid && formatter ? formatter.format(timestamp) : '—'
  }
}
