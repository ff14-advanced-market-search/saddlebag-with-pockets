import Icon from './svg/ItemCategory_ChairsandBeds.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const ChairsAndBeds: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
