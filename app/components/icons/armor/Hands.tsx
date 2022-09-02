import Icon from './svg/Armoury_Hands.svg'
import {FC} from "react"

type Props = {
    className?: string;
}

export const Hands: FC<Props> = ({className = ''}) =>
    {
        // @ts-ignore
        return <Icon className={className}/>
    }
