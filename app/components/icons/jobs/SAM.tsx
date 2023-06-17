import SAMIcon from './svg/ItemCategory_SAM.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const SAM: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <SAMIcon className={className} />
}
