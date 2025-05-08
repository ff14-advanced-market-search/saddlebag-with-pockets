import type { Getter } from '@tanstack/table-core'

export type ColumnList<Type> = {
  columnId: string
  header: string
  dataAccessor?: (originalRow: Type) => string | number | null | undefined
  accessor?: (props: {
    row: Type
    // if this breaks, then change it back to:
    // getValue: Getter<unknown>
    getValue: () => ReturnType<NonNullable<ColumnList<Type>['dataAccessor']>>
  }) => JSX.Element | null
  sortUndefined?: false | 'first' | 'last' | undefined
}
