import {ReactComponent as Icon} from './svg/ItemCategory_FSH.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Seafood: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
