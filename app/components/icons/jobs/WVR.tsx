import WVRIcon from './svg/ItemCategory_WVR.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const WVR: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <WVRIcon className={className} />
}
