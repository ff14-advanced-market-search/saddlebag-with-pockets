import {ReactComponent as Icon} from './svg/Armoury_Legs.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Legs: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
