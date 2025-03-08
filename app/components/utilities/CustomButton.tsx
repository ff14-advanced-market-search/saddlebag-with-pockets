// app/components/utilities/CustomButton.tsx
import type { FC } from 'react'
import { LinkIcon } from '@heroicons/react/solid'
import { NavLink } from '@remix-run/react'

type Props = {
  link: string
  buttonText: string
}

const CustomButton: FC<Props> = ({ link, buttonText }) => {
  return (
    <NavLink to={link} target="_blank" title={buttonText}>
      <span className="group inline-flex items-center rounded-md bg-black px-2.5 py-1 text-sm font-medium text-white cursor-pointer overflow-hidden">
        <span className="h-[26px] flex items-center group-hover:scale-110 transition ease-in-out duration-300">
          {buttonText}
          <LinkIcon className="h-4 w-4 inline align-text-bottom ml-1" />
        </span>
      </span>
    </NavLink>
  )
}

export default CustomButton
