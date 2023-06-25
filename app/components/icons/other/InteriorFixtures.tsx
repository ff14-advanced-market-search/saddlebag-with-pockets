import Icon from './svg/ItemCategory_InteriorFixtures.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const InteriorFixtures: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <Icon className={className} />
}
