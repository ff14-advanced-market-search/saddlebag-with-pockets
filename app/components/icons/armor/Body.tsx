import Icon from './svg/Armoury_Body.svg'
import { FC } from 'react'

type Props = {
  className?: string
}

export const Body: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
