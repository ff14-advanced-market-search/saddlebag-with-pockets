import Icon from './svg/ItemCategory_MIN.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Stone: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
