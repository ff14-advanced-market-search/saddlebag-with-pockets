import {ReactComponent as Icon} from './svg/ItemCategory_Painting.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Paintings: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
