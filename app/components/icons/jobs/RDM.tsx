import RDMIcon from './svg/ItemCategory_RDM.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const RDM: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <RDMIcon className={className} />
}
