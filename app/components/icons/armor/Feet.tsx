import Icon from './svg/Armoury_Feet.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Feet: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
