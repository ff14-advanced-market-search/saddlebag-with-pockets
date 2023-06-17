import Icon from './svg/ItemCategory_Miscellany.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Miscellany: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
