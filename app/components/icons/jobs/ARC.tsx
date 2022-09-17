import ARCIcon from './svg/ItemCategory_ARC.svg'
import { FC } from 'react'

type Props = {
  className?: string
}

export const ARC: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <ARCIcon className={className} />
}
