import {ReactComponent as Icon} from './svg/ItemCategory_Crystal.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Crystals: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
