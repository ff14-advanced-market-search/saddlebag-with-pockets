import Icon from './svg/Armoury_Bracelets.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const Bracelets: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
