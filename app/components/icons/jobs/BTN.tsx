import BTNIcon from './svg/ItemCategory_BTN.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const BTN: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <BTNIcon className={className} />
}
