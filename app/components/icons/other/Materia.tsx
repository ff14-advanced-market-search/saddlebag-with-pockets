import Icon from './svg/ItemCategory_Materia.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Materia: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
