import {ReactComponent as Icon} from './svg/ItemCategory_ARM.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Metal: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
