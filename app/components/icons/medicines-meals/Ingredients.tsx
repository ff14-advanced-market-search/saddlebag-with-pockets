import {ReactComponent as Icon} from './svg/ItemCategory_CUL.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Ingredients: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
