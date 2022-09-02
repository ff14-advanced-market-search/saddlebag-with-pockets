import {ReactComponent as Icon} from './svg/ItemCategory_CRP.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Lumber: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
