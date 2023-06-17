import Icon from './svg/ItemCategory_CRP.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Lumber: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
