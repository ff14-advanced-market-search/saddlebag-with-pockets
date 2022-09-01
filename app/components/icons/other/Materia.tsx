import {ReactComponent as Icon} from './svg/ItemCategory_Materia.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Materia: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
