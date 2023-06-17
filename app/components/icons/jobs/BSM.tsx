import BSMIcon from './svg/ItemCategory_BSM.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const BSM: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <BSMIcon className={className} />
}
