import type { ZodError } from 'zod'
import z from 'zod'

export const parseNumber = (value: any) => parseInt(value, 10)

export const parseStringToNumber = z.string().transform(parseNumber)

export const parseOptionalStringToNumber = parseStringToNumber.optional()

export const parseCheckboxBoolean = z
  .string()
  .transform((value) => value === 'on')

export const parseOptionalCheckboxBoolean = parseCheckboxBoolean.optional()

export const parseStringToNumberArray = z
  .string()
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
