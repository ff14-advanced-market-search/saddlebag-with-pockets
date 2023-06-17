import Icon from './svg/ItemCategory_Furnishing.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Furnishings: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
