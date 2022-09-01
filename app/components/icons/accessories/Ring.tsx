import {ReactComponent as Icon} from './svg/Armoury_Ring.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Rings: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
