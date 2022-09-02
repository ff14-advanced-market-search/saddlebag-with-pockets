import {ReactComponent as Icon} from './svg/ItemCategory_Wallmounted.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const WallMounted: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
