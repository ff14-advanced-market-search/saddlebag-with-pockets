import {ReactComponent as Icon} from './svg/ItemCategory_ChairsandBeds.svg'
import {FC}                     from "react"

type Props = {
    className?: string;
}

export const ChairsAndBeds: FC<Props> = ({className = ''}) =>
    {
        return <Icon className={className}/>
    }
