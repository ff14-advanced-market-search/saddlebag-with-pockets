import THMIcon from "./svg/ItemCategory_THM.svg"
import { FC }  from "react"

type Props = {
  className?: string
}

export const THM: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <THMIcon className={className} />
  }
