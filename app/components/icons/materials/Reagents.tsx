import {ReactComponent as Icon} from './svg/ItemCategory_ALC.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Reagents: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
