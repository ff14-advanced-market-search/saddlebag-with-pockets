import ARMIcon from "./svg/ItemCategory_ARM.svg"
import { FC }  from "react"

type Props = {
  className?: string
}

export const ARM: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <ARMIcon className={className} />
  }
