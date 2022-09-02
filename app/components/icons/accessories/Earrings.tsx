import {ReactComponent as Icon} from './svg/Armoury_Earrings.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const Earrings: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
