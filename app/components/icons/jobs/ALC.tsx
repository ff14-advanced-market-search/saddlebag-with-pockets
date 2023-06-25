import ALCIcon from './svg/ItemCategory_ALC.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const ALC: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <ALCIcon className={className} />
}
