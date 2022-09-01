import {ReactComponent as Icon} from './svg/ItemCategory_WVR.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Cloth: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
