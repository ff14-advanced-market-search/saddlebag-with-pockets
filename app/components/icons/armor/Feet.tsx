import {ReactComponent as Icon} from './svg/Armoury_Feet.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Feet: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
