import Icon from './svg/ItemCategory_MIN.svg'
import {FC} from "react"

type Props = {
    className?: string;
}

export const Stone: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>
    }
