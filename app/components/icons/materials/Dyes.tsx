import Icon   from "./svg/ItemCategory_Dye.svg"
import { FC } from "react"

type Props = {
  className?: string
}

export const Dyes: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <Icon className={className} />
  }
