import {ReactComponent as Icon} from './svg/ItemCategory_Rug.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Rugs: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
