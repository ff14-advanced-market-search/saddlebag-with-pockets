import Icon from './svg/ItemCategory_WVR.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Cloth: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
