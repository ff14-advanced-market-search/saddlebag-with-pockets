import {ReactComponent as Icon} from './svg/ItemCategory_Medicine.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Medicine: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
