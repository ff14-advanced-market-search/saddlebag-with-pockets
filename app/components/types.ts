import type { Getter } from '@tanstack/table-core'

export type ColumnList<Type> = {
  columnId: string
  header: string
  accessor?: (props: {
    row: Type
    getValue: Getter<unknown>
  }) => JSX.Element | null
}
