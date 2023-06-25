import Icon from './svg/ItemCategory_Gardening.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const GardeningItems: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
