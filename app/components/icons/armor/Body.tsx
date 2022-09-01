import {ReactComponent as Icon} from './svg/Armoury_Body.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const Body: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
