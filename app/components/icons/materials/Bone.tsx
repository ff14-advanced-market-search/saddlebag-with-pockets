import Icon   from "./svg/ItemCategory_Bone.svg"
import { FC } from "react"

type Props = {
  className?: string
}

export const Bone: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <Icon className={className} />
  }
