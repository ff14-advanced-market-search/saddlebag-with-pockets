import Icon from './svg/ItemCategory_Miscellany.svg'
import { FC } from 'react'

type Props = {
  className?: string
}

export const RegistrableMiscellany: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
