import {ReactComponent as Icon} from './svg/ItemCategory_LTW.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Leather: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
