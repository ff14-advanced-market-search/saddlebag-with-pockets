import {
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/solid'
import type { Table } from '@tanstack/react-table'
import { classNames } from '~/utils'

const numberSelection = [5, 10, 20, 30, 40, 50, 100, 200, 500] as const

const getDisabledClassNames = (isDisabled: boolean) =>
  classNames(
    'h-5 w-5 rounded-md flex text-center justify-center hover:bg-gray-300 dark:hover:bg-slate-600',
    isDisabled ? 'cursor-not-allowed' : ''
  )

/**
 * Creates pagination controls for navigating through table pages.
 * @example
 * paginationControls({ table: myTable })
 * Outputs the pagination controls component with buttons and page size selection.
 * @param {Table<any>} table - The table instance with pagination state and methods.
 * @returns {JSX.Element} JSX element representing pagination controls.
 * @description
 *   - Initializes disabled states for previous and next page buttons based on current page status.
 *   - Adjusts pagination state by changing page size and navigating between pages.
 *   - Displays current page number and total pages.
 */
const PaginationControls = ({ table }: { table: Table<any> }) => {
  const previousDisabled = !table.getCanPreviousPage()
  const nextDisabled = !table.getCanNextPage()

  const pageCount = table.getPageCount()

  return (
    <div className="pt-1 flex flex-row gap-0.5 items-center justify-center dark:text-gray-200">
      <select
        className={`flex-1 w-28 mr-4 block px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:text-gray-500 block shadow-sm sm:text-sm border-gray-300 rounded-md dark:border-gray-400 dark:text-gray-100 dark:bg-gray-600 dark:placeholder-gray-400`}
        aria-label="number of results to display"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}>
        {numberSelection.map((num) => (
          <option key={`pagination-${num}`} value={num}>
            {`Show ${num}`}
          </option>
        ))}
      </select>
      <button
        className={getDisabledClassNames(previousDisabled)}
        aria-label="previous"
        onClick={() => table.setPageIndex(0)}
        disabled={previousDisabled}>
        <ChevronDoubleLeftIcon className="dark:text-gray-300" />
      </button>
      <button
        className={getDisabledClassNames(previousDisabled)}
        aria-label="previous"
        onClick={() => table.previousPage()}
        disabled={previousDisabled}>
        <ChevronLeftIcon className="dark:text-gray-300" />
      </button>
      <p className="text-sm whitespace-nowrap">
        {`Page ${table.getState().pagination.pageIndex + 1} / ${pageCount}`}
      </p>
      <button
        className={getDisabledClassNames(nextDisabled)}
        aria-label="next"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}>
        <ChevronRightIcon className="dark:text-gray-300" />
      </button>
      <button
        className={getDisabledClassNames(nextDisabled)}
        aria-label="next"
        onClick={() => table.setPageIndex(pageCount - 1)}
        disabled={!table.getCanNextPage()}>
        <ChevronDoubleRightIcon className="dark:text-gray-300" />
      </button>
    </div>
  )
}

export default PaginationControls
