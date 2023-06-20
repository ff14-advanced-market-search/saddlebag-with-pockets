import Icon from './svg/ItemCategory_Minion.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Minions: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
