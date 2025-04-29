import type { Getter } from '@tanstack/table-core'

export type ColumnList<Type> = {
  columnId: string
  header: string
  dataAccessor?: (originalRow: Type) => string | number | null | undefined
  cell?: (props: { row: Type; getValue: Getter<any> }) => JSX.Element | null
  sortUndefined?: false | 'first' | 'last' | undefined
}
