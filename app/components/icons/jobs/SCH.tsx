import SCHIcon from './svg/ItemCategory_SCH.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const SCH: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <SCHIcon className={className} />
}
