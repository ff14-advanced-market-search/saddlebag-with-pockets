import Icon from './svg/ItemCategory_Wallmounted.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const WallMounted: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
