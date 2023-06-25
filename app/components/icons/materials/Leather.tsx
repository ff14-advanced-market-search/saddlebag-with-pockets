import Icon from './svg/ItemCategory_LTW.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Leather: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
