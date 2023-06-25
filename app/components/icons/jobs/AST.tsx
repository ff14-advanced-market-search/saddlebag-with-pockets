import ASTIcon from './svg/ItemCategory_AST.svg'
import type { FC } from 'react'

type Props = {
  className?: string
}

export const AST: FC<Props> = ({ className = '' }) => {
  // @ts-ignore
  return <ASTIcon className={className} />
}
