import { NavLink } from '@remix-run/react'

export const PreviousResultsLink = ({ to }: { to: string }) => (
  <NavLink
    to={to}
    className={
      'bg-gray-700 text-white items-center px-4 py-2 text-base font-medium rounded-md'
    }>
    See previous search
  </NavLink>
)
