import MRDIcon from './svg/ItemCategory_MRD.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const MRD: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <MRDIcon className={className} />
}
