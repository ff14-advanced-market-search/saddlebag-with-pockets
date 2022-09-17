import Icon from './svg/Armoury_Head.svg'
import { FC } from 'react'

type Props = {
  className?: string
}

export const Head: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
