import ACNIcon from "./svg/ItemCategory_ACN.svg"
import { FC }  from "react"

type Props = {
  className?: string
}

export const ACN: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <ACNIcon className={className} />
  }
