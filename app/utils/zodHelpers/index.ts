import type { ZodError } from 'zod'
import z from 'zod'

export const parseNumber = (value: any) => parseInt(value, 10)

export const parseStringToNumber = z.string().min(1).transform(parseNumber)

export const parseCheckboxBoolean = z
  .string()
  .default('false')
  .transform((value) => value === 'on')

export const parseStringToNumberArray = z
  .string()
  .min(1)
  .transform((value) => value.split(',').map(parseNumber))

export const parseZodErrorsToDisplayString = (
  error: ZodError,
  inputMap: Record<string, string>
) => {
  return `Missing: ${error.issues
    .map(({ path }) =>
      path.map((field) => inputMap[field] || 'Unknown input error')
    )
    .join(', ')}`
}
