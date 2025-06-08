import { NavLink } from 'react-router'

export const PreviousResultsLink = ({ to }: { to: string }) => (
  <NavLink
    to={to}
    className={
      'bg-gray-700 dark:bg-blue-500 text-white items-center px-4 py-2 text-base font-medium rounded-md'
    }>
    See last search
  </NavLink>
)
