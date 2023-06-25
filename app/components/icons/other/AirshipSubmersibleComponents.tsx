import Icon from './svg/ItemCategory_Airship.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const AirshipSubmersibleComponents: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
