import GSMIcon from './svg/ItemCategory_GSM.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const GSM: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <GSMIcon className={className} />
}
