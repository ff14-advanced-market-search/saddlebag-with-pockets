import {ReactComponent as Icon} from './svg/ItemCategory_OrchestrionRoll.svg'
import {FC} from "react";

type Props = {
    className?: string;
}

export const OrchestrationComponents: FC<Props> = ({className = ''}) => {
    return <Icon className={className}/>
}
