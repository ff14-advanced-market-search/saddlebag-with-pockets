import Icon from './svg/Armoury_Ring.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Rings: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
