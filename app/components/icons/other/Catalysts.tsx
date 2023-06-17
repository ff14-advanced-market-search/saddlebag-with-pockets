import Icon from './svg/ItemCategory_Catalyst.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Catalysts: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
