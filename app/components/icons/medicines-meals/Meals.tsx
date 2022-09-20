import Icon   from "./svg/ItemCategory_Meal.svg"
import { FC } from "react"

type Props = {
  className?: string
}

export const Meals: FC<Props> = ({ className = "" }) =>
  {
    // @ts-ignore
    return <Icon className={className} />
  }
