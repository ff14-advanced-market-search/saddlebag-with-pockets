import PGLIcon from './svg/ItemCategory_PGL.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const PGL: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <PGLIcon className={className} />
}
