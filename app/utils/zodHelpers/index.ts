import type { ZodError, ZodLiteral, ZodNever, Primitive } from 'zod'

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

type MappedZodLiterals<T extends readonly Primitive[]> = {
  -readonly [K in keyof T]: ZodLiteral<T[K]>
}

function createManyUnion<
  A extends Readonly<[Primitive, Primitive, ...Primitive[]]>
>(literals: A) {
  return z.union(
    literals.map((value) => z.literal(value)) as MappedZodLiterals<A>
  )
}

export function createUnionSchema<T extends readonly []>(values: T): ZodNever
export function createUnionSchema<T extends readonly [Primitive]>(
  values: T
): ZodLiteral<T[0]>
export function createUnionSchema<
  T extends readonly [Primitive, Primitive, ...Primitive[]]
>(values: T): z.ZodUnion<MappedZodLiterals<T>>
/**
 * Creates a union schema based on the provided values.
 * @example
 * createUnionSchema(['string', 'number'])
 * Returns a Zod union type for string and number literals.
 * @param {readonly Primitive[]} values - Array of primitive values to create a union type from. Must have a length of at least 1.
 * @returns {ZodType} A union schema created using Zod library functions.
 * @description
 *   - Checks the length of the input array to determine whether to create a union, a literal, or a `never` schema.
 *   - Throws an error if the input array is empty.
 */
export function createUnionSchema<T extends readonly Primitive[]>(values: T) {
  if (values.length > 1) {
    return createManyUnion(
      values as typeof values & [Primitive, Primitive, ...Primitive[]]
    )
  } else if (values.length === 1) {
    return z.literal(values[0])
  } else if (values.length === 0) {
    return z.never()
  }
  throw new Error('Array must have a length')
}
