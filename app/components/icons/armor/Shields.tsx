import Icon   from "./svg/ItemCategory_Shield.svg"
import { FC } from "react"

type Props = {
  className?: string
}

export const Shields: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <Icon className={className} />
  }
