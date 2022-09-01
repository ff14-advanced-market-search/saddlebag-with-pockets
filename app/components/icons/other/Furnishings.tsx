import {ReactComponent as Icon} from './svg/ItemCategory_Furnishing.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Furnishings: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
