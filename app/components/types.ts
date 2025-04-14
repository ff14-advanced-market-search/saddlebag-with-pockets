import type { Getter } from '@tanstack/table-core'

export type ColumnList<Type> = {
  columnId: string
  header: string
  dataAccessor?: (originalRow: Type) => string | number | null | undefined
  accessor?: (props: {
    row: Type
    getValue: Getter<unknown>
  }) => JSX.Element | null
  sortUndefined?: false | 'first' | 'last' | undefined
}
