import Icon from './svg/ItemCategory_OutdoorFurnishings.svg'
import { FC } from 'react'

type Props = {
  className?: string
}

export const OutdoorFurnishings: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
