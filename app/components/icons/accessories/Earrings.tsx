import Icon from './svg/Armoury_Earrings.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Earrings: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
