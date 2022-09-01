import {ReactComponent as Icon} from './svg/Armoury_Bracelets.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Bracelets: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
