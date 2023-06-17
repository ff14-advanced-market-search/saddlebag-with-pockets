import BLUIcon from './svg/ItemCategory_BLU.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const BLU: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <BLUIcon className={className} />
}
