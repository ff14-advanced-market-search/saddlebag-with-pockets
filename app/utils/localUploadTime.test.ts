import { expect, test } from 'vitest'
import { localizeUploadTime } from './localUploadTime'

test('formats raw GMT in the selected locale and timezone, including date rollover', () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    dateStyle: 'medium',
    timeStyle: 'long'
  })
  const result = localizeUploadTime('Fri, 13 Nov 2026 01:25:21 GMT', formatter)
  expect(result.lastUploadTimeLocal).toMatch(/Nov\D+12\D+2026/)
  expect(result.lastUploadTimeLocal).toMatch(/5:25:21\s*PM/)
  expect(result.lastUploadLocal).toBe(Date.UTC(2026, 10, 13, 1, 25, 21))
})

test('honors regional formatting and daylight saving time', () => {
  const formatter = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'medium',
    timeStyle: 'long'
  })
  const result = localizeUploadTime('Wed, 01 Jul 2026 12:00:00 GMT', formatter)
  expect(result.lastUploadTimeLocal).toMatch(/0?1\D+0?7\D+2026/)
  expect(result.lastUploadTimeLocal).toContain('14:00:00')
})

test('leaves a stable placeholder before browser settings are available', () => {
  expect(
    localizeUploadTime('Fri, 13 Nov 2026 01:25:21 GMT', null)
      .lastUploadTimeLocal
  ).toBe('—')
})

test.each(['', 'invalid', 'not available'])(
  'handles missing or invalid raw times: %s',
  (raw) => {
    expect(localizeUploadTime(raw, new Intl.DateTimeFormat())).toEqual({
      lastUploadLocal: null,
      lastUploadTimeLocal: '—'
    })
  }
)
