import {ReactComponent as Icon} from './svg/ItemCategory_Tabletop.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Tabletop: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
