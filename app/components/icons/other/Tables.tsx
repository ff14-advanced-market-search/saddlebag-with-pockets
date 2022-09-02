import {ReactComponent as Icon} from './svg/ItemCategory_Tables.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Tables: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
