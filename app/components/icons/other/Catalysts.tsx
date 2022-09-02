import {ReactComponent as Icon} from './svg/ItemCategory_Catalyst.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Catalysts: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
