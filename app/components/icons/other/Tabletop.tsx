import Icon   from "./svg/ItemCategory_Tabletop.svg"
import { FC } from "react"

type Props = {
  className?: string
}

export const Tabletop: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <Icon className={className} />
  }
