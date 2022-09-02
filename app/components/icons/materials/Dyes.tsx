import {ReactComponent as Icon} from './svg/ItemCategory_Dye.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Dyes: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
