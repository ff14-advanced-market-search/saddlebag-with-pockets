import Icon from './svg/ItemCategory_FSH.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Seafood: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
