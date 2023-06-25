import Icon from './svg/ItemCategory_Medicine.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Medicine: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
