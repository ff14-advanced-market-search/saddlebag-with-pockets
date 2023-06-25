import MCHIcon from './svg/ItemCategory_MCH.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const MCH: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <MCHIcon className={className} />
}
